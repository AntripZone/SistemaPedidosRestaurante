import type { Request, Response, NextFunction } from "express";

export const validarCliente = (
  req: Request,
  res: Response,
  next: NextFunction
) => {const { nombre, telefono, direccion, ciudad } = req.body;

if (!nombre || !telefono || !direccion || !ciudad) {
  return res.status(400).json({
    mensaje: "Nombre, telefono, direccion y ciudad son obligatorios",
  });
}
if (
  typeof nombre !== "string" ||
  typeof telefono !== "string" ||
  typeof direccion !== "string" ||
  typeof ciudad !== "string"
) {
  return res.status(400).json({
    mensaje: "Todos los campos deben ser de tipo texto",
  });
}
next();
};