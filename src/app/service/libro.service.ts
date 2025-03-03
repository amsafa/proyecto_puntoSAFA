import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {LibroCrea} from '../interface/libro-crea';
import {Categoria} from '../interface/categoria';
import {Autor} from './autor.service';
import {LibroNuevo} from '../interface/libroNuevo';



@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl: string =  `${environment.apiUrl}/libro`;

  constructor(private http: HttpClient) { }


  /**
   * Método para obtener todos los libros con paginación.
   * @param page
   * @param limit
   */
  getBooks(page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/all?page=${page}&limit=${limit}`).pipe(
      map(libros =>
        libros.map(libro => ({
          ...libro,
          mediaCalificacion: parseFloat(String(libro.mediaCalificacion)) // Ensure proper number conversion
        }))
      )
    );
  }

  /**
   * Método para obtener todos los libros con paginación y filtros de categoría y rango de precios.
   * @param categoryId
   * @param priceRanges
   * @param page
   * @param limit
   */

  getFilteredBooks(categoryId:number | null, priceRanges:string [], page: number = 1, limit: number = 9): Observable<Libro[]> {
    let params:any = {page, limit};
    if (priceRanges.length) {
      params.priceRanges = priceRanges.join(','); // Send as a single string like "10-15" or "mayor40"

    }
    if(categoryId !== null){
      params.categoryId = categoryId;
    }
    console.log("📡 Sending Request with Params:", params);
    return this.http.get<Libro[]>(`${this.apiUrl}/filtered-books`, { params }).pipe(
      map(libros =>
        libros.map(libro => ({
          ...libro,
          mediaCalificacion: parseFloat(String(libro.mediaCalificacion)) // Ensure proper number conversion
        }))
      )
    );
  }

  /**
   * Método para obtener el detalle de un libro por su ID.
   * @param id
   */

  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);}


  /**
   * Método para obtener todos los libros de una categoría con paginación.
   * @param id
   * @param page
   * @param limit
   */
  getBooksByCategory(id: number, page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/categoria/${id}?page=${page}&limit=${limit}`).pipe(
      map(libros => libros.map(libro => ({
        ...libro,
        mediaCalificacion: parseFloat(String(libro.mediaCalificacion))
      })))
    );
  }


  /**
   * Método para crear un libro.
   * @param libro
   * @returns Observable<LibroNuevo>
   */

  crearLibro(libro: LibroNuevo): Observable<LibroNuevo> {
    return this.http.post<LibroNuevo>(`${this.apiUrl}/guardar?XDEBUG_SESSION_START=14361`, libro, {
      headers: { 'Content-Type': 'application/json' } // Ensure JSON format
    });
  }


  /**
   * Método para actualizar un libro.
   * @param id
   * @param libro
   * @returns Observable<LibroCrea>
   */
  actualizarLibro(id: number, libro: LibroCrea): Observable<LibroCrea> {
    return this.http.put<LibroCrea>(`${this.apiUrl}/editar/${id}`, libro, {
      headers: { 'Content-Type': 'application/json' } // ✅ Ensure JSON format
    });
  }




  /**
   * Método para eliminar un libro.
   * @param id
   * @returns Observable<void>
   */
  eliminarLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, {
    });
  }


  /**
   * Método para buscar un libro por su título.
   * @returns Observable<LibroCrea[]>
   */
  buscarLibroPorTitulo(titulo: string): Observable<LibroCrea[]> {
    return this.http.get<LibroCrea[]>(`${this.apiUrl}/search?q=${titulo}`);
  }

  /**
   * Método para obtener un libro por su ID.
   * @param libroId
   *
   */
  obtenerLibro(libroId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${libroId}`);
  }




}
