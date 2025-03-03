import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {UsuarioResponse} from '../models/usuario-response.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl =  environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Método para registrar un usuario.
   * @param usuario
   */

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro`, usuario);
  }

  /**
   * Método para actualizar un usuario que es cliente.
   * @param id
   * @param usuario
   */
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/cliente/editar/${id}`, usuario);
  }

  /**
   * Método para obtener un usuario por su nick.
   * @param nick
   */

  obtenerCorreoPorNick(nick: string): Observable<UsuarioResponse> {
    const nickCodificado = encodeURIComponent(nick); // Evita espacios y caracteres raros en la URL
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/api/usuario/${nickCodificado}`);
  }



}
