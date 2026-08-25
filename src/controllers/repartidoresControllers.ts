import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import type {Repartidor} from "../typesRepartidores/repartidores.types.js"

// GET repartidores
export const getRepartidores = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.query;

    if (nombre) {
      const result = await pool.query(
        "SELECT * FROM repartidores WHERE nombre ILIKE $1",
        [`%${nombre}%`]
      );
      return res.json(result.rows);
    }

    const result = await pool.query<Repartidor>("SELECT * FROM repartidores");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los repartidores" });
  }
};

// GET repartidores id
export const getRepartidorById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query<Repartidor>("SELECT * FROM repartidores WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Repartidor no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el repartidor" });
  }
};

// POST repartidores
export const createRepartidor = async (req: Request, res: Response) => {
  /* #swagger.tags = ['Repartidores']
     #swagger.description = 'Registra a un nuevo repartidor'
     #swagger.parameters['obj'] = {
         in:'body',
         description: 'Datos del nuevo repartidor',
         required: true,
         schema: {nombre: 'Felipe Arroyo', vehiculo: 'Moto', activo: true}
     }
     #swagger.responses[201] = {description: 'Repartidor creado exitosamente'}
     #swagger.responses[400] = {descripcion: 'Datos invalidos o faltantes'} */
  try {
    const { nombre, vehiculo, activo = true } = req.body;

    const result = await pool.query(
      "INSERT INTO repartidores (nombre, vehiculo, activo) VALUES ($1, $2, $3) RETURNING *",
      [nombre, vehiculo, activo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el repartidor" });
  }
};

// PUT repartidores id
export const updateRepartidor = async (req: Request, res: Response) => {
  /* #swagger.tags = ['Repartidores']
     #swagger.description = 'Actualiza los datos del repartidor'
     #swagger.parameters['id'] = {description: 'ID numerico del repartidor'}
     #swagger.parameters['obj'] = {
         in: 'body',
         description: 'Datos a actualizar',
         schema: {nombre: 'Felipe Arroyo', vehiculo: 'Auto', activo: false}
     }
     #swagger.responses[200] = {descripcion: 'Repartidor actualizado'}
     #swagger.responses[404] = {descripcion: 'Repartidor no encontrado'} */
  try {
    const id = Number(req.params.id);
    const { nombre, vehiculo, activo } = req.body;

    const result = await pool.query(
      `UPDATE repartidores 
       SET nombre = COALESCE($1, nombre), 
           vehiculo = COALESCE($2, vehiculo), 
           activo = COALESCE($3, activo) 
       WHERE id = $4 RETURNING *`,
      [nombre, vehiculo, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el repartidor" });
  }
};

// DELETE repartidores id
export const deleteRepartidor = async (req: Request, res: Response) => {
  /* #swagger.tags = ['Repartidores']
     #swagger.description = 'Elimina un repartidor del sistema'
     #swagger.parameters['id'] = {description: 'ID numerico del repartidor'}
     #swagger.responses[200] = {descripcion: 'Repartidor eliminado'}
     #swagger.responses[404] = {descripcion: 'Repartidor no encontrado'} */
  try {
    const id = Number(req.params.id);
    const result = await pool.query("DELETE FROM repartidores WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    res.json({ mensaje: "Repartidor eliminado del sistema" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el repartidor" });
  }
};