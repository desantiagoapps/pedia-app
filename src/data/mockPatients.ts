import { Patient } from "../types/Patient";

export const patients: Patient[] = [
  {
    id: "PED-001",
    pseudonimo: "PANDA",

    nombre: "Juan Pérez",

    edad: 8,

    cama: "12",

    diagnostico: "Neumonía",

    antecedentes: "Sin antecedentes relevantes",

    padecimientoActual:
      "Fiebre y dificultad respiratoria",

    tratamientoActual:
      "Ceftriaxona IV"
  },

  {
    id: "PED-002",
    pseudonimo: "LUNA",

    nombre: "María Gómez",

    edad: 12,

    cama: "15",

    diagnostico: "Pancreatitis",

    antecedentes:
      "Sin antecedentes relevantes",

    padecimientoActual:
      "Dolor abdominal",

    tratamientoActual:
      "Ayuno y líquidos IV"
  }
];