import { z } from "zod";

export const createPedidosSchema = z.object({
  cliente_id: z
    .number({
      message: "El id de cliente debe ser obligatorio",
    })
    .min(1, "el nombre debe tener almenos 1 caracteres")
    .positive("El id de cliente debe ser mayor a 0"),
  total: z
    .number({
      message: "El total debe ser obligatorio",
    })
    .positive("El total debe ser mayor a 0"),
  id_repartidor: z
    .number({
      message: "El id del repartidor debe ser obligatorio",
    })
    .min(1, "el nombre debe tener almenos 1 caracter")
    .positive("El id de cliente debe ser mayor a 0")
    .optional()
    .nullable(),
});

export const updatePedidosSchema = z.object({
  nombre: z
    .string({
      message: "El nombre debe ser obligatorio",
    })
    .min(3, "el nombre debe tener almenos 3 caracteres")
    .trim()
    .min(1)
    .optional(),
  precio: z
    .number({
      message: "El precio debe ser obligatorio",
    })
    .positive("el precio debe ser mayor a 0"),
  categoria: z
    .string({
      message: "la categoria debe ser obligatorio",
    })
    .min(3, "la categoria debe tener almenos 3 caracteres")
    .trim()
    .min(1),
});
