import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import {Observable} from 'rxjs';
import {LoginService} from './login.service';
import {Categoria} from '../interface/categoria';



@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private baseUrl: string = "http://127.0.0.1:8000/libro";


  constructor(private http: HttpClient, private loginService: LoginService) { }

  // Método para obtener todos los libros
  getBooks(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/all`);  }

  // Método para obtener libros por categoría (desde el backend)
  getBooksByCategory(id: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/categoria/${id}`);  }

  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.baseUrl}/${id}`);}


  getLibros(page: number, limit: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/all`, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }

    // async getLibrosCatalogo(params: { page: number, limit: number }): Promise<Libro[]> {
    //   const response = await fetch(`${this.baseUrl}/all?page=${params.page}&limit=${params.limit}`);
    //   return await response.json();
    // }

  async getLibrosCatalogo(params: { page: number, limit: number }): Promise<Libro[]> {
    const response = await fetch(`${this.baseUrl}/all?page=${params.page}&limit=${params.limit}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }







    getLibrosByPrecio(range:string):Observable<Libro[]> {
        return this.http.get<Libro[]>(`${this.baseUrl}/precio/${range}`);
    }

    getLibrosByCategoria():Observable<Categoria[]> {
          return this.http.get<Categoria[]>(`${this.baseUrl}/categoria`);
    }


}
