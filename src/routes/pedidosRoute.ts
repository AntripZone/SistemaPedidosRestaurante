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
);

router.get("/:id", 
    function (req: Request<idParam>, res: Response) {
  const idBuscado = Number(req.params.id);

  if (isNaN(idBuscado)) {
    return res
      .status(400)
      .json({ error: "El parametro id debe ser un numero valido" });
  }
  const pedidoFiltrado = listaPedidos.find(
    (p) => p.id === idBuscado,
  );

  if (!pedidoFiltrado) {
    return res
      .status(404)
      .json({ error: "no existe un pedido con ese ID" });
  }
  return res.status(200).json(pedidoFiltrado);
});

router.post("/",
  function (req: Request<{}, {}, crearPedido>, res: Response) {
    const { clienteId, total } = req.body;
    if (!clienteId || !total ) {
      return res.status(400).json({ error: "faltan datos que son obligatorios" });
    }
    const nuevoPedido: pedidos = {
      id:
        listaPedidos.length > 0
          ? listaPedidos.length + 1
          : 1,
      clienteId,
      fecha:  new Date().toLocaleDateString("es-PE"),
      total,
      estado: "Preparando",
    };
    listaPedidos.push(nuevoPedido);
    res.status(201).json(nuevoPedido);
  });

router.put("/:id", function (req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const index = listaPedidos.findIndex(function (p) {
    return p.id === idBuscado;
  });
  if (index === -1) {
    return res.status(404).json({ error: "Pedido no encontrado." });
  } else {
    const { estado }: actualizarPedido = req.body;
  }
});
    /*listaPedidos[index] = {
      id: idBuscado,
      estado: estado ?? listaPedidos[index]?.estado
    };
    res.json(listaPedidos[index]);
  }
});*/

export default router;