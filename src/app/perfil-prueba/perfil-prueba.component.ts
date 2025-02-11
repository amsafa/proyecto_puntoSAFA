import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {RegistroCliente} from '../interface/RegistroCliente';
import {AuthService} from '../service/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {Usuario} from '../interface/usuario';

@Component({
  selector: 'app-perfil-prueba',
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './perfil-prueba.component.html',
  styleUrl: './perfil-prueba.component.css'
})
export class PerfilPruebaComponent implements OnInit {
  user: RegistroCliente | null = null;
  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    this.authService.getUserData().subscribe(userData => {
      console.log('User data in component:', userData);
      this.user = userData;
    });

  }

}
