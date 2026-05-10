import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideNgxMask } from 'ngx-mask';
import Swal from 'sweetalert2';

import { TransferenciaComponent } from './transferencia.component';
import { BeneficioService } from '../../services/beneficio.service';
import { TransferenciaHistoryService } from '../../services/transferencia-history.service';

import { provideRouter } from '@angular/router';

describe('TransferenciaComponent', () => {
  let component: TransferenciaComponent;
  let fixture: ComponentFixture<TransferenciaComponent>;

  const beneficiosMock = [
    { id: 1, nome: 'Benefício A', descricao: 'Descrição A', valor: 1000, ativo: true },
    { id: 2, nome: 'Benefício B', descricao: 'Descrição B', valor: 500, ativo: true },
    { id: 3, nome: 'Benefício Inativo', descricao: 'Descrição C', valor: 300, ativo: false }
  ];

  const beneficioServiceMock = {
    listar: jasmine.createSpy('listar').and.returnValue(of(beneficiosMock)),
    transferir: jasmine.createSpy('transferir').and.returnValue(of({}))
  };

  const transferenciaHistoryServiceMock = {
    salvar: jasmine.createSpy('salvar')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferenciaComponent],
      providers: [
        provideRouter([]),
        provideNgxMask(),
        { provide: BeneficioService, useValue: beneficioServiceMock },
        { provide: TransferenciaHistoryService, useValue: transferenciaHistoryServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    beneficioServiceMock.transferir.calls.reset();
    beneficioServiceMock.listar.calls.reset();
    transferenciaHistoryServiceMock.salvar.calls.reset();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar somente benefícios ativos', () => {
    expect(component.beneficios().length).toBe(2);
    expect(component.beneficios().every(b => b.ativo)).toBeTrue();
  });

  it('deve atualizar origem, destino e valor pelos signals', () => {
    component.form.patchValue({
      origemId: 1,
      destinoId: 2,
      valor: 100
    });

    expect(component.origemSelecionada()?.nome).toBe('Benefício A');
    expect(component.destinoSelecionado()?.nome).toBe('Benefício B');
    expect(component.valorTransferencia()).toBe(100);
  });

  it('deve impedir transferência com formulário inválido', () => {
    component.form.reset();

    component.transferir();

    expect(component.form.invalid).toBeTrue();
    expect(beneficioServiceMock.transferir).not.toHaveBeenCalled();
  });

  it('deve impedir transferência com saldo insuficiente', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));

    component.form.patchValue({
      origemId: 2,
      destinoId: 1,
      valor: 1000
    });

    component.transferir();

    expect(Swal.fire).toHaveBeenCalled();
    expect(beneficioServiceMock.transferir).not.toHaveBeenCalled();
  });

  it('deve realizar transferência quando confirmada', fakeAsync(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.form.patchValue({
      origemId: 1,
      destinoId: 2,
      valor: 100
    });

    component.transferir();

    tick();

    expect(beneficioServiceMock.transferir).toHaveBeenCalledWith(1, 2, 100);
    expect(transferenciaHistoryServiceMock.salvar).toHaveBeenCalled();
  }));
});