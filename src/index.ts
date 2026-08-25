import express from "express";
<<<<<<< HEAD
import clientesRouter from "./routes/clientes.routes.js";
=======
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import { cargarData } from "./data/data.js";
import pedidosRoute from "./routes/pedidosRoute";
import clientesRoute from "./routes/clientes.routes.js";
import productosRoute from "./routes/productos.routes.js";
import repartidoresRoutes from "./routes/repartidoresRoutes.js";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
>>>>>>> main

const app = express();
const PORT = 3000;

<<<<<<< HEAD
// Permite que Express lea JSON enviado en el body
app.use(express.json());

// Conectamos las rutas de clientes
app.use("/clientes", clientesRouter);

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
=======
app.use(cors());
app.use(express.json());

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

app.use("/pedido", pedidosRoute);
app.use("/clientes", clientesRoute);
app.use("/productos", productosRoute);
app.use("/repartidores", repartidoresRoutes);
app.listen(PORT, async () => {
  await cargarData();
  console.log(`servidor corriendo en el puerto : http://localhost:${PORT}`);
>>>>>>> main
});