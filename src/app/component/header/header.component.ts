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

  constructor(private authService: AuthService, private router: Router, private carritoService:CarritoService) { }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe((state) => {
      this.isLoggedIn = state;
      if (this.isLoggedIn) {
        this.authService.fetchUserData();
      }
    });

    this.authService.getUserData().subscribe((user) => {
      this.userData = user;
    });
    this.carritoService.cartItems$.subscribe(items => {
      this.cartQuantity = items.reduce((total, item) => total + item.cantidad, 0);  // Sum up all item quantities
    });

    // Subscribe to cart visibility
    this.carritoService.showCart$.subscribe(show => {
      this.showCart = show; // Update cart visibility in header
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
    this.carritoService.toggleCart(); // Toggle cart visibility
  }
}
