import express from "express";
import swaggerUi from "swagger-ui-express";
import repartidoresRouter from "./routes/repartidores.routes.js";

import swaggerDocument from "../swagger-output.json" with { type: "json" };

const app = express();
app.use(express.json());

app.use("/repartidores", repartidoresRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
