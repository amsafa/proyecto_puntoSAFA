import { Injectable } from '@angular/core';
import {Libro} from '../interface/libro';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private baseUrl: string = "http://127.0.0.1:8000/libro";

  constructor(private http: HttpClient) { }

  async getLibros(): Promise<Libro[]> {
    const response = await fetch(`${this.baseUrl}/all`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }

getLibrosByPrecio(range:string):Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.baseUrl}/precios`);
}




}
