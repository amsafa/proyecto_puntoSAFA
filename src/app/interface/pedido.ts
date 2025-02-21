import {LineaPedido} from './linea-pedido';

export interface Pedido {
  fecha: string;
  total: number;
  estado: string;
  direccion_entrega: string;
  cliente: number; // Client ID
  lineaPedidos: LineaPedido[];
}
