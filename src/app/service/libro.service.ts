import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Libro} from '../interface/libro';
import {Usuario} from '../interface/usuario';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private baseUrl: string = "http://127.0.0.1:8000/libro";

  constructor() { }

  async getLibros(): Promise<Libro[]> {
    const response = await fetch(`${this.baseUrl}/all`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }

  async searchLibros(q:string): Promise<Libro[]> {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(q)}`);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
  }


}
