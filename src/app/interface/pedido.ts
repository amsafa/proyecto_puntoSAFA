import {LineaPedido} from './linea-pedido';
import {EstadisticasPedidos} from './estadisticas-pedidos';
import {Cliente} from './cliente';

export interface Pedido {
  id?:number;
  fecha: string;
  total: number;
  estado: string;
  direccion_entrega: string;
  cliente: Cliente | number;
  estadisticas?: EstadisticasPedidos;
  lineaPedidos: LineaPedido[];
}
