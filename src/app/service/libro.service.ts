import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {LibroCrea} from '../interface/libro-crea';
import {Categoria} from '../interface/categoria';
import {Autor} from './autor.service';



@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl: string =  `${environment.apiUrl}/libro`;

  constructor(private http: HttpClient) { }


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

  getLibroById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);}

  getLibrosByPrecio(range: string, page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/precio/${range}?page=${page}&limit=${limit}`).pipe(
      map(libros => libros.map(libro => ({
        ...libro,
        mediaCalificacion: parseFloat(String(libro.mediaCalificacion))
      })))
    );
  }


  // Método para obtener libros por categoría (desde el backend)
  getBooksByCategory(id: number, page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/categoria/${id}?page=${page}&limit=${limit}`).pipe(
      map(libros => libros.map(libro => ({
        ...libro,
        mediaCalificacion: parseFloat(String(libro.mediaCalificacion))
      })))
    );
  }




  // Método para crear un libro


  crearLibro(libro: LibroCrea): Observable<Libro> {
    return this.http.post<Libro>(`${this.apiUrl}/guardar`, libro);
  }


// Método para editar un libro
  actualizarLibro(id: number, libro: LibroCrea): Observable<LibroCrea> {
    return this.http.put<LibroCrea>(`${this.apiUrl}/actualizar/${id}`, libro, {
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
