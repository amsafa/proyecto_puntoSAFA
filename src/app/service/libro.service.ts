import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Libro } from '../interface/libro'; // Importar la interfaz de libro
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private baseUrl: string =  `${environment.apiUrl}/libro`;

  constructor(private http: HttpClient) { }

  // Método para obtener los headers con el token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Enviar el token en cada solicitud
      'Content-Type': 'application/json'
    });
  }

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



  // getLibrosByPrecio(range:string):Observable<Libro[]> {
  //   return this.http.get<Libro[]>(`${this.baseUrl}/precio/${range}`);
  // }

  getLibrosByPrecio(range: string, page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/precio/${range}?page=${page}&limit=${limit}`).pipe(
      map(libros => libros.map(libro => ({
        ...libro,
        mediaCalificacion: parseFloat(String(libro.mediaCalificacion))
      })))
    );
  }


  // Método para obtener libros por categoría (desde el backend)
  // getBooksByCategory(id: number): Observable<Libro[]> {
  //   return this.http.get<Libro[]>(`${this.baseUrl}/categoria/${id}`);  }

  getBooksByCategory(id: number, page: number = 1, limit: number = 9): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/categoria/${id}?page=${page}&limit=${limit}`).pipe(
      map(libros => libros.map(libro => ({
        ...libro,
        mediaCalificacion: parseFloat(String(libro.mediaCalificacion))
      })))
    );
  }


  // Método para crear un libro


  crearLibro(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(`${this.baseUrl}/guardar`, libro);
  }


// Método para editar un libro
  editarLibro(id: number, libro: Libro): Observable<Libro> {
    return this.http.put<Libro>(`${this.baseUrl}/editar/${id}`, libro);
  }




// Método para eliminar un libro
  eliminarLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`, {
      headers: this.getHeaders()
    });
  }


  // Método en Angular o cualquier otro frontend que uses para buscar el libro por título
  buscarLibroPorTitulo(titulo: string): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/search?q=${titulo}`);
  }

  obtenerLibro(libroId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${libroId}`);
  }
}
