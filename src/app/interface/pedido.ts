import {LineaPedido} from './linea-pedido';
import {EstadisticasPedidos} from './estadisticas-pedidos';

export interface Pedido {
  fecha: string;
  total: number;
  estado: string;
  direccion_entrega: string;
  codigo:string;
  cliente: number; // Client ID
  estadisticas?: EstadisticasPedidos;
  lineaPedidos: LineaPedido[];
}
