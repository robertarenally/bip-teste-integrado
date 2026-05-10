import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BeneficioService } from './beneficio.service';
import { environment } from '../../../../environments/environment';

describe('BeneficioService', () => {
  let service: BeneficioService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/beneficios`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BeneficioService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(BeneficioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar benefícios', () => {
    const mock = [
      { id: 1, nome: 'Benefício A', descricao: 'Descrição A', valor: 1000, ativo: true }
    ];

    service.listar().subscribe(response => {
      expect(response).toEqual(mock);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('deve criar benefício', () => {
    const payload = {
      nome: 'Vale Alimentação',
      descricao: 'Benefício mensal',
      valor: 700,
      ativo: true
    };

    service.criar(payload).subscribe(response => {
      expect(response.nome).toBe('Vale Alimentação');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({ id: 3, ...payload });
  });

  it('deve atualizar benefício', () => {
    const payload = {
      nome: 'Benefício Atualizado',
      descricao: 'Nova descrição',
      valor: 900,
      ativo: true
    };

    service.atualizar(1, payload).subscribe(response => {
      expect(response.valor).toBe(900);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    req.flush({ id: 1, ...payload });
  });

  it('deve excluir benefício', () => {
    service.excluir(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('deve transferir benefício', () => {
    service.transferir(1, 2, 100).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/transferencias`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      fromId: 1,
      toId: 2,
      amount: 100
    });

    req.flush({});
  });
});