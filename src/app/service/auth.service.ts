import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, lastValueFrom, Observable, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../interface/RegistroCliente';
import { Login } from '../interface/Login';
import { ActualizarService } from './actualizar.service';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  private userData = new BehaviorSubject<RegistroCliente | null>(null);
  private apiUrl =  environment.apiUrl;



  constructor(
    private http: HttpClient,
    private router: Router,
    private actualizar: ActualizarService
  ) {}


  // Iniciar sesión
  async login(credentials: Login): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ token: string }>(`${this.apiUrl}/api/login_check`, credentials)
      );
      if (!response.token) throw new Error("Token no recibido");

      localStorage.setItem('token', response.token);
      this.authState.next(true);

      const user = await this.fetchUserData();
      if (user?.usuario?.rol) {
        localStorage.setItem('userData', JSON.stringify(user));
        await this.router.navigate([user.usuario.rol === 'admin' ? '/perfil-adm' : '/home']);
      } else {
        await this.router.navigate(['/login']);
      }
    } catch (error: any) {
      Swal.fire("Error", error.status === 401 ? "Usuario o contraseña incorrectos." : "No se pudo iniciar sesión.", "error");
      localStorage.removeItem('token');
      this.authState.next(false);
    }
  }

  fetchUserData(): Promise<RegistroCliente | null> {
    const token = this.getToken();

    if (!token) {
      console.error("❌ No hay token en sessionStorage");
      return Promise.resolve(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return lastValueFrom(
      this.http.get<RegistroCliente>('https://localhost:8000/api/cliente/auth/user', { headers })  //lisseth
      //this.http.get<RegistroCliente>('api/api/cliente/auth/user', { headers })  // alba
      //this.http.get<RegistroCliente>(`${this.apiUrl}/api/cliente/auth/user`, { headers })  // pablo


    ).then(userData => {
      this.userData.next(userData);
      localStorage.setItem('userData', JSON.stringify(userData));  // 🔹 Guardar en localStorage
      console.log(userData);
      return userData;
    }).catch(err => {
      console.error("❌ Error al obtener datos del usuario:", err);

      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          console.error("❌ Token inválido o caducado. Requiere autenticación.");
          this.router.navigate(['/login']);
          this.userData.next(null);
        } else {
          console.error(`❌ Error HTTP ${err.status}: ${err.message}`);
        }
      } else {
        console.error("❌ Error inesperado:", err);
      }

      this.userData.next(null);
      return null;
    });
  }



  getUserData(): Observable<RegistroCliente | null> {
    return this.userData.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }



  // Registrar un nuevo usuario
  registro(userData: RegistroCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/registro`, userData).pipe(catchError(this.handleError));
  }


  // Cerrar sesión
  logout(): void {
    localStorage.clear();
    this.authState.next(false);
    this.router.navigate(['login']).then(() => this.actualizar.triggerRefreshHeader());
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }


  // Manejo de errores en peticiones HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos para acceder a esta información.';
    }
    Swal.fire('Error', errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }

  actualizarUsuario(usuarioEditado: any) {

  }

  recuperarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/recuperar-contrasena`, { email });
  }

  // Método para restablecer la contraseña con el token
  // authService.ts
  restablecerContrasena(token: string, nuevaContrasena: string): Observable<any> {
    return this.http.post(`https://localhost:8000/api/restablecer-contrasena/${token}`, { contraseña: nuevaContrasena });
  }



  verificarToken(token: string) {
    return this.http.get(`${this.apiUrl}/api/verificar-token/${token}`);

  }
}



