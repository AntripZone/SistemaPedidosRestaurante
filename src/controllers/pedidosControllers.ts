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

export async function postPedidos(req: Request, res: Response) {
    try{
        const {fecha, estado, total} = req.body;
        if(!fecha || !estado || !total) res.status(400).json({error: "Faltan datos"});
        
        const query = "INSER INTO pedidos (fecha, estado, total) VALUES ($1, $2, $3) RETURNING *;";
        const result = await pool.query(query, [fecha, estado, total]);

        res.status(201).json(result.rows[0]);
    }catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export async function putPedidos(req: Request, res: Response) {
    try{
        const idBuscado = Number (req.params.id);
        if (isNaN(idBuscado)) res.status(400).json({error: "El Id debe ser un valor numerico"});

        const resu = await pool.query("SELECT * FROM pedidos WHERE id = $id", [idBuscado]);
        if(resu.rows.length === 0){
            res.status(404).json({error: "Pedido no encontrado"});
            return;
        }
        const {fecha, estado, total} = req.body;
        if(!fecha || !estado || !total){
            res.status(400).json({error: "Faltan datos obligatorios"});
        }
        const query = `UPDATE pedidos
                        SET fecha = $1,
                        estado = $2,
                        precio = $3
                        WHERE id = $4
                        RETURNING *;`;
        const result = await pool.query(query, [fecha, estado, total, idBuscado]);
        res.status(202).json(result.rows[0]);
    }catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export async function deletePedidos(req: Request, res: Response) {
    try {
        const idBuscado = Number(req.params.id);
        if(isNaN(idBuscado)) res.status(400).json({error: "El Id debe ser un valor numerico"});

        const resu = await pool.query("DELETE FROM pedidos WHERE id = $1;", [idBuscado]);
        res.status(200).json({message: "Pedido Eliminado"});
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
}