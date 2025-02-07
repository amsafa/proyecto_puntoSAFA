export interface Autor {
  id: number;
  nombre: string;
  apellidos: string;
  biografia: string;
  nacionalidad: string | null;
  fechaNacimiento: string | null; // Fecha de nacimiento del autor (opcional)
}
