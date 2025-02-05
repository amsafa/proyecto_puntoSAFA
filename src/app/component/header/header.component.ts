import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;  // Variable para controlar el estado de la sesión
  isMenuOpen = false;  // Para el menú en móviles


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');  // Verifica si hay un token guardado
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    localStorage.removeItem('token');  // Elimina el token
    this.isLoggedIn = false;
    this.router.navigate(['/login']);  // Redirige al login después de cerrar sesión
  }
}
