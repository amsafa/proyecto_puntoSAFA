import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface Autor {
  id: number;
  nombre: string;
  apellidos: string;
  biografia: string;
  nacionalidad: string;
  fecha_nacimiento: string; // En formato ISO (YYYY-MM-DD)
}

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(`${this.apiUrl}/all`);
  }

  getAutorById(id: number): Observable<Autor> {
    return this.http.get<Autor>(`${this.apiUrl}/${id}`);
  }

  crearAutor(autor: Autor): Observable<Autor> {
    return this.http.post<Autor>(`${this.apiUrl}/guardar`, autor);
  }

  editarAutor(id: number, autor: Autor): Observable<Autor> {
    return this.http.put<Autor>(`${this.apiUrl}/editar/${id}`, autor);
  }

  eliminarAutor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }

}
