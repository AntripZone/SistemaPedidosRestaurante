import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import productosRoutes from "./routes/productos.routes.js";

const app = express();

app.use(express.json());

app.use("/productos", productosRoutes);

app.get("/", (req, res) => {
  res.json({
    mensaje: "API Sistema de Pedidos Restaurante",
  });
});

const swaggerDocument = JSON.parse(
  fs.readFileSync("./src/swagger-output.json", "utf-8"),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
