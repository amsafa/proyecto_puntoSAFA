import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {Pedido} from '../../interface/pedido';
import {PedidoService} from '../../service/pedido.service';
import {AuthService} from '../../service/auth.service';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {EstadisticasPedidos} from '../../interface/estadisticas-pedidos';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-pedidos-cliente',
  imports: [
    NgIf,
    NgForOf,
    CurrencyPipe,
    DatePipe,
    NgClass,
    RouterLink,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './pedidos-cliente.component.html',
  styleUrl: './pedidos-cliente.component.css'
})
export class PedidosClienteComponent implements OnInit{
  pedidos: Pedido[] = [];
  loading = true;
  errorMessage = '';
  showReviewForm: { [libroId: number]: boolean } = {};
  orderStats: EstadisticasPedidos | undefined;

  constructor(private pedidoService:PedidoService, private authService:AuthService) {}

  ngOnInit() {
    this.authService.fetchUserData().then(userData => {
      if(userData && userData.id){
        const token = localStorage.getItem('token');
        this.pedidoService.getPedidosByCliente(userData.id, token).subscribe({
          next: (data)=>{
            this.pedidos = data;
            this.loading = false;
            this.pedidos = Array.isArray(data) ? data : [];
          },error:error=>{
            this.errorMessage = 'Error fetching orders';
            this.loading = false;
        }
        });
        this.pedidoService.getOrderStatsByClient(userData.id, token).subscribe( {
          next:(data)=>{
            this.orderStats = data;
          },error:(error)=>{
            this.errorMessage = 'Error fetching stats';

          }
        });
      }else{
        this.loading = false;
        this.errorMessage = 'Inicar sesión para consultar tus pedidos';
      }
    })
  }

  toggleReviewForm(libroId: number) {
    this.showReviewForm[libroId] = !this.showReviewForm[libroId];
  }



}
