export interface Libro {
  id: number;
  titulo: string;
  resumen: string;
  anioPublicacion: string;
  precio: number;
  ISBN: string;
  editorial: string;
  imagen?: string;
  idioma: string;
  numPaginas: number;
  autor: { id: number };
  categoria: { id: number };

  // Hacer estas propiedades opcionales
  calificacion?: number;
  mediaCalificacion?: number;
  autorNombre?: string;
  autorApellidos?: string;
}
