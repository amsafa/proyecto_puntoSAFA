import {Cliente} from './cliente';

export interface Usuario {
  id?: number; // Assuming you have an ID
  nick?: string;
  contrasena?:string;
  rol?:string;
  email?: string;
  cliente: Cliente;
}
