import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {

    try {

        const ciudad = req.query.ciudad;

        if (ciudad && typeof ciudad === "string") {

            const result = await pool.query(

                "SELECT * FROM clientes WHERE ciudad = $1",

                [ciudad]

            );

            return res.status(200).json(result.rows);

        }

        const result = await pool.query(

            "SELECT * FROM clientes"

        );

        return res.status(200).json(result.rows);

    } catch (error: any) {

        console.error("Error al consultar clientes:", error.message);

        return res.status(500).json({

            error: error.message

        });

    }

});

 

// GET /clientes/:id

// Busca un cliente específico mediante su ID

router.get("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({

                mensaje: "El ID debe ser numérico"

            });

        }

        const result = await pool.query(

            "SELECT * FROM clientes WHERE id = $1",

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                mensaje: "Cliente no encontrado"

            });

        }

        return res.status(200).json(result.rows[0]);

    } catch (error: any) {

        console.error("Error al consultar cliente:", error.message);

        return res.status(500).json({

            error: error.message

        });

    }

});

 

// POST /clientes

// Registra un nuevo cliente

router.post("/", async (req, res) => {

    try {

        const {

            nombre,

            telefono,

            direccion,

            ciudad

        } = req.body;

        if (!nombre || !telefono || !direccion || !ciudad) {

            return res.status(400).json({

                mensaje: "nombre, telefono, direccion y ciudad son obligatorios"

            });

        }

        const query = `

            INSERT INTO clientes

            (nombre, telefono, direccion, ciudad)

            VALUES ($1, $2, $3, $4)

            RETURNING *;

        `;

        const result = await pool.query(query, [

            nombre,

            telefono,

            direccion,

            ciudad

        ]);

        return res.status(201).json({

            mensaje: "Cliente creado correctamente",

            cliente: result.rows[0]

        });

    } catch (error: any) {

        console.error("Error al crear cliente:", error.message);

        return res.status(500).json({

            error: error.message

        });

    }

});

 

// PUT /clientes/:id

// Actualiza teléfono o dirección

router.put("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({

                mensaje: "El ID debe ser numérico"

            });

        }

        const cliente = await pool.query(

            "SELECT * FROM clientes WHERE id = $1",

            [id]

        );

        if (cliente.rows.length === 0) {

            return res.status(404).json({

                mensaje: "Cliente no encontrado"

            });

        }

        const { telefono, direccion } = req.body;

        if (!telefono && !direccion) {

            return res.status(400).json({

                mensaje: "Debe enviar telefono o direccion para actualizar"

            });

        }

        if (telefono !== undefined && typeof telefono !== "string") {

            return res.status(400).json({

                mensaje: "El telefono debe ser de tipo texto"

            });

        }

        if (direccion !== undefined && typeof direccion !== "string") {

            return res.status(400).json({

                mensaje: "La direccion debe ser de tipo texto"

            });

        }

        const query = `

            UPDATE clientes

            SET telefono = COALESCE($1, telefono),

                direccion = COALESCE($2, direccion)

            WHERE id = $3

            RETURNING *;

        `;

        const result = await pool.query(query, [

            telefono,

            direccion,

            id

        ]);

        return res.status(200).json({

            mensaje: "Cliente actualizado correctamente",

            cliente: result.rows[0]

        });

    } catch (error: any) {

        console.error("Error al actualizar cliente:", error.message);

        return res.status(500).json({

            error: error.message

        });

    }

});

 

// DELETE /clientes/:id

// Elimina un cliente

router.delete("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({

                mensaje: "El ID debe ser numérico"

            });

        }

        const result = await pool.query(

            "DELETE FROM clientes WHERE id = $1 RETURNING *",

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                mensaje: "Cliente no encontrado"

            });

        }

        return res.status(200).json({

            mensaje: "Cliente eliminado correctamente",

            cliente: result.rows[0]

        });

    } catch (error: any) {

        console.error("Error al eliminar cliente:", error.message);

        return res.status(500).json({

            error: error.message

        });

    }

});
export default router;