import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private baseUrl: string =  `${environment.apiUrl}/libro`;

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




  getLibros(page: number, limit: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/all`, {
      params: { page: page.toString(), limit: limit.toString() },
    });
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
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Libro[]>(`${this.baseUrl}/categoria/${id}`, { params }).pipe(
      map(libros => libros.map(libro => ({
        ...libro,
        mediaCalificacion: isNaN(Number(libro.mediaCalificacion)) ? 0 : parseFloat(String(libro.mediaCalificacion))
      })))
    );
  }

  getFilteredBooks(
    priceRanges: string[] | null, // Cambiado a string[]
    categoryId: string[] | null,
    page: number,
    limit: number
  ): Observable<PaginatedResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Agregar priceRanges si se proporciona
    if (priceRanges && priceRanges.length) {
      params = params.set('priceRanges', priceRanges.join(','));
    }

    // Agregar categoryId si se proporciona
    if (categoryId && categoryId.length) {
      params = params.set('categoryId', categoryId.join(','));
    }

    return this.http.get<PaginatedResponse>(`${this.baseUrl}/filtered-books`, { params }).pipe(
      map((response) => {
        // Asegúrate de que mediaCalificacion sea un número
        response.libros = response.libros.map((libro) => ({
          ...libro,
          mediaCalificacion: parseFloat(String(libro.mediaCalificacion)),
        }));
        return response;
      })
    );
  }




  // Método para crear un libro


  crearLibro(libro: LibroCrea): Observable<Libro> {
    return this.http.post<Libro>(`${this.apiUrl}/guardar`, libro);
  }


// Método para editar un libro
  actualizarLibro(id: number, libro: LibroCrea): Observable<Libro> {
    return this.http.put<Libro>(`${this.apiUrl}/actualizar/${id}`, libro, {
    });
  }




// Método para eliminar un libro
  eliminarLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, {
    });
  }


  // Método en Angular o cualquier otro frontend que uses para buscar el libro por título
  buscarLibroPorTitulo(titulo: string): Observable<LibroCrea[]> {
    return this.http.get<LibroCrea[]>(`${this.apiUrl}/search?q=${titulo}`);
  }

  obtenerLibro(libroId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${libroId}`);
  }


  obtenerAutores(): Observable<Autor[]> {
  return this.http.get<Autor[]>(`${this.apiUrl}/all`);
}

  obtenerCategorias():Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/all`);

  }

}
