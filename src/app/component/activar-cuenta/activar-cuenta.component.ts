import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-activar-cuenta',
  imports: [],
  templateUrl: './activar-cuenta.component.html',
  styleUrl: './activar-cuenta.component.css'
})
export class ActivarCuentaComponent implements OnInit {

  mensaje: string = 'Activando cuenta...';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  /**
   *
   * Se encarga de leer el token de la URL y activar la cuenta
   * @return void
   *
   */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.activarCuenta(token);
      } else {
        this.mensaje = 'Token no válido';
      }
    });
  }

  /**
   * Manda una petición al servidor para activar la cuenta. Si la petición es exitosa, redirige al login.
   * @param token
   */

  activarCuenta(token: string) {
    this.http.post('http://localhost:3000/api/activar-cuenta', { token }).subscribe(
      () => {
        this.mensaje = 'Cuenta activada con éxito. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error => {
        this.mensaje = 'Error activando la cuenta. El token puede estar vencido.';
      }
    );
  }
}
