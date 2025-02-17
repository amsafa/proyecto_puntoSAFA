import {Component, OnInit} from '@angular/core';
import {LibroCarrito} from '../../interface/libro-carrito';
import {CarritoService} from '../../service/carrito.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Pedido} from '../../interface/pedido';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Cliente} from '../../interface/cliente';

@Component({
  selector: 'app-pagar-compra',
  imports: [
    NgForOf,
    CurrencyPipe,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './pagar-compra.component.html',
  styleUrl: './pagar-compra.component.css'
})
export class PagarCompraComponent implements OnInit{
  cartItems: LibroCarrito[] = [];
  totalPrice: number = 0;
  userData: Cliente | undefined;
  address: string = '';
  showModal: boolean = false;
  modalMessage: string = '';
  baseTotal:number =0;
  totalWithTaxes:number = 0;
  paymentForm!: FormGroup;



  constructor(private carritoService:CarritoService, private fb:FormBuilder) {
  }

  ngOnInit() {
    this.carritoService.getCartItems().subscribe(items => {
      this.cartItems = items;
      const {baseTotal, totalWithTaxes} = this.carritoService.getTotalPrice();
      this.baseTotal = baseTotal;
      this.totalWithTaxes = totalWithTaxes;

    });

    this.paymentForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/)]], // Visa or Mastercard format
      expiryDate: ['', [Validators.required, this.expiryDateValidator]],
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
      this.showAlert('You need to log in before making a purchase.');
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

  makePayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched(); // Show all errors
      return;
    }

    if (!this.userData || !this.userData || !this.userData.id) {
      this.showAlert("User not logged in or client data is missing");
      return;
    }

    console.log("Sending Pedido with Cliente ID:", this.userData.id);

    const pedido: Pedido = {
      fecha: new Date().toISOString(), // Current date
      total: this.totalPrice,
      estado: "procesado",
      direccion: this.address,
      cliente: this.userData.id, // Ensure this is the correct client ID
      lineaPedidos: this.cartItems.map(item => ({
        cantidad: item.quantity,
        precio_unitario: item.price,
        libro: item.id, // Assuming 'id' is the book ID
      })),
    };

    this.carritoService.savePedido(pedido).subscribe({
      next: (response) => {
        console.log('Order saved:', response);
        this.showAlert('Order placed successfully!');
        localStorage.removeItem('cart'); // Clear cart after successful order
      },
      error: (error) => {
        console.error('Error saving order:', error);
        this.showAlert('Failed to place order');
      }
    });

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
