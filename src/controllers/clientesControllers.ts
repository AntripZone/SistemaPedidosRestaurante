import type { Request, Response } from "express";
import {
  ClienteModel,
  type CreateClienteInput,
  type UpdateClienteInput,
} from "../models/clientesModel.js";
import { clienteService } from "../services/clientesServices.js";


export const getClientes = async (
  req: Request,
  res: Response
) => {
  try {
    const resultado = await clienteService.getClientesFilters(req.query);

    return res.status(200).json(resultado);

  } catch (error: any) {
    console.error("Error al obtener clientes:", error.message);

    return res.status(500).json({
      error: "Error al consultar los clientes",
    });
  }
};



export const getClienteById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser numérico",
      });
    }

    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    return res.status(200).json(cliente);

  } catch (error: any) {
    console.error("Error al obtener cliente:", error.message);

    return res.status(500).json({
      error: "Error al consultar el cliente",
    });
  }
};


export const createCliente = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      nombres,
      apellidos,
      telefono,
      direccion,
      email,
      ciudad,
    } = req.body;

    if (!nombres || !telefono || !direccion || !ciudad) {
      return res.status(400).json({
        error: "nombres, telefono, direccion y ciudad son obligatorios",
      });
    }

    const nuevoCliente: CreateClienteInput = {
      nombres,
      apellidos,
      telefono,
      direccion,
      email,
      ciudad,
    };

    const cliente = await clienteService.createCliente(
      nombres,
      apellidos,
      telefono,
      direccion,
      email,
      ciudad
    );

    return res.status(201).json({
      mensaje: "Cliente creado correctamente",
      cliente,
    });

  } catch (error: any) {
    console.error("Error al crear cliente:", error.message);

    return res.status(500).json({
      error: "Error al crear el cliente",
    });
  }
};


export const updateCliente = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser numérico",
      });
    }

    const clienteExistente = await ClienteModel.findById(id);

    if (!clienteExistente) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    const { telefono, direccion } = req.body;

    if (!telefono && !direccion) {
      return res.status(400).json({
        error: "Debe enviar telefono o direccion para actualizar",
      });
    }

    if (
      telefono !== undefined &&
      typeof telefono !== "string"
    ) {
      return res.status(400).json({
        error: "El telefono debe ser de tipo texto",
      });
    }

    if (
      direccion !== undefined &&
      typeof direccion !== "string"
    ) {
      return res.status(400).json({
        error: "La direccion debe ser de tipo texto",
      });
    }

    const datosActualizar: UpdateClienteInput = {
      telefono,
      direccion,
    };

    const cliente = await ClienteModel.update(
      id,
      datosActualizar
    );

    return res.status(200).json({
      mensaje: "Cliente actualizado correctamente",
      cliente,
    });

  } catch (error: any) {
    console.error("Error al actualizar cliente:", error.message);

    return res.status(500).json({
      error: "Error al actualizar el cliente",
    });
  }
};


export const deleteCliente = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser numérico",
      });
    }

    const eliminado = await ClienteModel.delete(id);

    if (!eliminado) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    return res.status(200).json({
      mensaje: "Cliente eliminado correctamente",
    });

  } catch (error: any) {
    console.error("Error al eliminar cliente:", error.message);

    return res.status(500).json({
      error: "Error al eliminar el cliente",
    });
  }
};