import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isMenuOpen = false;
  showMenu= false;
  userData: any = null;


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authService.getAuthState().subscribe((state) => {
      this.isLoggedIn = state;
      if (this.isLoggedIn) {
        this.authService.fetchUserData(); // 🔹 Obtener los datos si ya está logueado
      }
    });

    // Suscribirse a los datos del usuario
    this.authService.getUserData().subscribe(user => {
      this.userData = user; // 🔹 Guardar los datos del usuario
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleAccountMenu() {
    this.showMenu = !this.showMenu;  // 🔹 Abre o cierra el menú de "Mi Cuenta"
  }

  logout() {
    this.authService.logout();
    this.showMenu = false;
  }
}
