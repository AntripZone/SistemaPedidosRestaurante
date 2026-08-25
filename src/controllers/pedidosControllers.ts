import { PedidosModel } from "../models/pedidosModel.js";
import type { Request, Response } from "express";

export async function getPedidos(req:Request, res: Response) {
      /* #swagger.tags = ['Pedidos']
     #swagger.description = 'Lista todos los pedidos'
     #swagger.responses[201] = {description: 'Repartidor creado exitosamente'}
     #swagger.responses[400] = {descripcion: 'Datos invalidos o faltantes'} */
    try{
        const pedidos = await PedidosModel.findAll();
        res.json({totalPedidos: pedidos.length, data:pedidos});
    }catch(error){
       console.error("Error al obtener pedidos:", error);
        res.status(500).json({
            message: "Error al conectar al Base de Datos.",
        });
    }
}

export async function getPedidosId(req: Request, res: Response) {
      /*
    #swagger.tags = ['Pedidos']
    #swagger.description = 'Trae dato de un pedido'
    #swagger.parameters['id'] = {description: 'Id del pedido'}

     #swagger.responses[201] = {description: 'Repartidor creado exitosamente'}
     #swagger.responses[400] = {descripcion: 'Datos invalidos o faltantes'} */
    try{
        const id = Number(req.params.id);
        if(isNaN(id)){
            res.status(400).json({error: "El id debe ser un valor numerico"});
            return;
        }
        const pedidos = await PedidosModel.findById(id);
        if(!pedidos){
            res.status(404).json({error: "Pedido no encontrado"});
            return;
        }
        res.json({data: pedidos});
    }catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export async function postPedidos(req: Request, res: Response) {
     /*
      #swagger.tags = ['Pedidos']
      #swagger.description = 'Ingresa un nuevo pedido'
    */
    try{
        const {fecha, estado, total} = req.body;
        if(!fecha || !estado || !total){
            res.status(400).json({error: "Faltan datos"});
        }
        const nuevoPedido = await PedidosModel.create({fecha, estado, total});
        res.status(201).json({data: nuevoPedido});
    }catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export async function putPedidos(req: Request, res: Response) {
     /*
    #swagger.tags = ['Pedidos']
    #swagger.description = 'Actualiza el estado de un pedido'
    #swagger.parameters['id'] = {description: 'ID numérico del pedido'}
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Nuevo estado',
        schema: {estado: 'entregado'}
    }
  */
    try{
        const idBuscado = Number (req.params.id);
        if (isNaN(idBuscado)) res.status(400).json({error: "El Id debe ser un valor numerico"});

        const pedidoUpdate = await PedidosModel.update(idBuscado, req.body);
        if(!pedidoUpdate){
            res.status(404).json({error: "Pedido no encontrado"});
            return;
        }
        res.status(202).json({data: pedidoUpdate});
    }catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export async function deletePedidos(req: Request, res: Response) {
    /*
    #swagger.tags = ['Pedidos']
    #swagger.description = 'Actualiza el estado de un pedido'
    #swagger.parameters['id'] = {description: 'ID numérico del pedido'}
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Nuevo estado',
        schema: {estado: 'entregado'}
    }
  */
    try {
        const idBuscado = Number(req.params.id);
        if(isNaN(idBuscado)) res.status(400).json({error: "El Id debe ser un valor numerico"});

        const resu = await pool.query("DELETE FROM pedidos WHERE id = $1;", [idBuscado]);
        res.status(200).json({message: "Pedido Eliminado"});
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
}