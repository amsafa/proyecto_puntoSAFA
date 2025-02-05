import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Login } from '../modelo/Login';
import { RegistroCliente } from '../modelo/RegistroCliente';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authState = new BehaviorSubject<boolean>(!!sessionStorage.getItem('authToken'));
  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) {}

  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }

  loguear(login: Login): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, login);
  }

  registrar(registro: RegistroCliente): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro`, registro);
  }
}
