import { Router } from "express";
import {
    getPedidos,
    getPedidosId,
    postPedidos,
    putPedidos,
    deletePedidos } from "../controllers/pedidosControllers.js";
import { validateSchema } from "../middleware/validadorMidleware.js";
import { createPedidosSchema, updatePedidosSchema } from "../schemas/pedidosSchema.js";

const router = Router();

router.get("/",
    getPedidos);
router.get("/:id", getPedidosId);
router.post("/", postPedidos);
router.put("/:id", putPedidos);
router.delete("/:id", deletePedidos);

export default router;