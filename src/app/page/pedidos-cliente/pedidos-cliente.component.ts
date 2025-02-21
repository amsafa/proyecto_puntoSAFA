import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {Pedido} from '../../interface/pedido';
import {PedidoService} from '../../service/pedido.service';
import {AuthService} from '../../service/auth.service';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-pedidos-cliente',
  imports: [
    NgIf,
    NgForOf,
    CurrencyPipe,
    DatePipe,
    NgClass,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './pedidos-cliente.component.html',
  styleUrl: './pedidos-cliente.component.css'
})
export class PedidosClienteComponent implements OnInit{
  pedidos: Pedido[] = [];
  loading = true;
  errorMessage = '';

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
      }else{
        this.loading = false;
        this.errorMessage = 'Inicar sesión para consultar tus pedidos';

      }
    })
  }

}
