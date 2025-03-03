import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {NavigationExtras} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/'; // Using the proxy configured

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos de la API
   * @returns Observable<any>
   */

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario`);
  }

}
