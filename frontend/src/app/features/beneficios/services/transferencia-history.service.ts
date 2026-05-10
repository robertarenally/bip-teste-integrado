import { Injectable } from '@angular/core';
import { Transferencia } from '../models/transferencia.model';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaHistoryService {
  private readonly storageKey = 'ultimas_transferencias';

  listarUltimas(): Transferencia[] {
    const dados = localStorage.getItem(this.storageKey);

    if (!dados) {
      return [];
    }

    return JSON.parse(dados) as Transferencia[];
  }

  salvar(transferencia: Transferencia): void {
    const transferencias = this.listarUltimas();

    const novaTransferencia: Transferencia = {
      ...transferencia,
      id: crypto.randomUUID(),
      dataHora: new Date().toISOString()
    };

    const atualizadas = [novaTransferencia, ...transferencias].slice(0, 5);

    localStorage.setItem(this.storageKey, JSON.stringify(atualizadas));
  }
}