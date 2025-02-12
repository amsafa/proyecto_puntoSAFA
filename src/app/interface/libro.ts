import {Categoria} from './categoria';
import {Autor} from './autor';

export interface Libro {
  calificacion: any;


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

  // Esto es para la parte de los libros recomendados
  autorNombre: string;
  autorApellidos: string;
}
