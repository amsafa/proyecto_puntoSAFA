import {Categoria} from './categoria';
import {Autor} from './autor';

export interface Libro {
  id: number;
  titulo: string;
  remunen: string;
  anioPublicacion: Date;
  precio:number;
  ISBN:string;
  editorial:string;
  imagen:string;
  idioma:string;
  numPaginas:number;
  categoria:Categoria;
  autor:Autor;

}
