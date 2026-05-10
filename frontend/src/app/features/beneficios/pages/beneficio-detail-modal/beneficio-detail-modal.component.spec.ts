import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BeneficioDetailModalComponent } from './beneficio-detail-modal.component';

describe('BeneficioDetailModalComponent', () => {
  let component: BeneficioDetailModalComponent;
  let fixture: ComponentFixture<BeneficioDetailModalComponent>;

  const activeModalMock = {
    close: jasmine.createSpy('close'),
    dismiss: jasmine.createSpy('dismiss')
  };

  const beneficioMock = {
    id: 1,
    nome: 'Vale Alimentação',
    descricao: 'Benefício mensal de alimentação',
    valor: 1000,
    ativo: true
  };

  beforeEach(async () => {
    activeModalMock.close.calls.reset();
    activeModalMock.dismiss.calls.reset();

    await TestBed.configureTestingModule({
      imports: [BeneficioDetailModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioDetailModalComponent);
    component = fixture.componentInstance;
    component.beneficio = beneficioMock;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve receber o benefício para visualização', () => {
    expect(component.beneficio).toEqual(beneficioMock);
    expect(component.beneficio.nome).toBe('Vale Alimentação');
  });

  it('deve renderizar nome, descrição e valor do benefício', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Vale Alimentação');
    expect(compiled.textContent).toContain('Benefício mensal de alimentação');
    expect(compiled.textContent).toContain('R$');
  });

  it('deve exibir status ativo', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Ativo');
  });

  it('deve exibir status inativo quando benefício estiver inativo', () => {
    component.beneficio = {
      ...beneficioMock,
      ativo: false
    };

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Inativo');
  });

  it('deve fechar modal ao chamar dismiss', () => {
    component.activeModal.dismiss();

    expect(activeModalMock.dismiss).toHaveBeenCalled();
  });
});