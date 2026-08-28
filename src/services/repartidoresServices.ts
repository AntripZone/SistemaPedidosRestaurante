import { RepartidorModel } from "../models/repartidoresModel.js";
import type { Repartidor } from "../models/repartidoresModel.js";
import type {
  RepartidorInput,
  ActualizarRepartidorInput,
} from "../schemas/repartidoresSchema.js";

export const repartidoresService = {
  createRepartidor: async function (
    data: RepartidorInput
  ): Promise<Repartidor> {
    const cleanName = data.nombre.trim();

    const todos = await RepartidorModel.findAll();
    const repartidorExist = todos.find(
      (r) => r.nombre.toLowerCase() === cleanName.toLowerCase()
    );

    if (repartidorExist) {
      throw new Error("EL REPARTIDOR YA EXISTE!!!");
    }

    return await RepartidorModel.create({
      nombre: cleanName,
      vehiculo: data.vehiculo,
      activo: data.activo,
    });
  },

  getRepartidores: async function (): Promise<Repartidor[]> {
    return await RepartidorModel.findAll();
  },

  getRepartidorById: async function (
    id: number
  ): Promise<Repartidor | null> {
    return await RepartidorModel.findById(id);
  },

  updateRepartidor: async function (
    id: number,
    data: ActualizarRepartidorInput
  ): Promise<Repartidor | null> {
    
    const cleanData: Parameters<typeof RepartidorModel.update>[1] = {};

    if (data.nombre !== undefined) {
      cleanData.nombre = data.nombre.trim();
    }
    if (data.vehiculo !== undefined) {
      cleanData.vehiculo = data.vehiculo;
    }
    if (data.activo !== undefined) {
      cleanData.activo = data.activo;
    }

    return await RepartidorModel.update(id, cleanData);
  },

  deleteRepartidor: async function (
    id: number
  ): Promise<boolean> {
    return await RepartidorModel.delete(id);
  },
};