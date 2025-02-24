import {LibroCarrito} from './libro-carrito';

export interface LineaPedido {
  cantidad: number;
  precio_unitario: number;
  libro: number;
}
