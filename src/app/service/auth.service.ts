import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, lastValueFrom, Observable, throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistroCliente } from '../interface/RegistroCliente';
import { Login } from '../interface/Login';
import { ActualizarService } from './actualizar.service';
import {environment} from '../../environments/environment';
import {Usuario} from '../interface/usuario';

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


  /**
   *
   *  Método para iniciar sesión en la aplicación con las credenciales proporcionadas.
   * @param credentials
   *
   */
  async login(credentials: Login): Promise<void> {
    localStorage.removeItem('token'); // Limpiar token anterior
    try {
      const response = await lastValueFrom(
        this.http.post<{ token: string }>(`${this.apiUrl}/api/login_check`, credentials)
      );

      if (!response.token) {
        throw new Error("❌ Token no recibido en la respuesta del servidor.");
      }

    //  console.log("✅ Token recibido:", response.token);

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


  /**
   * Método para realizar una petición HTTP GET al servidor
   * para obtener los datos del usuario autenticado.
   *
   * @returns Promise<RegistroCliente | null>
   * @memberof AuthService
   *
   */


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

    return  lastValueFrom(
       this.http.get<RegistroCliente>('https://localhost:8000/api/cliente/auth/user', { headers })  //lisseth
      //this.http.get<RegistroCliente>('api/api/cliente/auth/user', { headers })  // alba
      //this.http.get<RegistroCliente>(`${this.apiUrl}/api/cliente/auth/user`, { headers })  // pablo

    ).then(userData => {
      this.userData.next(userData);
      localStorage.setItem('userData', JSON.stringify(userData));  // 🔹 Guardar en localStorage
    //  console.log(userData);
      return userData;
    }).catch(err => {
      console.error("❌ Error al obtener datos del usuario:", err);

      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          console.error("❌ Token inválido o caducado. Requiere autenticación.");
          this.router.navigate(['/login']);
          this.userData.next(null);
        } else {
        //  console.error(`❌ Error HTTP ${err.status}: ${err.message}`);
        }
      } else {
        console.error("❌ Error inesperado:", err);
      }

      this.userData.next(null);
      return null;
    });
  }



  /**
   * Método para obtener los datos del usuario autenticado como un Observable.
   *
   * @returns Observable<RegistroCliente | null> - Un Observable que emite los datos del usuario autenticado o null si no hay datos.
   */
  getUserData(): Observable<RegistroCliente | null> {
    return this.userData.asObservable();
  }

  /**
   * Método para obtener el token de autenticación del usuario.
   * @returns string | null - El token de autenticación o null si no hay token.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  /**
   * Método para registrar un nuevo usuario en la aplicación como cliente.
   * @param userData
   */
  registro(userData: RegistroCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/registro`, userData).pipe(catchError(this.handleError));
  }


  /**
   * Método para cerrar la sesión del usuario y redirigir a la página de inicio.
   * @returns void
   */
  logout(): void {
    localStorage.clear();
    this.authState.next(false);
    this.router.navigate(['login']).then(() => {
      Swal.fire({
        title: 'Sesión cerrada correctamente',
        text: 'Se ha cerrado sesión correctamente. Nos vemos pronto.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => this.actualizar.triggerRefreshHeader());
    });
  }

  /**
   * Método para comprobar si el usuario está autenticado.
   * @returns boolean - true si el usuario está autenticado, false en caso contrario.
   */

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Método para obtener el estado de autenticación del usuario como un Observable.
   * @returns Observable<boolean> - Un Observable que emite true si el usuario está autenticado, false en caso contrario.
   */

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }


  /**
   * Método privado para manejar los errores de las peticiones HTTP.
   * @param error
   * @private
   */
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

  /**
   * Método para recuperar la contraseña de un usuario.
   * @param email
   */
  recuperarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/recuperar-contrasena`, { email });
  }

  /**
   * Método para restablecer la contraseña de un usuario.
   * @param token
   * @param nuevaContrasena
   */
  restablecerContrasena(token: string, nuevaContrasena: string): Observable<any> {
    return this.http.post(`https://localhost:8000/api/restablecer-contrasena/${token}`, { contraseña: nuevaContrasena });
  }


  /**
   * Método para verificar si un token es válido.
   * @param token
   */
  verificarToken(token: string) {
    return this.http.get(`${this.apiUrl}/api/verificar-token/${token}`);

  }


  /**
   * Método para obtener la lista de usuarios registrados en la aplicación.
   * @param id
   * @param usuarioEditado
   */

  actualizarUsuario(id: number, usuarioEditado: any): Observable<Usuario> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Crear el cuerpo de la solicitud
    const body: any = {
      nick: usuarioEditado.usuario.nick,
      email: usuarioEditado.usuario.email,
      rol: usuarioEditado.usuario.rol // Añadir el campo rol si es necesario
    };

    // Añadir la contraseña solo si no está vacía
    if (usuarioEditado.contrasena) {
      body.contrasena = usuarioEditado.contrasena;
    }

    return this.http.put<Usuario>(`${this.apiUrl}/usuario/editar/${id}`, body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al actualizar el usuario:', error);
          return throwError(() => new Error('No se pudo actualizar el usuario. Por favor, inténtalo de nuevo.'));
        })
      );
  }

}
