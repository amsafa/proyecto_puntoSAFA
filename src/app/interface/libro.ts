import {Categoria} from './categoria';
import {Autor} from './autor';

export interface Libro {


  id: number,
  titulo: string;
  resumen: string;
  anioPublicacion: string;
  precio: number;
  ISBN: string;
  editorial: string;
  imagen: string;
  idioma: string;
  numPaginas: number;
  autor: Autor; // ID del autor
  categoria: Categoria; // ID de la categoría
}
