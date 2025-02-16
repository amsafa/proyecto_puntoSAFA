import {Component, OnInit} from '@angular/core';
import {LibroCarrito} from '../../interface/libro-carrito';
import {CarritoService} from '../../service/carrito.service';
import {CurrencyPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-pagar-compra',
  imports: [
    NgForOf,
    CurrencyPipe
  ],
  templateUrl: './pagar-compra.component.html',
  styleUrl: './pagar-compra.component.css'
})
export class PagarCompraComponent implements OnInit{
  cartItems: LibroCarrito[] = [];
  totalPrice: number = 0;

  constructor(private carritoService:CarritoService) {
  }

  ngOnInit() {
    this.carritoService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.carritoService.getTotalPrice();
    });
  }

  increaseQuantity(item: LibroCarrito) {
    this.carritoService.increaseQuantity(item);
  }

  decreaseQuantity(item: LibroCarrito) {
    this.carritoService.decreaseQuantity(item);
  }

  removeItem(itemId: number) {
    this.carritoService.removeItem(itemId);
  }

}
