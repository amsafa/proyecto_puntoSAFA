import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false; // Variable para manejar el estado del menú

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Alternar visibilidad
  }



}
