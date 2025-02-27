import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Categoria} from '../interface/categoria';
import {Libro} from '../interface/libro';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
  private baseUrl: string = "api/categoria";

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/all`);
  }

  getBooksByCategory(id: number, page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/categoria/${id}?page=${page}&limit=${limit}`).pipe(
      map(libros => libros.map(libro => ({
        ...libro,
        mediaCalificacion: parseFloat(String(libro.mediaCalificacion))
      })))
    );
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/categoria/${id}`);
  }
}
