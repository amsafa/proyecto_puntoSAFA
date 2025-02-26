import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private baseUrl: string =  "http://127.0.0.1:8000/libro";

  constructor(private http: HttpClient) { }

  getBooks(page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/all?page=${page}&limit=${limit}`).pipe(
      map(libros =>
        libros.map(libro => ({
          ...libro,
          mediaCalificacion: parseFloat(String(libro.mediaCalificacion)) // Ensure proper number conversion
        }))
      )
    );
  }

  getFilteredBooks(categoryId:number | null, priceRanges:string [], page: number = 1, limit: number = 9): Observable<Libro[]> {
    let params:any = {page, limit};
    if (priceRanges.length) {
      params.priceRanges = priceRanges.join(','); // Send as a single string like "10-15" or "mayor40"

    }


    if(categoryId !== null){
      params.categoryId = categoryId;
    }


    console.log("📡 Sending Request with Params:", params);
    return this.http.get<Libro[]>(`${this.baseUrl}/filtered-books`, { params }).pipe(
      map(libros =>
        libros.map(libro => ({
          ...libro,
          mediaCalificacion: parseFloat(String(libro.mediaCalificacion)) // Ensure proper number conversion
        }))
      )
    );
  }


  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.baseUrl}/${id}`);}





  getLibrosByPrecio(range: string, page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/precio/${range}?page=${page}&limit=${limit}`).pipe(
      map(libros => libros.map(libro => ({
        ...libro,
        mediaCalificacion: parseFloat(String(libro.mediaCalificacion))
      })))
    );
  }


  // Método para obtener libros por categoría (desde el backend)
  getBooksByCategory(id: number, page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/categoria/${id}?page=${page}&limit=${limit}`).pipe(
      map(libros => libros.map(libro => ({
        ...libro,
        mediaCalificacion: parseFloat(String(libro.mediaCalificacion))
      })))
    );
  }





}
