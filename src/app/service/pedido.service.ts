import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Pedido} from '../interface/pedido';
import {Observable} from 'rxjs';
import {EstadisticasPedidos} from '../interface/estadisticas-pedidos';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://127.0.0.1:8000/pedido';

  getPedidosByCliente(clienteId: number, token: string | null): Observable<Pedido[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers });
  }

  getOrderStatsByClient(clientId: number, token: string | null): Observable<EstadisticasPedidos> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/cliente/${clientId}/estadisticas`, { headers });
  }
}
