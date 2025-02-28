export class Usuario {
  id?: number;
  nick?: string;
  email?: string;
  contrasena?: string;
  rol?: string;
  roles?: string[];
}

export class RegistroCliente {
  id?: number;
  email?: string;
  nick?: string;
  nombre?: string;
  apellidos?: string;
  dni?: string;
  foto?: string;
  telefono?: string;
  direccion?: string;
  contrasena?: string;
  usuario?: Usuario; // 🔹 Ahora usuario tiene su propia estructura

}

