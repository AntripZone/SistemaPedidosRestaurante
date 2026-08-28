import { Router } from "express";
import {
  getRepartidores,
  getRepartidorById,
  postRepartidor,
  putRepartidor,
  deleteRepartidor, 
} from "../controllers/repartidoresControllers.js";
import { validateSchema } from "../middleware/validadorMidleware.js";
import {
  repartidorSchema,
  actualizarRepartidorSchema,
} from "../schemas/repartidoresSchema.js"

const router: Router = Router();

router.get("/", getRepartidores);
router.get("/:id", getRepartidorById);

router.post("/", validateSchema(repartidorSchema), postRepartidor);
router.put("/:id", validateSchema(actualizarRepartidorSchema), putRepartidor);
router.delete("/:id", deleteRepartidor);

export default router;
