import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { provideNgxMask } from 'ngx-mask';

import { BeneficioFormModalComponent } from './beneficio-form-modal.component';
import { BeneficioService } from '../../services/beneficio.service';

describe('BeneficioFormModalComponent', () => {
  let component: BeneficioFormModalComponent;
  let fixture: ComponentFixture<BeneficioFormModalComponent>;

  const activeModalMock = {
    close: jasmine.createSpy('close'),
    dismiss: jasmine.createSpy('dismiss')
  };

  const beneficioServiceMock = {
    criar: jasmine.createSpy('criar').and.returnValue(of({
      id: 1,
      nome: 'Vale Alimentação',
      descricao: 'Benefício mensal',
      valor: 700,
      ativo: true
    })),
    atualizar: jasmine.createSpy('atualizar').and.returnValue(of({
      id: 1,
      nome: 'Vale Alimentação',
      descricao: 'Benefício mensal',
      valor: 700,
      ativo: true
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficioFormModalComponent],
      providers: [
        provideNgxMask(),
        { provide: NgbActiveModal, useValue: activeModalMock },
        { provide: BeneficioService, useValue: beneficioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    beneficioServiceMock.criar.calls.reset();
    beneficioServiceMock.atualizar.calls.reset();
    activeModalMock.close.calls.reset();
    activeModalMock.dismiss.calls.reset();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve invalidar formulário vazio', () => {

    component.form.reset({
        nome: '',
        descricao: '',
        valor: null,
        ativo: true
    });
    component.salvar();

    expect(component.form.invalid).toBeTrue();
    expect(beneficioServiceMock.criar).not.toHaveBeenCalled();
  });

  it('deve criar benefício quando formulário for válido', () => {
    beneficioServiceMock.criar.and.returnValue(of({
      id: 1,
      nome: 'Vale Alimentação',
      descricao: 'Benefício mensal',
      valor: 700,
      ativo: true
    }));

    component.form.setValue({
      nome: 'Vale Alimentação',
      descricao: 'Benefício mensal',
      valor: 700 as any,
      ativo: true
    });

    expect(component.form.valid).toBeTrue();

    component.salvar();

    expect(beneficioServiceMock.criar).toHaveBeenCalledWith({
      nome: 'Vale Alimentação',
      descricao: 'Benefício mensal',
      valor: 700,
      ativo: true
    });

    expect(activeModalMock.close).toHaveBeenCalledWith({
      id: 1,
      nome: 'Vale Alimentação',
      descricao: 'Benefício mensal',
      valor: 700,
      ativo: true
    });
});

  it('deve atualizar benefício em modo edição', () => {
    component.beneficio = {
      id: 1,
      nome: 'Benefício A',
      descricao: 'Descrição A',
      valor: 1000,
      ativo: true
    };

    component.ngOnInit();

    component.form.patchValue({
      nome: 'Benefício Editado',
      descricao: 'Descrição Editada',
      valor: 1200,
      ativo: true
    });

    component.salvar();

    expect(beneficioServiceMock.atualizar).toHaveBeenCalledWith(1, {
      nome: 'Benefício Editado',
      descricao: 'Descrição Editada',
      valor: 1200,
      ativo: true
    });
  });

  it('deve exibir erro quando serviço falhar', () => {
    beneficioServiceMock.criar.and.returnValue(throwError(() => new Error('Erro')));

    component.form.patchValue({
      nome: 'Vale Alimentação',
      descricao: 'Benefício mensal',
      valor: 700,
      ativo: true
    });

    component.salvar();

    expect(component.erro).toBeTruthy();
    expect(component.salvando).toBeFalse();
  });
});