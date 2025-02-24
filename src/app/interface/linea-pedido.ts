import {LibroCarrito} from './libro-carrito';
import {Libro} from './libro';

export interface LineaPedido {
  cantidad: number;
  precio_unitario: number;
  libro: LibroCarrito;
}
