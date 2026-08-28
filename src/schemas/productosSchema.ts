import { z } from "zod";

export const createProductoSchema = z.object({
  nombre: z
    .string({
      message: "El nombre debe ser obligatorio",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .trim()
    .min(1),

  precio: z
    .number({
      message: "El precio debe ser obligatorio",
    })
    .positive("El precio debe ser mayor a 0"),

  categoria: z
    .string({
      message: "La categoría debe ser obligatoria",
    })
    .min(3, "La categoría debe tener al menos 3 caracteres")
    .trim()
    .min(1),

  disponible: z.boolean({
  message: "La disponibilidad debe ser verdadero o falso",
}),
});

export const updateProductoSchema = createProductoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

