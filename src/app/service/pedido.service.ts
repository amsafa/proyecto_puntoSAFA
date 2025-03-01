import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Pedido} from '../interface/pedido';
import {Observable} from 'rxjs';
import {EstadisticasPedidos} from '../interface/estadisticas-pedidos';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) { }
  private apiUrl = environment.apiUrl;

  getPedidosByCliente(clienteId: number, token: string | null): Observable<Pedido[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Pedido[]>(`${this.apiUrl}/pedido/cliente/${clienteId}`, { headers });
  }

  getOrderStatsByClient(clientId: number, token: string | null): Observable<EstadisticasPedidos> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/pedido/cliente/${clientId}/estadisticas`, { headers });
  }

  getPendingPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/pedido/all/pendientes`);
  }

  updateEstado(pedidoId: number | undefined, newEstado: string): Observable<Pedido> {
    return this.http.put<Pedido>(
      `${this.apiUrl}/pedido/${pedidoId}/estado`,
      { estado: newEstado },
      { headers: { 'Content-Type': 'application/json' } } // Explicitly set JSON headers
    );
  }


}
