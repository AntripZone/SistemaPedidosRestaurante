import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import { RepartidorModel } from "../models/repartidoresModel.js"; 

export async function getRepartidores(req: Request, res: Response) {
  try {
    const repartidores = await RepartidorModel.findAll();
    res.json({ totalRepartidores: repartidores.length, data: repartidores });
  } catch (error: any) {
    console.error("Error al consultar PostgreSQL:", error);
    res.status(500).json({
      message: "Error al intentar conectar a la base de datos :c",
    });
  }
}

export async function getRepartidorById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID debe ser numérico" });
      return;
    }
    const repartidor = await RepartidorModel.findById(id);
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
  try {
    const { nombre, vehiculo, activo } = req.body;
    if (!nombre || !vehiculo) {
      res.status(400).json({ error: "Faltan datos obligatorios (nombre, vehiculo)" });
      return;
    }
    const newRepartidor = await RepartidorModel.create({ nombre, vehiculo, activo });
    res.status(201).json({ data: newRepartidor });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function putRepartidor(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID debe ser un valor numérico" });
      return;
    }
    const repartidorUpdate = await RepartidorModel.update(id, req.body);
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
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "El ID debe ser un valor numérico" });
      return;
    }
    const repartidorEliminado = await RepartidorModel.delete(id);
    if (repartidorEliminado) {
      res.status(200).json({ message: "Repartidor eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Repartidor no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}