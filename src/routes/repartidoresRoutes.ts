import { Router } from "express";
import {
  getRepartidores,
  getRepartidorById,
  createRepartidor,
  updateRepartidor,
  deleteRepartidor, 
} from "../controllers/repartidoresControllers.js";

const router = Router();

router.get("/", getRepartidores);
router.get("/:id", getRepartidorById);
router.post("/", createRepartidor);
router.put("/:id", updateRepartidor);
router.delete("/:id", deleteRepartidor);

export default router;