import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective } from 'ngx-mask';

import { Beneficio } from '../../models/beneficio.model';
import { BeneficioService } from '../../services/beneficio.service';

@Component({
  selector: 'app-beneficio-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    CurrencyPipe
  ],
  templateUrl: './beneficio-form-modal.component.html',
  styleUrl: './beneficio-form-modal.component.css'
})
export class BeneficioFormModalComponent implements OnInit {
  @Input() beneficio?: Beneficio;

  private readonly fb = inject(FormBuilder);
  private readonly beneficioService = inject(BeneficioService);

  readonly activeModal = inject(NgbActiveModal);

  salvando = false;
  erro: string | null = null;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
    ativo: [true, [Validators.required]]
  });

  get modoEdicao(): boolean {
    return !!this.beneficio?.id;
  }

  get titulo(): string {
    return this.modoEdicao ? 'Editar benefício' : 'Novo benefício';
  }

  ngOnInit(): void {
    if (this.beneficio) {
      this.form.patchValue({
        nome: this.beneficio.nome,
        descricao: this.beneficio.descricao,
        valor: Number(this.beneficio.valor),
        ativo: this.beneficio.ativo
      });
    }
  }

  campoInvalido(campo: 'nome' | 'descricao' | 'valor' | 'ativo'): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  salvar(): void {
    this.erro = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      nome: this.form.value.nome!,
      descricao: this.form.value.descricao!,
      valor: Number(this.form.value.valor),
      ativo: Boolean(this.form.value.ativo)
    };

    this.salvando = true;

    const request$ = this.modoEdicao
      ? this.beneficioService.atualizar(this.beneficio!.id, payload)
      : this.beneficioService.criar(payload);

    request$.subscribe({
      next: beneficioSalvo => {
        this.salvando = false;
        this.activeModal.close(beneficioSalvo);
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Não foi possível salvar o benefício. Verifique os dados e tente novamente.';
      }
    });
  }
}