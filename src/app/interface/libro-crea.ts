import {Autor} from './autor';
import {Categoria} from './categoria';

export interface LibroCrea {
  id: number;
  titulo: string;
  resumen: string;
  anio_publicacion: string; // Formato de fecha: YYYY-MM-DD
  precio: number;
  ISBN: string;
  editorial: string;
  imagen?: string; // Imagen opcional
  idioma: string;
  num_paginas: number;
  autor: Autor; // ID del autor
  categoria: Categoria; // ID de la categoría

}
