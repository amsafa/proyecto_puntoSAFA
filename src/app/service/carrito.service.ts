import { Injectable } from '@angular/core';
import {LibroCarrito} from '../interface/libro-carrito';
import {BehaviorSubject, Observable} from 'rxjs';
import {Libro} from '../interface/libro';
import {Pedido} from '../interface/pedido';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadCartFromLocalStorage(); // Cargar el carrito desde el localStorage al iniciar el servicio
  }

  private loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartSubject.next(this.cartItems); // Notificar a los suscriptores
    }
  }

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


  addToCart(libro: Libro |undefined, cantidad: number=1) {
    if (!libro) return;

    const existingItem:LibroCarrito | undefined = this.cartItems.find(item => item.id === libro!.id);
    if (existingItem) {
      existingItem.cantidad += 1; // Increment quantity if item already exists
    } else {
      this.cartItems.push({
        id: libro!.id,
        titulo: libro!.titulo,
        imagen: libro!.imagen,
        precio: libro!.precio!,
        cantidad: cantidad // Use provided quantity
      });
    }

    this.cartSubject.next(this.cartItems); // Notify subscribers with the updated cart
    this.saveCartToLocalStorage(); // Guardar en el localStorage

  }

  increaseQuantity(item: LibroCarrito) {
    item.cantidad++;
    this.cartSubject.next(this.cartItems);
    this.saveCartToLocalStorage(); // Guardar en el localStorage
  }


  // Decrementar la cantidad de un ítem
  decreaseQuantity(item: LibroCarrito) {
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      this.removeItem(item.id); // Eliminar el ítem si la cantidad es 1
    }
    this.cartSubject.next(this.cartItems);
    this.saveCartToLocalStorage(); // Guardar en el localStorage
  }

  // Eliminar un ítem del carrito
  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.cartSubject.next(this.cartItems); // Notificar a los suscriptores
    this.saveCartToLocalStorage(); // Guardar en el localStorage
  }


  // Obtener el precio total
  getTotalPrice(): { baseTotal: number; totalWithTaxes: number; shipping: number } {
    const baseTotal = this.cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
    const taxes = 0.21; // Impuestos del 21%
    const shipping = 2.5; // Costo de envío
    const totalWithTaxes = baseTotal + baseTotal * taxes + shipping;
    return { baseTotal, totalWithTaxes, shipping };
  }

  // Obtener la cantidad total de ítems en el carrito
  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.cantidad, 0);
  }



  // Obtener los ítems del carrito como un Observable
  getCartItems(): Observable<LibroCarrito[]> {
    return this.cartItems$;
  }

  // Guardar un pedido en el servidor
  savePedido(pedido: Pedido): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedido/save`, pedido);
  }

  // Guardar el carrito en el localStorage
  private saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Limpiar el carrito
  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems); // Notificar a los suscriptores
    localStorage.removeItem('cart'); // Eliminar el carrito del localStorage
  }




}
