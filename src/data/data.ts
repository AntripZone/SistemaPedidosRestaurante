import fs from "node:fs/promises";
import path from "node:path";

export let productos: any[] = [];

export async function cargarData() {
  const ruta = path.resolve("src/data/productos.json");

  const data = await fs.readFile(ruta, "utf-8");

  productos = JSON.parse(data);

  console.log(`Productos cargados: ${productos.length}`);
}