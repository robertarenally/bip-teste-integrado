import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { BeneficioService } from '../../services/beneficio.service';
import { TransferenciaHistoryService } from '../../services/transferencia-history.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const beneficiosMock = [
    { id: 1, nome: 'Vale Alimentação', descricao: 'Alimentação mensal', valor: 1000, ativo: true },
    { id: 2, nome: 'Plano Saúde', descricao: 'Saúde corporativa', valor: 500, ativo: true },
    { id: 3, nome: 'Benefício Inativo', descricao: 'Inativo', valor: 300, ativo: false }
  ];

  const transferenciasMock = [
    {
      id: '1',
      origemId: 1,
      destinoId: 2,
      origemNome: 'Vale Alimentação',
      destinoNome: 'Plano Saúde',
      valor: 100,
      dataHora: new Date().toISOString()
    }
  ];

  const beneficioServiceMock = {
    listar: jasmine.createSpy('listar').and.returnValue(of(beneficiosMock))
  };

  const transferenciaHistoryServiceMock = {
    listarUltimas: jasmine.createSpy('listarUltimas').and.returnValue(transferenciasMock)
  };

  beforeEach(async () => {
    beneficioServiceMock.listar.calls.reset();
    transferenciaHistoryServiceMock.listarUltimas.calls.reset();

    beneficioServiceMock.listar.and.returnValue(of(beneficiosMock));
    transferenciaHistoryServiceMock.listarUltimas.and.returnValue(transferenciasMock);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        provideCharts(withDefaultRegisterables()),
        { provide: BeneficioService, useValue: beneficioServiceMock },
        { provide: TransferenciaHistoryService, useValue: transferenciaHistoryServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar benefícios ao iniciar', () => {
    expect(beneficioServiceMock.listar).toHaveBeenCalled();
    expect(component.beneficios().length).toBe(3);
  });

  it('deve calcular total de benefícios', () => {
    expect(component.totalBeneficios()).toBe(3);
  });

  it('deve calcular benefícios ativos e inativos', () => {
    expect(component.beneficiosAtivos()).toBe(2);
    expect(component.beneficiosInativos()).toBe(1);
  });

  it('deve calcular valor total dos benefícios', () => {
    expect(component.valorTotal()).toBe(1800);
  });

  it('deve identificar o maior benefício', () => {
    expect(component.maiorBeneficio()?.nome).toBe('Vale Alimentação');
    expect(component.maiorBeneficio()?.valor).toBe(1000);
  });

  it('deve carregar últimas transferências', () => {
    expect(transferenciaHistoryServiceMock.listarUltimas).toHaveBeenCalled();
    expect(component.ultimasTransferencias().length).toBe(1);
  });

  it('deve montar dados do gráfico de status', () => {
    const chartData = component.statusChartData();

    expect(chartData.labels).toEqual(['Ativos', 'Inativos']);
    expect(chartData.datasets[0].data).toEqual([2, 1]);
  });

  it('deve montar dados do gráfico de valores', () => {
    const chartData = component.valoresChartData();

    expect(chartData.labels).toContain('Vale Alimentação');
    expect(chartData.datasets[0].data).toContain(1000);
  });

  it('deve tratar erro ao carregar dashboard', () => {
    beneficioServiceMock.listar.and.returnValue(
      throwError(() => new Error('Erro ao listar'))
    );

    component.carregarDashboard();

    expect(component.erro()).toBe('Não foi possível carregar os dados do dashboard.');
    expect(component.carregando()).toBeFalse();
  });
});