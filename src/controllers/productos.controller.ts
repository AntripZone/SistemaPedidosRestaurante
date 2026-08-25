import type { Request, Response } from "express";
import { pool } from "../config/db.js";


// GET /productos
// Obtener todos los productos
// También permite filtrar por categoría
export async function getProductos( req: Request, res: Response) {
  try {
    const categoria = req.query.categoria;

    let result;

    if (typeof categoria === "string") {
      result = await pool.query(
        "SELECT * FROM productos WHERE categoria = $1 ORDER BY id;",
        [categoria]
      );
    } else {
      result = await pool.query(
        "SELECT * FROM productos ORDER BY id;"
      );
    }

    return res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error al obtener productos:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}


// GET /productos/:id
// Obtener un producto por ID
export async function getProductoPorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico"
      });
    }
    const result = await pool.query(
      "SELECT * FROM productos WHERE id = $1;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error al obtener producto:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}


// POST /productos
// Crear un nuevo producto
export async function crearProducto(req: Request,res: Response) {
  try {
    const {
      nombre,
      categoria,
      precio,
      disponible
    } = req.body;

    if (!nombre || !categoria || precio === undefined || disponible === undefined) {
      return res.status(400).json({
        error: "Nombre, categoria, precio y disponible son obligatorios"
      });
    }

    if (typeof precio !== "number" || precio <= 0) {
      return res.status(400).json({
        error: "El precio debe ser un número mayor a 0"
      });
    }

    const result = await pool.query(
      `INSERT INTO productos (nombre, categoria, precio, disponible)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`,
      [nombre, categoria, precio, disponible]
    );

    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Error al crear producto:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}

// PUT /productos/:id
// Modificar un producto
export async function actualizarProducto( req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico"
      });
    }

    const resultado = await pool.query( "SELECT * FROM productos WHERE id = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    const { nombre, precio, disponible } = req.body;

    if (!nombre || precio === undefined || disponible === undefined) {
      return res.status(400).json({
        error: "Faltan datos obligatorios"
      });
    }

    if (precio <= 0) {
      return res.status(400).json({
        error: "El precio debe ser mayor a 0"
      });
    }

    const result = await pool.query(
      `UPDATE productos
       SET nombre = $1,
           precio = $2,
           disponible = $3
       WHERE id = $4
       RETURNING *;`,
      [nombre, precio, disponible, id]
    );

    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error al actualizar producto:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}
// DELETE /productos/:id
// Eliminar un producto
export async function eliminarProducto( req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico"
      });
    }

    const result = await pool.query(
      "DELETE FROM productos WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    return res.status(200).json({
      mensaje: "Producto eliminado correctamente",
      producto: result.rows[0]
    });

  } catch (error) {
    console.error("Error al eliminar producto:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}
