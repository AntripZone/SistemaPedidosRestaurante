import { z } from "zod";

export const repartidorSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").trim(),
  vehiculo: z.enum(["moto", "bicicleta", "auto"], {
    message:"El vehículo debe ser 'moto', 'bicicleta' o 'auto'",
  }),
  activo: z.boolean().default(true),
});

export const actualizarRepartidorSchema = repartidorSchema.partial();

export type RepartidorInput = z.infer<typeof repartidorSchema>;
export type ActualizarRepartidorInput = z.infer<typeof actualizarRepartidorSchema>;