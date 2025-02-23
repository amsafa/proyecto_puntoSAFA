import { Component, OnInit, HostListener } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import {CarritoService} from '../../service/carrito.service';
import {CarritoCompraComponent} from '../carrito-compra/carrito-compra.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [NgIf, NgClass, RouterLink, CarritoCompraComponent],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isMenuOpen = false;
  showMenu = false;
  userData: any = null;
  cartQuantity: number = 0;
  showCart: boolean = false;

  constructor(private authService: AuthService, private router: Router, private carritoService:CarritoService) { }

  ngOnInit(): void {
    // Recuperar datos de localStorage al iniciar
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.userData = JSON.parse(localStorage.getItem('userData') || 'null');
    this.cartQuantity = Number(localStorage.getItem('cartQuantity')) || 0;

    console.log("UserData al iniciar el header:", this.userData); // 🔍 Debug inicial

    // Suscripción al estado de autenticación
    this.authService.getAuthState().subscribe((state) => {
      this.isLoggedIn = state;
      localStorage.setItem('isLoggedIn', JSON.stringify(this.isLoggedIn));
    });

    // Suscripción a los datos del usuario
    this.authService.getUserData().subscribe((user) => {
      this.userData = user;  // Se actualizan los datos del usuario
      localStorage.setItem('userData', JSON.stringify(this.userData));  // Guardar en localStorage

      console.log("UserData actualizado en header:", this.userData); // 🔍 Debug
      console.log("Rol del usuario:", this.userData?.usuario?.rol);
      console.log("¿Es admin?", this.userData?.usuario?.rol === 'admin');
    });

    // Suscripción a los productos en el carrito
    this.carritoService.cartItems$.subscribe(items => {
      this.cartQuantity = items.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem('cartQuantity', this.cartQuantity.toString());
    });

    // Suscripción a la visibilidad del carrito
    this.carritoService.showCart$.subscribe(show => {
      this.showCart = show;
    });
  }





  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleAccountMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.showMenu = false;
    this.isMenuOpen = false;
    this.userData = null;
    this.cartQuantity = 0;

    // Eliminar datos de localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('cartQuantity');

    this.router.navigate(['/home']);
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('nav')) {
      this.isMenuOpen = false;
      this.showMenu = false;
    }
  }

  toggleCart() {
    this.carritoService.toggleCart();
  }
}
