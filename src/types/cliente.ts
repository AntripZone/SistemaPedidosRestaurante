export interface Cliente {
  id: number;
  nombre: string;
  apellidos?: string;
  telefono: string;
  direccion: string;
  email?: string;
  ciudad: string;
}