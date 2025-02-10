import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  // getLibros(page: number, limit: number): Observable<Libro[]> {
  //   return this.http.get<Libro[]>(`${this.baseUrl}/all`, {
  //     params: { page: page.toString(), limit: limit.toString() },
  //   });
  // }

  async getLibros(params: { page: number, limit: number }): Promise<Libro[]> {
    const response = await fetch(`${this.baseUrl}/all?page=${params.page}&limit=${params.limit}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();  // Make sure it returns an array of books
  }

  async sortLibros(params: {ordenarPor: string }): Promise<Libro[]> {
    debugger
    console.log("Base URL:", this.baseUrl); // Check if baseUrl is defined

    if (!this.baseUrl) {
      throw new Error("Base URL is not defined");
    }
    const url = new URL(`${this.baseUrl}/ordenar`);
    url.searchParams.append('ordenarPor', params.ordenarPor);

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json(); // Convert response to JSON
    } catch (error) {
      console.error("Error fetching sorted books:", error);
      throw error;
    }
  }



    getLibrosByPrecio(range:string):Observable<Libro[]> {
        return this.http.get<Libro[]>(`${this.baseUrl}/precio/${range}`);
    }

    getLibrosByCategoria():Observable<Categoria[]> {
          return this.http.get<Categoria[]>(`${this.baseUrl}/categoria`);
    }

    // getLibrosOrdenados(ordenarPor:string, page:number, limit:number):Observable<Libro[]> {
    //   const params = new HttpParams()
    //     .set('page', page.toString())
    //     .set('limit', limit.toString())
    //     .set('sort', ordenarPor)
    //     return this.http.get<Libro[]>(`${this.baseUrl}/ordenar${ordenarPor}`);
    // }

}
