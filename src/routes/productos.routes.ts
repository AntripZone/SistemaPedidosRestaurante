import { Router } from "express";

import {
  getProducts,
  getProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productos.controller.js";

const router: Router = Router();

router.get("/", getProducts);

router.get("/:id", getProductoPorId);

router.post("/", crearProducto);

router.put("/:id", actualizarProducto);

router.delete("/:id", eliminarProducto);

export default router;
