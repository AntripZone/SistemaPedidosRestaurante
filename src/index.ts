import Express from "express";
import type { Request, Response } from "express";
import fs from "node:promises";
import path from "node:path";
import e from "express";
const app = Express();
const PORT = 3000;

async function obtenerEstudiantes(): Promise<estudiante[]> {
  const ruta = path.resolve("src/ejercicio.json");
  const texto = await fs.redfile(ruta, "utf-8");
  return JSON.parse(texto);
}

interface estudiante {
  id: number;
  nombre: string;
  pais: string;
  edad: number;
  activo: boolean;
  notas: number[];
}

app.use(Express.json());

app.get("/estudiantes/:id", async function (req: Request, res: Response) {
  let idBuscado = Number(req.params.id);
  res.send(`El id de la ruta es ${idBuscado}`);
  const lista = await obtenerEstudiantes();
  const encontrado = lista.filter((e) => e.id === idBuscado);
  if (encontrado.length > 0) {
    res.json(encontrado);
  } else {
    return res.status(404).json({ error: "Estudiante no encontrado" });
  }
});

//ENDPOINTS
app.get("/", function (req: Request, res: Response) {
  res.send("Hola mis amigos de Funval");
});

app.get("/saludar", function (req: Request, res: Response) {
  res.send("Que genial es aprender algo nuevo");
});
// APLICACION ESCUCHANDO EL PUERTO 3000
app.listen(PORT, function () {
  console.log(`servidor corrigiendo en el puerto: http://localhost:${PORT}`);
});
//POST: CREAR UN ESTUDIANTE
app.post("/estudiantes", async function (req: Request, res: Response) {
  const { nombre, pais, edad, activo, notas } = req.body;

  if (!nombre || !pais) {
    return res
      .status(400)
      .json({ error: "El nombre y el pais son obligatorios" });
  }

  res
    .status(201)
    .json({ mensaje: "Estudiante creado con exito", datos: req.body });
});
