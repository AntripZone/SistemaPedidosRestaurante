import express from "express";
import clientesRouter from "./routes/clientes.routes.js";

const app = express();
const PORT = 3000;

// Permite que Express lea JSON enviado en el body
app.use(express.json());

// Conectamos las rutas de clientes
app.use("/clientes", clientesRouter);

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});