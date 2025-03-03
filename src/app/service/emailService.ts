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

  /**
   * Envia un correo. Se le pasa un objeto con los datos del correo.
   * @param formData
   */
  enviarCorreo(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/enviar-correo`, formData);
  }
}
