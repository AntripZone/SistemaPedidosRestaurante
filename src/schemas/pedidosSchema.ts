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

export interface pedidoQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  estado?: string;
  cliente_id?: number;
}

export const updatePedidosSchema = z.object({
  estado: z
    .string({
      message: "El estado es obligatorio",
    })
    .min(3, "El estado debe tener al menos 3 caracteres")
    .trim()
    .min(1, "El estado no puede estar vacío"),
});
