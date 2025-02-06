export interface Autor {
  id: number;
  nombre: string;
  apellidos: string;
  biografia: string;
  nacionalidad: string | null;
  fechaNacimiento: string | null; // ISO 8601 date string or null
}
