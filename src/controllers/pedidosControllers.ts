import { pool } from "../config/db.js";
import type { Request, Response } from "express";

async function getPedidos(req:Request, res: Response) {
    try{
        const result = await pool.query("SELECT * FROM pedidos;");
        res.json({
            message: "Conexion exitosa a la base de datos",
            total: result.rowCount,
            data: result.rows,
        });
    }catch(error){
        console.error("Error al consultar PostgreSQL: ");
        res.status(500).json({
            message: "Error al conectar al Base de Datos.",
        })
    }
    
}