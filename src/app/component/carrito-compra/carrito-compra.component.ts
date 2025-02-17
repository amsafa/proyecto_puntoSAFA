import { Component, OnInit } from '@angular/core';
import {LibroCarrito} from '../../interface/libro-carrito';
import {CarritoService} from '../../service/carrito.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Router} from "@angular/router";


@Component({
  selector: 'app-carrito-compra',
  imports: [
    NgIf,
    NgForOf,
    CurrencyPipe,
  ],
  templateUrl: './carrito-compra.component.html',
  styleUrl: './carrito-compra.component.css'
})
export class CarritoCompraComponent implements OnInit {
  cartItems: LibroCarrito[] = [];
  showCart: boolean = false;
  baseTotal:number =0;
  totalWithTaxes:number = 0;

  constructor(private carritoService: CarritoService, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to cart items to update the cart
    this.carritoService.getCartItems().subscribe(items => {
      this.cartItems = items;
      const {baseTotal, totalWithTaxes} = this.carritoService.getTotalPrice();
      this.baseTotal = baseTotal;
      this.totalWithTaxes = totalWithTaxes;

    });

    // Subscribe to cart visibility
    this.carritoService.showCart$.subscribe(show => {
      this.showCart = show;
    });
  }

  toggleCart() {
    this.carritoService.toggleCart();
  }

  // Increase item quantity
  increaseQuantity(item: LibroCarrito) {
    this.carritoService.increaseQuantity(item);
  }

  decreaseQuantity(item: LibroCarrito) {
    this.carritoService.decreaseQuantity(item);
  }

  // Remove item from cart
  removeItem(itemId: number) {
    this.carritoService.removeItem(itemId);
  }

  pagarPedido(): void {
    this.carritoService.setCartVisibility(false)
    this.router.navigate(['/pagar-pedido']);
  }



}
