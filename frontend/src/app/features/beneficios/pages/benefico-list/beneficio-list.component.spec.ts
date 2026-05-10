import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { provideRouter } from '@angular/router';

import { BeneficioListComponent } from './beneficio-list.component';
import { BeneficioService } from '../../services/beneficio.service';

describe('BeneficioListComponent', () => {
  let component: BeneficioListComponent;
  let fixture: ComponentFixture<BeneficioListComponent>;

  const beneficiosMock = [
    { id: 1, nome: 'Benefício A', descricao: 'Descrição A', valor: 1000, ativo: true },
    { id: 2, nome: 'Benefício B', descricao: 'Descrição B', valor: 500, ativo: true }
  ];

  const beneficioServiceMock = {
    listar: jasmine.createSpy('listar').and.returnValue(of(beneficiosMock)),
    excluir: jasmine.createSpy('excluir').and.returnValue(of({}))
  };

  const modalMock = {
    open: jasmine.createSpy('open').and.returnValue({
      componentInstance: {},
      closed: of(true)
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficioListComponent],
      providers: [
        provideRouter([]),
        { provide: BeneficioService, useValue: beneficioServiceMock },
        { provide: NgbModal, useValue: modalMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar benefícios ao iniciar', () => {
    expect(beneficioServiceMock.listar).toHaveBeenCalled();
    expect(component.beneficios().length).toBe(2);
  });

  it('deve filtrar benefícios por nome', () => {
    component.buscar('Descrição A');

    expect(component.beneficiosFiltrados().length).toBe(1);
    expect(component.beneficiosFiltrados()[0].nome).toBe('Benefício A');
  });

  it('deve ordenar benefícios por valor', () => {
    component.ordenarPor('valor');

    expect(component.sortField()).toBe('valor');
    expect(component.sortDirection()).toBe('asc');
  });

  it('deve abrir modal de novo benefício', () => {
    component.abrirNovoBeneficio();

    expect(modalMock.open).toHaveBeenCalled();
  });

  it('deve abrir modal de edição com benefício selecionado', () => {
    component.editarBeneficio(beneficiosMock[0]);

    expect(modalMock.open).toHaveBeenCalled();
  });

  it('deve excluir benefício após confirmação', fakeAsync(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.excluir(beneficiosMock[0]);

    tick();

    expect(beneficioServiceMock.excluir).toHaveBeenCalledWith(1);
  }));
});