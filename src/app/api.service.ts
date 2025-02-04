import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Book} from './interface/book';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl2 = 'http://127.0.0.1:8000/libro/all'; // Ajusta la URL según tu API

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl2);
  }
}
