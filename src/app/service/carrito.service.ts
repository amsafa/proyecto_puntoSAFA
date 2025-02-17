import { Injectable } from '@angular/core';
import {LibroCarrito} from '../interface/libro-carrito';
import {BehaviorSubject, Observable} from 'rxjs';
import {Libro} from '../interface/libro';
import {Pedido} from '../interface/pedido';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private baseUrl: string = "http://127.0.0.1:8000/pedido";

  constructor(private http: HttpClient) { }

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
  // getCartItems(): Observable<LibroCarrito[]> {
  //   return this.cartSubject.asObservable(); // Return the observable of the cart items
  // }
  getTotalPrice(): { baseTotal: number, totalWithTaxes: number, shipping:number } {
    const baseTotal = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const taxes = 0.21;
    const shipping=2.5;
    const totalWithTaxes = baseTotal + (baseTotal * taxes) + shipping;
    return { baseTotal, totalWithTaxes, shipping } ;
  }



  getCartItems(): Observable<LibroCarrito[]> {
    return this.cartItems$; // Allow components to subscribe
  }

  savePedido(pedido: Pedido): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, pedido);
  }




}
