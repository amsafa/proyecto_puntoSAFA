import {Categoria} from './categoria';
import {Autor} from './autor';

export interface Libro {
  category: string;


  titulo: string;
  resumen: string;
  anio_publicacion: string;
  precio: number;
  ISBN: string;
  editorial: string;
  imagen: string;
  idioma: string;
  num_paginas: number;
  autor: Autor; // ID del autor
  categoria: Categoria; // ID de la categoría
}
