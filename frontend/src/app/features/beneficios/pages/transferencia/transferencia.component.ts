import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { Beneficio } from '../../models/beneficio.model';
import { BeneficioService } from '../../services/beneficio.service';
import { TransferenciaHistoryService } from '../../services/transferencia-history.service';

import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterLink, NgxMaskDirective],
  templateUrl: './transferencia.component.html',
  styleUrl: './transferencia.component.css'
})
export class TransferenciaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly beneficioService = inject(BeneficioService);
  private readonly transferenciaHistoryService = inject(TransferenciaHistoryService);

  beneficios = signal<Beneficio[]>([]);
  carregando = signal(false);
  salvando = signal(false);
  erro = signal<string | null>(null);

  origemIdSelecionado = signal<number | null>(null);
  destinoIdSelecionado = signal<number | null>(null);
  valorTransferencia = signal<number>(0);

  form = this.fb.group({
    origemId: [null as number | null, [Validators.required]],
    destinoId: [null as number | null, [Validators.required]],
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]]
  });

  origemSelecionada = computed(() =>
    this.beneficios().find(b => Number(b.id) === Number(this.origemIdSelecionado())) ?? null
  );

  destinoSelecionado = computed(() =>
    this.beneficios().find(b => Number(b.id) === Number(this.destinoIdSelecionado())) ?? null
  );

  beneficiosDestino = computed(() =>
    this.beneficios().filter(b => Number(b.id) !== Number(this.origemIdSelecionado()))
  );

  ngOnInit(): void {
    this.carregarBeneficios();

    this.form.valueChanges.subscribe(value => {
      this.origemIdSelecionado.set(value.origemId ? Number(value.origemId) : null);
      this.destinoIdSelecionado.set(value.destinoId ? Number(value.destinoId) : null);
      this.valorTransferencia.set(value.valor ? Number(value.valor) : 0);
    });
  }

  carregarBeneficios(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.beneficioService.listar().subscribe({
      next: beneficios => {
        this.beneficios.set(Array.isArray(beneficios) ? beneficios.filter(b => b.ativo) : []);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os benefícios.');
        this.carregando.set(false);
      }
    });
  }

  campoInvalido(campo: 'origemId' | 'destinoId' | 'valor'): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  transferir(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const origem = this.origemSelecionada();
    const destino = this.destinoSelecionado();
    const valor = Number(this.form.value.valor);

    if (!origem || !destino) {
      return;
    }

    if (origem.id === destino.id) {
      Swal.fire('Atenção', 'Origem e destino não podem ser iguais.', 'warning');
      return;
    }

    if (valor > Number(origem.valor)) {
      Swal.fire('Saldo insuficiente', 'O valor informado é maior que o saldo do benefício de origem.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Confirmar transferência?',
      html: `
        <strong>${origem.nome}</strong> para <strong>${destino.nome}</strong><br>
        <span style="font-size: 1.4rem; font-weight: 800; color: #003641">
          R$ ${valor.toFixed(2)}
        </span>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: 'sicoob-alert-popup',
        confirmButton: 'btn btn-sicoob sicoob-alert-button',
        cancelButton: 'btn btn-outline-sicoob sicoob-alert-button'
      }
    }).then(result => {
      if (!result.isConfirmed) return;

      this.salvando.set(true);

      this.beneficioService.transferir(origem.id, destino.id, valor).subscribe({
        next: () => {
          this.transferenciaHistoryService.salvar({
            origemId: origem.id,
            destinoId: destino.id,
            origemNome: origem.nome,
            destinoNome: destino.nome,
            valor,
            dataHora: new Date().toISOString()
          });

          this.salvando.set(false);
          this.form.reset();
          this.carregarBeneficios();

          Swal.fire({
            title: 'Transferência realizada!',
            text: 'A movimentação foi concluída com sucesso.',
            icon: 'success',
            confirmButtonText: 'Ok',
            buttonsStyling: false,
            customClass: {
              popup: 'sicoob-alert-popup',
              confirmButton: 'btn btn-sicoob sicoob-alert-button'
            }
          });
        },
        error: () => {
          this.salvando.set(false);
          Swal.fire('Erro', 'Não foi possível realizar a transferência.', 'error');
        }
      });
    });
  }
}