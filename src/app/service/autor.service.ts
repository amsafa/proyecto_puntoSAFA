import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8000/autor'; // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) {}

  getAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(`${this.apiUrl}/all`);
  }

  getAutorById(id: number): Observable<Autor> {
    return this.http.get<Autor>(`${this.apiUrl}/${id}`);
  }
}
