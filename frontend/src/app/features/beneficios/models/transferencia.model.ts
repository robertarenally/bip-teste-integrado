export interface Transferencia {
  id?: string;
  origemId: number;
  destinoId: number;
  origemNome?: string;
  destinoNome?: string;
  valor: number;
  dataHora: string;
}