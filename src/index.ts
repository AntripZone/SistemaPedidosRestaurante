import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {pool} from "./config/db.js";
import PedidosRoute from "./routes/pedidosRoute.js";
import type { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;;

app.use(cors());
app.use(express.json());

app.use("/pedidos", PedidosRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

const swaggerFilePath = path.resolve("./src/swagger-output.json");
if (fs.existsSync(swaggerFilePath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
  // Host/scheme relativos: funciona en localhost y detras de un dev tunnel https
  delete swaggerDocument.host;
  delete swaggerDocument.schemes;
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("archivo swagger-output.json no encontrado");
}

app.get("/", function (req: Request, res: Response) {
  res.json({
    message: "servidor corriendo exitosamente",
  });
});

app.listen(PORT, async function () {
  console.log("servidor corriendo en http://localhost:" + PORT);
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(
      `CONECTADO A POSTGRESQL CON EXITO HORA DEL SERVIDOR ${res.rows[0].now}`,
    );
  } catch (error) {
    console.log("ERROR EN LA CONEXION");
  }
});
