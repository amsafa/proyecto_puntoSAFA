import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import { Categoria } from '../interface/categoria'; // Importar la interfaz de categoría
import {map, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private baseUrl: string = "http://127.0.0.1:8000/libro";

  constructor(private http: HttpClient) { }

  // Método para obtener todos los libros
  getBooks(page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/all?page=${page}&limit=${limit}`).pipe(
      tap(data =>console.error("Libro getBooks", data)),
      map(libros =>
        libros.map(libro => ({
          ...libro,
          mediaCalificacion: parseFloat(String(libro.mediaCalificacion)) // Ensure proper number conversion
        }))
      )
    );
  }


  // Método para obtener libros por categoría (desde el backend)
  getBooksByCategory(id: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/categoria/${id}`);  }

  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.baseUrl}/${id}`);}



    getLibrosByPrecio(range:string):Observable<Libro[]> {
        return this.http.get<Libro[]>(`${this.baseUrl}/precio/${range}`);
    }




  getLibrosByCategoria():Observable<Categoria[]> {
          return this.http.get<Categoria[]>(`${this.baseUrl}/categoria`);
    }


}
