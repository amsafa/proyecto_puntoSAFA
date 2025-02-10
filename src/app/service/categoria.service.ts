import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categoria} from '../interface/categoria';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
  private baseUrl: string = "http://127.0.0.1:8000/categoria";

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/all`);
  }
}
