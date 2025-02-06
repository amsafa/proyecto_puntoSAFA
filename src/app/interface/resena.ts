import {Libro} from './libro';

class Usuario {
}

export interface Resena {
  id: number;
  calificacion: number;
  comentario: string;
  fecha: string; // ISO 8601 date string
  libro: Libro; // Use the Libro interface
  usuario: Usuario; // Use the Usuario interface
}
