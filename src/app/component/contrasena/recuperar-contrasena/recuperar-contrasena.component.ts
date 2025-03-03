import { Component } from '@angular/core';
import {AuthService} from '../../../service/auth.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {
  email: string = '';
  mensaje: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  /**
   * Método que se ejecuta al hacer click en el botón de recuperar contraseña
   * Llama al servicio de autenticación para recuperar la contraseña
   * @returns void
   */
  onRecuperarContrasena() {
    this.authService.recuperarContrasena(this.email).subscribe(
      response => {
        this.mensaje = response.mensaje || 'Correo de recuperación enviado correctamente';
        this.error = '';
      },
      err => {
        this.error = err.error.error || 'Hubo un error al intentar recuperar la contraseña';
        this.mensaje = '';
      }
    );
  }
}
