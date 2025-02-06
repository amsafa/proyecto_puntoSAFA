import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {map, switchMap, tap } from 'rxjs/operators';
import {Router} from '@angular/router';
import {RegistroCliente} from '../interface/RegistroCliente';
import {catchError, Observable, throwError} from 'rxjs';
import {Login} from '../interface/Login';
import Swal from 'sweetalert2';
import {ActualizarService} from './actualizar.service';



@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private actualizar: ActualizarService) {}

  login(credentials: Login) {
    localStorage.removeItem('token');
    return this.http.post<{ token: string }>('http://127.0.0.1:8000/api/login_check', credentials)
      .pipe(tap(response => localStorage.setItem('token', response.token)));
  }


  getToken() {
    return localStorage.getItem('token');
  }

  registro(userData: RegistroCliente): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/registro', userData);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
    Swal.fire({
      title: 'Sesión cerrada correctamente',
      text: 'Se ha cerrado sesión correctamente. Nos vemos pronto.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    this.actualizar.triggerRefreshHeader();
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
