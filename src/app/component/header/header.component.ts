import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NgIf
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
