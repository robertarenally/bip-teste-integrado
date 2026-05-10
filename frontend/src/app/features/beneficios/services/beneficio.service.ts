import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beneficio } from '../models/beneficio.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/beneficios`;

  listar(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.apiUrl);
  }

  criar(beneficio: Omit<Beneficio, 'id'>): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.apiUrl, beneficio);
  }

  atualizar(id: number, beneficio: Omit<Beneficio, 'id'>): Observable<Beneficio> {
    return this.http.put<Beneficio>(`${this.apiUrl}/${id}`, beneficio);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  transferir(origemId: number, destinoId: number, valor: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transferencias`, {
      origemId,
      destinoId,
      valor
    });
  }
}