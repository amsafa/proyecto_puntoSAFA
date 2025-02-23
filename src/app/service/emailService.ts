import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiUrl; // La URL de tu API Symfony

  constructor(private http: HttpClient) { }

  // Método para enviar el correo
  enviarCorreo(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/enviar-correo`, formData);
  }
}
