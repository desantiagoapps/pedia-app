export interface Patient {
  id: string;
  pseudonimo: string;

  nombre: string;
  fechaNacimiento: string;

  fechaIngreso: string;

  peso: number;

  talla?: number;

  cama: string;

  diagnostico: string;

  antecedentes: string;

  padecimientoActual: string;

  tratamientoActual: string;
}