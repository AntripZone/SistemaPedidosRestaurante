import { ClienteModel } from "../models/clientesModel.js";
import type { clienteQueryParams } from "../schemas/clientesSchema.js";
import type { Cliente, PaginaResult } from "../models/clientesModel.js";

export const clienteService = {

  createCliente: async function (
    nombres: string,
    apellidos: string,
    telefono: string,
    direccion: string,
    email: string,
    ciudad: string
  ): Promise<Cliente> {

    const cleanNombres = nombres.trim();
    const cleanApellidos = apellidos.trim();
    const cleanCiudad = ciudad.trim();

    return await ClienteModel.create({
      nombres: cleanNombres,
      apellidos: cleanApellidos,
      telefono,
      direccion,
      email,
      ciudad: cleanCiudad
    });
  },

  getClientesFilters: async (
    query: clienteQueryParams
  ): Promise<PaginaResult<Cliente>> => {

    let page = 1;
    let limit = 2;

    if (query.page) {
      page = Number(query.page);
    }

    if (query.limit) {
      limit = Number(query.limit);
    }

    const search = query.search?.trim();
    const ciudad = query.ciudad?.trim();

    return await ClienteModel.findWithFilter(
      page,
      limit,
      search,
      ciudad
    );
  }
};