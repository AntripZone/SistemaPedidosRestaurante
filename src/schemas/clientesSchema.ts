import { z } from "zod";

export const createClienteSchema = z.object({
  nombres: z
    .string({
      message: "El nombre es obligatorio",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .trim()
    .min(1),

  apellidos: z
    .string({
      message: "Los apellidos son obligatorios",
    })
    .min(3, "Los apellidos deben tener al menos 3 caracteres")
    .trim()
    .min(1),

  telefono: z
    .string({
      message: "El teléfono es obligatorio",
    })
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .trim(),

  direccion: z
    .string({
      message: "La dirección es obligatoria",
    })
    .min(3, "La dirección debe tener al menos 3 caracteres")
    .trim(),

  email: z
    .string({
      message: "El email es obligatorio",
    })
    .email("El email no es válido")
    .trim(),

  ciudad: z
    .string({
      message: "La ciudad es obligatoria",
    })
    .min(3, "La ciudad debe tener al menos 3 caracteres")
    .trim(),
});

export interface clienteQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  ciudad?: string;
}

export const updateClienteSchema = z
  .object({
    telefono: z
      .string()
      .min(7, "El teléfono debe tener al menos 7 caracteres")
      .trim()
      .optional(),

    direccion: z
      .string()
      .min(3, "La dirección debe tener al menos 3 caracteres")
      .trim()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });