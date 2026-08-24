import { pool } from "../config/db.js";
import type { Request, Response } from "express";

export async function getPedidos(req:Request, res: Response) {
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
        });
    }  
}

export async function getPedidosId(req: Request, res: Response) {
    try{
        const id = Number(req.params.id);
        if(isNaN(id)){
            res.status(400).json({error: "El id debe ser un valor numerico"});
        }
        const resu = await pool.query("SELECT * FROM pedidos WHERE id = $1", [id]);
        if(resu.rows.length === 0){
            res.status(404).json({error: "Pedido no encontrado"});
            return;
        }
        res.json(resu.rows[0]);
    }catch(error: any){
        res.status(500).json({error: error.message});
    }
}