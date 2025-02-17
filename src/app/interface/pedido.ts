import {LineaPedido} from './linea-pedido';

export interface Pedido {
  fecha: string;
  total: number;
  estado: string;
  direccion: string;
  cliente: number; // Client ID
  lineaPedidos: LineaPedido[];
}
