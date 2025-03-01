import {Autor} from './autor';
import {Categoria} from './categoria';

export interface LibroCrea {
  id: number;
  titulo: string;
  resumen: string;
  anioPublicacion: Date; // Formato de fecha: YYYY-MM-DD
  precio: number;
  ISBN: string;
  editorial: string;
  imagen: string; // Imagen opcional
  idioma: string;
  numPaginas: number;
  autor: Autor; // ID del autor
  categoria: Categoria; // ID de la categoría

}
