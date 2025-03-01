import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categoria} from '../interface/categoria';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categoria/all`);
  }
}
