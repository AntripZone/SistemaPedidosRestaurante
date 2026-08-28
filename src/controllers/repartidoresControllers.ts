import type { Request, Response } from "express";
import { repartidoresService } from "../services/repartidoresServices.js";

export async function getRepartidores(req: Request, res: Response) {
   /* #swagger.tags = ['Repartidores']
     #swagger.description = 'Lista todos los repartidores'
  */
  try {
    const repartidores = await repartidoresService.getRepartidores();
    res.json({ totalRepartidores: repartidores.length, data: repartidores });
  } catch (error: any) {
    console.error("Error al consultar PostgreSQL:", error);
    res.status(500).json({
      message: "Error al intentar conectar a la base de datos :c",
    });
  }
}

export async function getRepartidorById(req: Request, res: Response) {
  /* #swagger.tags = ['Repartidores']
     #swagger.description = 'Lista todos los repartidores por id'
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID debe ser numérico" });
      return;
    }
    const repartidor = await repartidoresService.getRepartidorById(id);
    if (!repartidor) {
      res.status(404).json({ error: "Repartidor no encontrado" });
      return;
    }
    res.json({ data: repartidor });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function postRepartidor(req: Request, res: Response) {
   /* #swagger.tags = ['Repartidores']
     #swagger.description = 'Crea un nuevo repartidor'
     #swagger.parameters['estado'] = {in: 'query', description: 'Estado del pedido', type: 'boolean'}
  */
  try {
    const newRepartidor = await repartidoresService.createRepartidor(req.body);
    res.status(201).json({ data: newRepartidor });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function putRepartidor(req: Request, res: Response) {
   /* #swagger.tags = ['Repartidores']
     #swagger.description = 'Actualiza un repartidor por id'
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID debe ser un valor numérico" });
      return;
    }
    const repartidorUpdate = await repartidoresService.updateRepartidor(id, req.body);
    if (!repartidorUpdate) {
      res.status(404).json({ error: "Repartidor no encontrado" });
      return;
    }
    res.json({ data: repartidorUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteRepartidor(req: Request, res: Response) {
  /* #swagger.tags = ['Repartidores']
     #swagger.description = 'Elimina un repartidor por id'
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID debe ser un valor numérico" });
      return;
    }
    const repartidorEliminado = await repartidoresService.deleteRepartidor(id);
    if (repartidorEliminado) {
      res.status(200).json({ message: "Repartidor eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Repartidor no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}