import type { Request, Response, NextFunction } from "express";

export const validateRepartidor = (req: Request, res: Response, next: NextFunction) => {
  const { nombre, vehiculo, telefono, activo } = req.body;

  if (req.method === "POST") {
    if (!nombre || typeof nombre !== "string") {
      return res
        .status(400)
        .json({ error: "El campo 'nombre' es obligatorio y debe ser texto." });
    }
    if (!vehiculo || typeof vehiculo !== "string") {
      return res.status(400).json({
        error: "El campo 'vehiculo' es obligatorio y debe ser texto.",
      });
    }
    if (!telefono || typeof telefono !== "string") {
      return res.status(400).json({
        error: "El campo 'telefono' es obligatorio y debe ser texto.",
      });
    }
    if (activo === undefined || typeof activo !== "boolean") {
      return res.status(400).json({
        error: "El campo 'activo' es obligatorio y debe ser booleano.",
      });
    }
  }

  if (req.method === "PUT") {
    if (nombre !== undefined && typeof nombre !== "string") {
      return res
        .status(400)
        .json({ error: "El campo 'nombre' debe ser texto." });
    }
    if (vehiculo !== undefined && typeof vehiculo !== "string") {
      return res
        .status(400)
        .json({ error: "El campo 'vehiculo' debe ser texto." });
    }
    if (telefono !== undefined && typeof telefono !== "string") {
      return res
        .status(400)
        .json({ error: "El campo 'telefono' debe ser texto." });
    }
    if (activo !== undefined && typeof activo !== "boolean") {
      return res
        .status(400)
        .json({ error: "El campo 'activo' debe ser booleano." });
    }
  }

  next();
};
