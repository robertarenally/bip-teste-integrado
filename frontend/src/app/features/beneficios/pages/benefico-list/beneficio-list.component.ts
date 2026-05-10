import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BeneficioFormModalComponent } from '../../pages/beneficio-form-modal/beneficio-form-modal.component';
import { BeneficioDetailModalComponent } from '../../pages/beneficio-detail-modal/beneficio-detail-modal.component';

import Swal from 'sweetalert2';

type SortField = 'nome' | 'descricao' | 'valor' | 'ativo';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-beneficio-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './beneficio-list.component.html',
  styleUrl: './beneficio-list.component.css'
})
export class BeneficioListComponent implements OnInit {
  private readonly beneficioService = inject(BeneficioService);
  private readonly modalService = inject(NgbModal);

  beneficios = signal<Beneficio[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);

  termoBusca = signal('');
  paginaAtual = signal(1);
  itensPorPagina = signal(5);

  sortField = signal<SortField>('nome');
  sortDirection = signal<SortDirection>('asc');

  beneficiosFiltrados = computed(() => {
    const termo = this.termoBusca().toLowerCase().trim();

    const lista = this.beneficios().filter(beneficio => {
      return (
        beneficio.nome.toLowerCase().includes(termo) ||
        beneficio.descricao.toLowerCase().includes(termo) ||
        String(beneficio.valor).includes(termo) ||
        (beneficio.ativo ? 'ativo' : 'inativo').includes(termo)
      );
    });

    return lista.sort((a, b) => {
      const field = this.sortField();
      const direction = this.sortDirection();

      const valueA = a[field];
      const valueB = b[field];

      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }

      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }

      return 0;
    });
  });

  totalPaginas = computed(() =>
    Math.ceil(this.beneficiosFiltrados().length / this.itensPorPagina()) || 1
  );

  beneficiosPaginados = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina();
    const fim = inicio + this.itensPorPagina();

    return this.beneficiosFiltrados().slice(inicio, fim);
  });

  ngOnInit(): void {
    this.carregarBeneficios();
  }

  carregarBeneficios(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.beneficioService.listar().subscribe({
      next: beneficios => {
        this.beneficios.set(Array.isArray(beneficios) ? beneficios : []);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os benefícios.');
        this.carregando.set(false);
      }
    });
  }

  buscar(valor: string): void {
    this.termoBusca.set(valor);
    this.paginaAtual.set(1);
  }

  ordenarPor(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
      return;
    }

    this.sortField.set(field);
    this.sortDirection.set('asc');
  }

  proximaPagina(): void {
    if (this.paginaAtual() < this.totalPaginas()) {
      this.paginaAtual.update(pagina => pagina + 1);
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual() > 1) {
      this.paginaAtual.update(pagina => pagina - 1);
    }
  }

  irParaPagina(pagina: number): void {
    this.paginaAtual.set(pagina);
  }

  paginas(): number[] {
    return Array.from({ length: this.totalPaginas() }, (_, index) => index + 1);
  }

  sortIcon(field: SortField): string {
    if (this.sortField() !== field) {
      return 'bi-arrow-down-up';
    }

    return this.sortDirection() === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
  }

  abrirNovoBeneficio(): void {
    const modalRef = this.modalService.open(BeneficioFormModalComponent, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
        modalDialogClass: 'beneficio-modal'
    });

    modalRef.closed.subscribe(() => {
        this.carregarBeneficios();
    });
  }

  editarBeneficio(beneficio: Beneficio): void {
    const modalRef = this.modalService.open(BeneficioFormModalComponent, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
        modalDialogClass: 'beneficio-modal'
    });

    modalRef.componentInstance.beneficio = beneficio;

    modalRef.closed.subscribe(() => {
        this.carregarBeneficios();
    });
  }
  visualizarBeneficio(beneficio: Beneficio): void {
    const modalRef = this.modalService.open(BeneficioDetailModalComponent, {
        centered: true,
        size: 'md',
        modalDialogClass: 'beneficio-detail-modal'
    });

    modalRef.componentInstance.beneficio = beneficio;
  }
  excluir(beneficio: Beneficio): void {
    Swal.fire({
      title: 'Excluir benefício?',
      html: `
        <div style="text-align: center">
          <strong>${beneficio.nome}</strong>
          <p style="margin-top: 8px; color: #64748b">
            Essa ação não poderá ser desfeita.
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: 'sicoob-alert-popup',
        confirmButton: 'btn btn-danger sicoob-alert-button',
        cancelButton: 'btn btn-outline-sicoob sicoob-alert-button'
      }
    }).then(result => {
      if (!result.isConfirmed) {
        return;
      }

      this.carregando.set(true);

      this.beneficioService.excluir(beneficio.id).subscribe({
        next: () => {
          this.carregando.set(false);
          this.carregarBeneficios();

          Swal.fire({
            title: 'Benefício excluído!',
            text: 'O benefício foi removido com sucesso.',
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
          this.carregando.set(false);

          Swal.fire({
            title: 'Erro ao excluir',
            text: 'Não foi possível excluir o benefício. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            buttonsStyling: false,
            customClass: {
              popup: 'sicoob-alert-popup',
              confirmButton: 'btn btn-sicoob sicoob-alert-button'
            }
          });
        }
      });
    });
  }
}