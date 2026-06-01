import { Update } from "../types/Update";

export const updates: Update[] = [
  {
    id: "1",
    patientId: "PED-001",

    fecha: "30/05/2026",
    hora: "15:40",

    usuario: "Dr. Navarro",

    nota:
      "Paciente afebril. Tolera vía oral. BH normal."
  },

  {
    id: "2",
    patientId: "PED-001",

    fecha: "29/05/2026",
    hora: "08:15",

    usuario: "Dr. López",

    nota:
      "Ingreso hospitalario. Se inicia ceftriaxona."
  }
];