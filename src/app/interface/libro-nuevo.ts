export interface LibroNuevo {
  id: number;
  titulo: string;
  resumen: string;
  anioPublicacion: string; // Formato de fecha: YYYY-MM-DD
  precio: number;
  ISBN: string;
  editorial: string;
  imagen: string; // Imagen opcional
  idioma: string;
  numPaginas: number;
  autor: number; // Only the ID
  categoria: number;
}
