import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';

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

  excluir(beneficio: Beneficio): void {
    const confirmado = confirm(`Deseja excluir o benefício "${beneficio.nome}"?`);

    if (!confirmado) {
      return;
    }

    this.beneficioService.excluir(beneficio.id).subscribe({
      next: () => this.carregarBeneficios(),
      error: () => alert('Não foi possível excluir o benefício.')
    });
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
}