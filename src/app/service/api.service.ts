import { Injectable } from '@angular/core';
import {Usuario} from '../interface/usuario'


@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private baseUrl: string = "http://127.0.0.1:8000/usuario/all";
  async getUsers(): Promise<Usuario> {

    const response = await fetch(this.baseUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();

  }
}
