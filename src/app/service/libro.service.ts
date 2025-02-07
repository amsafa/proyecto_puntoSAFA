import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import { Categoria } from '../interface/categoria'; // Importar la interfaz de categoría
import {Observable} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private baseUrl: string = "http://127.0.0.1:8000/libro";

  constructor(private http: HttpClient) { }

  // Método para obtener todos los libros
  getBooks(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/all`);  }

  // Método para obtener libros por categoría (desde el backend)
  getBooksByCategory(id: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/categoria/${id}`);  }

    async getLibros(): Promise<Libro[]> {
        const response = await fetch(`${this.baseUrl}/all`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }

    getLibrosByPrecio(range:string):Observable<Libro[]> {
        return this.http.get<Libro[]>(`${this.baseUrl}/precio/${range}`);
    }

}
