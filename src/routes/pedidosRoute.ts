import { Router } from "express";
import type { Request, Response } from "express";

import { listaPedidos, setListaPedidos } from "../data/data.js";

import type {
    pedidos,
    crearPedido,
    actualizarPedido,
    pedidosFiltrados,
    idParam,
} from "../types/pedidos.js";

const router = Router();

router.get("/",
    function (req: Request<{}, {}, {}, pedidosFiltrados>, res: Response) {
        const {estado} = req.query;
        let resultado = [...listaPedidos];

        if(estado) {
            resultado = resultado.filter(
                (e) => e.estado.toLowerCase() === estado.toLowerCase(),
            );
        }
      return res.json({
      total: resultado.length,
      datos: resultado,
    });
    }
)

export default router;