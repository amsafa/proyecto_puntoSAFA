import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {LibroCarrito} from '../../interface/libro-carrito';
import {CarritoService} from '../../service/carrito.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Pedido} from '../../interface/pedido';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Cliente} from '../../interface/cliente';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pagar-compra',
  imports: [
    NgForOf,
    CurrencyPipe,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './pagar-compra.component.html',
  styleUrl: './pagar-compra.component.css'
})
export class PagarCompraComponent implements OnInit{
  cartItems: LibroCarrito[] = [];
  shipping: number = 0;
  userData: Cliente | undefined;
  direccion_entrega: string = '';
  showModal: boolean = false;
  modalMessage: string = '';
  baseTotal:number =0;
  totalWithTaxes:number = 0;
  paymentForm!: FormGroup;
  // codigo:string = "PO" + new Date().toISOString().slice(0, 10).replace(/-/g, '');
  codigo:string='';



  constructor(private carritoService:CarritoService, private fb:FormBuilder, private router:Router) {
  }

  ngOnInit() {
    this.carritoService.getCartItems().subscribe(items => {
      this.cartItems = items;
      const {baseTotal, totalWithTaxes, shipping} = this.carritoService.getTotalPrice();
      this.baseTotal = baseTotal;
      this.totalWithTaxes = totalWithTaxes;
      this.shipping = shipping;

    });

    this.paymentForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      direccion_entrega: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/)]], // Visa or Mastercard format
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/), this.expiryDateValidator]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });

    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);

        // Check if userData has a 'cliente' property
        if (!this.userData?.id) {
          console.error("User data does not contain a valid cliente object:", this.userData);
          this.showAlert("User information is incomplete. Please log in again.");
          return;
        }

      } catch (error) {
        console.error('Error parsing userData:', error);
        this.showAlert('Failed to load user data. Please log in again.');
        return;
      }
    } else {
      console.error('No userData found in localStorage.');
      this.showAlert('Debe iniciar sesión para hacer un pedido');
      return;
    }


    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
    }

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

  get direccion() {
    return this.paymentForm.get('direccion_entrega');
  }

  makePayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched(); // Show all errors
      return;
    }

    if (!this.userData || !this.userData || !this.userData.id) {
      this.showAlert("Debes iniciar sesión para realizar esta acción");
      return;
    }

    console.log("Sending Pedido with Cliente ID:", this.userData.id);

    const pedido: Pedido = {
      fecha: new Date().toISOString(),
      total: this.totalWithTaxes,
      estado: "procesado",
      // codigo:this.codigo,
      direccion_entrega: this.paymentForm.get('direccion_entrega')?.value,
      cliente: this.userData.id,
      lineaPedidos: this.cartItems.map(item => ({
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        libro: {
          id: item.id,
          titulo: item.titulo,
          imagen: item.imagen,
          precio: item.precio,
          cantidad: item.cantidad
        }, // Pass the full object
      })),
    };

    this.carritoService.savePedido(pedido).subscribe({
      next: (response) => {
        console.log('Order saved:', response);
        this.showAlert('Pedido realizado con éxito');
        this.clearCart();
        setTimeout(() => {
          this.router.navigateByUrl('/home').then(()=>{
            window.location.reload();
          });
        }, 2000);

        },
      error: (error) => {
        console.error('Error saving order:', error);
        this.showAlert('Error al procesar el pedido');
      }
    });

  }

  clearCart() {
    this.cartItems = []; // Empty the cart array
    localStorage.removeItem('cart'); // Remove cart from localStorage
  }

  expiryDateValidator(control: any) {
    if (!control.value) return { invalidDate: true };

    const today = new Date();
    const [month, year] = control.value.split('/');
    const expiry = new Date(Number(`20${year}`), Number(month), 1);

    return expiry < today ? { expired: true } : null;
  }

  showAlert(message: string) {
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
