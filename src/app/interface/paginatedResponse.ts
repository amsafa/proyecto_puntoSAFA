import {Libro} from './libro';

export interface PaginatedResponse {
  length: number;
  libros: Libro[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class PaginatedResponsed {
}
