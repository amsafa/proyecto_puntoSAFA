import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.component.html',
  imports: [
    FormsModule,
  ],
  styleUrls: ['./restablecer-contrasena.component.css']
})
export class RestablecerContrasenaComponent {
  token: string = '';
  nuevaContrasena: string = '';
  confirmContrasena: string = '';
  mensaje: string = '';
  error: string = '';
  tokenValido: boolean = false;  // Bandera para saber si el token es válido
  cargando: boolean = false;  // Bandera para saber si estamos esperando una respuesta

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') || '';

    if (this.token) {
      this.verificarToken(this.token);
    }
  }

  verificarToken(token: string): void {
    this.cargando = true;
    this.authService.verificarToken(token).subscribe(
      response => {
        this.tokenValido = true;
        this.cargando = false;
      },
      err => {
        this.error = 'Token inválido o expirado';
        this.tokenValido = false;
        this.cargando = false;
      }
    );
  }



  onRestablecerContrasena() {
    if (this.nuevaContrasena !== this.confirmContrasena) {
      this.error = 'Las contraseñas no coinciden';
      this.mensaje = '';
      return;
    }

    this.authService.restablecerContrasena(this.token, this.nuevaContrasena).subscribe(
      response => {
        this.mensaje = 'Contraseña restablecida correctamente';
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      err => {
        this.error = err.error?.message || err.message || 'Hubo un error al intentar restablecer la contraseña';
        this.mensaje = '';
      }
    );
  }

}
