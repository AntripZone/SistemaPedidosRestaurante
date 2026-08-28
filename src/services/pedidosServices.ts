import { PedidosModel } from "../models/pedidosModel.js";
import type { pedidoQueryParams } from "../schemas/pedidosSchema.js";
import type { paginaResult, Pedidos } from "../models/pedidosModel.js";

export const pedidosService = {
  createPedido: async function (
    cliente_id: number,
    total: number,
    id_repartidor?: number | null,
  ): Promise<Pedidos> {
    // limpiar espacios vacios al final e inicio del nombre y categoria
    const cleanTotal = Number.isFinite(total) ? total : 0;

    //evitar q existan 2 productos q tengan el mismo nombre
    /*const prodcutExist = await ProductModel.findByName(nombre);
    if (prodcutExist) {
      throw new Error("EL PRODUCTO YA EXISTE!!!");
    }*/
    return await PedidosModel.create({ cliente_id, total, id_repartidor: id_repartidor ?? null });
  },
  getPedidosFilters: async (
    query: pedidoQueryParams,
  ): Promise<paginaResult<[Pedidos]>> => {
    let page = 1;
    let limit = 10;
    if (query.page) {
      page = Number(query.page);
    }
    if (query.limit) {
      limit = Number(query.limit);
    }
    const search = query.search?.trim();
    const estado = query.estado ? String(query.estado) : undefined;

    return await PedidosModel.findWhitFilter(
      page,
      limit,
      search,
      estado,
    );
  },
};
