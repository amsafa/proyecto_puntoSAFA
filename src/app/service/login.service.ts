import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Login } from '../interface/Login';
import { RegistroCliente } from '../interface/RegistroCliente';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
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

  autorizarPeticion(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });

    return {headers:headers}
  }
}
