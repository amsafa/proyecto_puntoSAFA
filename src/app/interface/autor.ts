export interface Autor {
  id: number;
  nombre: string;
  apellidos: string;
  biografia: string;
  nacionalidad: string | null;
  fechaNacimiento?: Date; // Fecha de nacimiento del autor (opcional)
}
