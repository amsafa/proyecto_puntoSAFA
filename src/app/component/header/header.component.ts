import {Component, OnInit, HostListener, LOCALE_ID} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import {CarritoService} from '../../service/carrito.service';
import {CarritoCompraComponent} from '../carrito-compra/carrito-compra.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [NgIf, NgClass, RouterLink, CarritoCompraComponent],
  styleUrls: ['./header.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isMenuOpen = false;
  showMenu = false;
  userData: any = null;
  cartQuantity: number = 0;
  showCart: boolean = false;
  isAdmin : boolean = false;

  constructor(private authService: AuthService, private router: Router, private carritoService:CarritoService) { }

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authService.getAuthState().subscribe((state) => {
      this.isLoggedIn = state;
      if (this.isLoggedIn) {
        this.authService.fetchUserData();
      }
    });

    // Obtener datos del usuario y verificar si es admin
    this.authService.getUserData().subscribe((user) => {
      this.userData = user;

      // Verificar si el usuario tiene el rol "ROLE_ADMIN"
      this.isAdmin = user?.usuario?.roles?.includes("ROLE_ADMIN") ?? false;
    });
    this.carritoService.cartItems$.subscribe(items => {
      this.cartQuantity = items.reduce((total, item) => total + item.cantidad, 0);  // Sum up all item quantities
    });

    // Recuperar datos del usuario desde localStorage si la página se recarga
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.isAdmin = userData.roles?.includes("ROLE_ADMIN") ?? false;
    }


    // Suscribirse a la visibilidad del carrito
    this.carritoService.showCart$.subscribe((show) => {
      this.showCart = show;
    });
  }

  // Función para cerrar sesión
  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }
  // Función para cerrar sesión
  toggleAccountMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }
  // Función para cerrar sesión
  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.showMenu = false;
    this.isMenuOpen = false;
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


  // Función para abrir el carrito
  toggleCart() {
    this.carritoService.toggleCart(); // Toggle cart visibility
  }
}
