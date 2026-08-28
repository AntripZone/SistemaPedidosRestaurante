import { PedidosModel } from "../models/pedidosModel.js";
import type { Request, Response, NextFunction, Router } from "express";
import {
  createPedidosSchema,
  updatePedidosSchema,
} from "../schemas/pedidosSchema.js";
import { pedidosService} from "../services/pedidosServices.js";

export async function getPedidos(req:Request, res: Response) {
      /* #swagger.tags = ['Pedidos']
     #swagger.description = 'Lista todos los pedidos'
     #swagger.parameters['estado'] = {in: 'query', description: 'Estado del pedido', type: 'string'}
     #swagger.responses[201] = {description: 'Repartidor creado exitosamente'}
     #swagger.responses[400] = {descripcion: 'Datos invalidos o faltantes'} */
    try{
        const pedidos = await pedidosService.getPedidosFilters(req.query);
        res.json(pedidos);
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

export async function getPedidosPorCliente(req: Request, res: Response, next: NextFunction) {
          /*
    #swagger.tags = ['Pedidos']
    #swagger.description = 'Trae la lista pedido por cliente'
    #swagger.parameters['clienteId'] = {description: 'Id del cliente'}

     #swagger.responses[201] = {description: 'Repartidor creado exitosamente'}
     #swagger.responses[400] = {descripcion: 'Datos invalidos o faltantes'} */
  try {
    const clienteId = Number(req.params.clienteId);
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      return res.status(400).json({ mensaje: "clienteId inválido" });
    }
    const pedidos = await PedidosModel.findByClienteId(clienteId);
    res.json(pedidos);
  } catch (err) {
    next(err);
  }
}

export async function postPedidos(req: Request, res: Response) {
     /*
      #swagger.tags = ['Pedidos']
      #swagger.description = 'Ingresa un nuevo pedido, id_repartidor es opcional'
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
        cliente_id: 1,
        total: 45.50,
        id_repartidor: 2
        }
    }
    */
    try{
        // req.body ya viene validado por el middleware validateSchema(createPedidoSchema)
    const nuevoPedido = createPedidosSchema.safeParse(req.body);
    console.log(nuevoPedido);
    if (!nuevoPedido.success) return res.status(400).json({ error: nuevoPedido.error.issues });
    const { cliente_id, total, id_repartidor } = nuevoPedido.data;
      const newPedido = await pedidosService.createPedido(
      cliente_id,
      total,
      id_repartidor,
    );
        res.status(201).json({data: newPedido});
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
        if (isNaN(idBuscado)) {
            res.status(400).json({error: "El Id debe ser un valor numerico"});
            return;
        }
        const result = updatePedidosSchema.safeParse(req.body);

        if (!result.success) {
        res.status(400).json({ error: result.error.issues });
        return;
        }

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
    #swagger.description = 'Elimina un pedido'
    #swagger.parameters['id'] = {description: 'ID numérico del pedido'}
  */
    try {
        const idBuscado = Number(req.params.id);
        if(isNaN(idBuscado)) res.status(400).json({error: "El Id debe ser un valor numerico"});

        const pedidoEliminado = await PedidosModel.delete(idBuscado);
        res.status(200).json({message: "Pedido Eliminado"});
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
}