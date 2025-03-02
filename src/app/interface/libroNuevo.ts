export interface LibroNuevo {
  id?: number; // Opcional, ya que puede no ser necesario
  titulo: string;
  resumen: string;
  anioPublicacion: string; // Formato YYYY-MM-DD
  precio: number;
  ISBN: string;
  editorial: string;
  imagen: string;
  idioma: string;
  numPaginas: number;
  autor: number; // Solo el ID del autor
  categoria: number; // Solo el ID de la categoría
}
