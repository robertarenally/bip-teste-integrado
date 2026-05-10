import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { BeneficioService } from '../../services/beneficio.service';
import { TransferenciaHistoryService } from '../../services/transferencia-history.service';
import { Beneficio } from '../../models/beneficio.model';
import { Transferencia } from '../../models/transferencia.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly beneficioService = inject(BeneficioService);
  private readonly transferenciaHistoryService = inject(TransferenciaHistoryService);

  beneficios = signal<Beneficio[]>([]);
  ultimasTransferencias = signal<Transferencia[]>([]);
  carregando = signal<boolean>(false);
  erro = signal<string | null>(null);

  totalBeneficios = computed(() => this.beneficios().length);

  beneficiosAtivos = computed(() =>
    this.beneficios().filter(beneficio => beneficio.ativo).length
  );

  beneficiosInativos = computed(() =>
    this.beneficios().filter(beneficio => !beneficio.ativo).length
  );

  valorTotal = computed(() =>
    this.beneficios().reduce((total, beneficio) => total + Number(beneficio.valor || 0), 0)
  );

  maiorBeneficio = computed(() => {
    const lista = this.beneficios();

    if (!lista.length) {
      return null;
    }

    return lista.reduce((maior, atual) =>
      Number(atual.valor) > Number(maior.valor) ? atual : maior
    );
  });

  statusChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: ['Ativos', 'Inativos'],
    datasets: [
      {
        data: [this.beneficiosAtivos(), this.beneficiosInativos()]
      }
    ]
  }));

  valoresChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const topBeneficios = [...this.beneficios()]
      .sort((a, b) => Number(b.valor) - Number(a.valor))
      .slice(0, 5);

    return {
      labels: topBeneficios.map(beneficio => beneficio.nome),
      datasets: [
        {
          label: 'Valor do benefício',
          data: topBeneficios.map(beneficio => Number(beneficio.valor))
        }
      ]
    };
  });

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.beneficioService.listar().subscribe({
      next: beneficios => {
        this.beneficios.set(beneficios);
        this.ultimasTransferencias.set(this.transferenciaHistoryService.listarUltimas());
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os dados do dashboard.');
        this.carregando.set(false);
      }
    });
  }
}