import { Injectable } from '@angular/core';
import {LibroCarrito} from '../interface/libro-carrito';
import {BehaviorSubject, Observable} from 'rxjs';
import {Libro} from '../interface/libro';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cartItems: LibroCarrito[] = [];
  private cartSubject = new BehaviorSubject<LibroCarrito[]>([]);
  private showCartSubject = new BehaviorSubject<boolean>(false);

  public showCart$ = this.showCartSubject.asObservable();
  public cartItems$ = this.cartSubject.asObservable();

  toggleCart() {
    this.showCartSubject.next(!this.showCartSubject.value);
  }

  setCartVisibility(visible: boolean) {
    this.showCartSubject.next(visible);
  }


  addToCart(libro: Libro) {
    const existingItem = this.cartItems.find(item => item.id === libro.id);

    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity if item already exists
    } else {
      this.cartItems.push({
        id: libro.id,
        name: libro.titulo,
        image: libro.imagen,
        price: libro.precio,
        quantity: 1
      });
    }

    this.cartSubject.next(this.cartItems); // Notify subscribers with the updated cart
  }

  increaseQuantity(item: LibroCarrito) {
    item.quantity++;
    this.cartSubject.next(this.cartItems);
  }

  // Decrease quantity
  decreaseQuantity(item: LibroCarrito) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item.id); // Remove the item if quantity is 1 and the user decreases it
    }
    this.cartSubject.next(this.cartItems);
  }

  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.cartSubject.next(this.cartItems); // Notify with updated cart items
  }

  // Get cart items
  getCartItems(): Observable<LibroCarrito[]> {
    return this.cartSubject.asObservable(); // Return the observable of the cart items
  }
  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }





}
