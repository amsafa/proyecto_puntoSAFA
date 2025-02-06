import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import { Categoria } from '../interface/categoria'; // Importar la interfaz de categoría

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrlBooks = 'http://127.0.0.1:8000/libro/all'; // Endpoint de libros
  private apiUrlCategories = 'http://127.0.0.1:8000/libro/categoria'; // Ajusta la URL para categorías

  constructor(private http: HttpClient) {}

  // Método para obtener todos los libros
  getBooks(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrlBooks);
  }

  // Método para obtener libros por categoría (desde el backend)
  getBooksByCategory(id: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrlCategories}/${id}`);
  }


}
