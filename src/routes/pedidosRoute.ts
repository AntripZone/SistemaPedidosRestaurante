import { Router } from "express";
import type { Request, Response } from "express";

import {
    getPedidos,
} from "../controllers/pedidosControllers.js";

const router = Router();

router.get("/",
    getPedidos);

export default router;