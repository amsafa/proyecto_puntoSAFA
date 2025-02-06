export interface Book {
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
  autor: number; // ID del autor
  categoria: number; // ID de la categoría
}
