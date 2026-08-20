import Express from "express";
import type { Request, Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import e from "express";
const app = Express();
const PORT = 3000;

app.use(Express.json());

interface Producto {
  id: number;
  nombreProducto: string;
  stock: number;
  preocioUnitario: number;
  activo: boolean;
  marca: string;
  categoria: string;
}

let productos = [
  {
    id: 1,
    nombreProducto: "Coca Cola",
    stock: 45,
    precioUnitario: 17,
    activo: true,
    marca: "Coca Cola",
    categoria: "refresquito",
  },
  {
    id: 2,
    nombreProducto: "Pepsi",
    stock: 32,
    precioUnitario: 15,
    activo: true,
    marca: "Pepsi",
    categoria: "refresquito",
  },
  {
    id: 3,
    nombreProducto: "Sprite",
    stock: 28,
    precioUnitario: 16,
    activo: true,
    marca: "Coca Cola",
    categoria: "refresquito",
  },
  {
    id: 4,
    nombreProducto: "Fanta",
    stock: 36,
    precioUnitario: 16,
    activo: true,
    marca: "Coca Cola",
    categoria: "refresquito",
  },
  {
    id: 5,
    nombreProducto: "Agua Mineral",
    stock: 50,
    precioUnitario: 8,
    activo: true,
    marca: "Vital",
    categoria: "agua",
  },
  {
    id: 6,
    nombreProducto: "Jugo de Naranja",
    stock: 24,
    precioUnitario: 12,
    activo: true,
    marca: "Del Valle",
    categoria: "jugos",
  },
  {
    id: 7,
    nombreProducto: "Red Bull",
    stock: 18,
    precioUnitario: 25,
    activo: true,
    marca: "Red Bull",
    categoria: "energizante",
  },
  {
    id: 8,
    nombreProducto: "Gatorade",
    stock: 22,
    precioUnitario: 18,
    activo: true,
    marca: "Gatorade",
    categoria: "isotonica",
  },
  {
    id: 9,
    nombreProducto: "Papas Fritas",
    stock: 40,
    precioUnitario: 10,
    activo: true,
    marca: "Lays",
    categoria: "snacks",
  },
  {
    id: 10,
    nombreProducto: "Doritos",
    stock: 35,
    precioUnitario: 11,
    activo: true,
    marca: "Doritos",
    categoria: "snacks",
  },
  {
    id: 11,
    nombreProducto: "Chizitos",
    stock: 27,
    precioUnitario: 7,
    activo: true,
    marca: "Frito Lay",
    categoria: "snacks",
  },
  {
    id: 12,
    nombreProducto: "Galletas Oreo",
    stock: 31,
    precioUnitario: 9,
    activo: true,
    marca: "Oreo",
    categoria: "galletas",
  },
  {
    id: 13,
    nombreProducto: "Galletas María",
    stock: 29,
    precioUnitario: 6,
    activo: true,
    marca: "Victoria",
    categoria: "galletas",
  },
  {
    id: 14,
    nombreProducto: "Chocolate",
    stock: 20,
    precioUnitario: 14,
    activo: true,
    marca: "Milka",
    categoria: "dulces",
  },
  {
    id: 15,
    nombreProducto: "Caramelo de Menta",
    stock: 60,
    precioUnitario: 2,
    activo: true,
    marca: "Arcor",
    categoria: "dulces",
  },
  {
    id: 16,
    nombreProducto: "Chicle",
    stock: 55,
    precioUnitario: 3,
    activo: true,
    marca: "Trident",
    categoria: "dulces",
  },
  {
    id: 17,
    nombreProducto: "Pan de Molde",
    stock: 15,
    precioUnitario: 18,
    activo: true,
    marca: "Bimbo",
    categoria: "panificados",
  },
  {
    id: 18,
    nombreProducto: "Leche Entera",
    stock: 25,
    precioUnitario: 10,
    activo: true,
    marca: "Pil",
    categoria: "lacteos",
  },
  {
    id: 19,
    nombreProducto: "Yogur de Frutilla",
    stock: 21,
    precioUnitario: 8,
    activo: true,
    marca: "Pil",
    cream: "lacteos",
  },
  {
    id: 20,
    nombreProducto: "Café Instantáneo",
    stock: 17,
    precioUnitario: 32,
    activo: true,
    marca: "Nescafé",
    categoria: "bebidas calientes",
  },
  {
    id: 21,
    nombreProducto: "Té Negro",
    stock: 26,
    precioUnitario: 13,
    activo: true,
    marca: "Lipton",
    categoria: "bebidas calientes",
  },
];
async function obtenerProductos(): Promise<Producto[]> {
  const ruta = path.resolve("src/ejercicio.json");
  const texto = await fs.readFile(ruta, "utf-8");
  return JSON.parse(texto);
}
// METODO CREATE
app.post("/productos", (req: Request, res: Response) => {
  const nuevoProducto = {
    id: productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1,
    nombreProducto: req.body.nombreProducto,
    stock: req.body.stock || 0,
    precioUnitario: req.body.precioUnitario || 0,
    activo: req.body.activo !== undefined ? req.body.activo : true,
    marca: req.body.marca || "Sin marca",
    categoria: req.body.categoria || "General",
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});
//METODO READ
app.get("/productos/:id", (req: Request, res: Response) => {
  res.json(productos);
});

app.get("/productos/:id", (req: Request, res: Response) => {
  const producto = productos.find(
    (p) => p.id === parseInt(req.params.id as string),
  );
  if (!producto) return res.status(404).send("Producto no encontrado");
  res.json(producto);
});
//UPDATE
app.put("/productos/:id", (req: Request, res: Response) => {
  const producto = productos.find(
    (p) => p.id === parseInt(req.params.id as string),
  );
  if (!producto) return res.status(404).send("Producto no encontrado");
  res.json(producto);

  ((producto.nombreProducto =
    req.body.nombreproducto || producto.nombreProducto),
    (producto.stock =
      req.body.stock !== undefined ? req.body.stock : producto.stock));
  producto.precioUnitario =
    req.body.preciosUnitario !== undefined
      ? req.body.precioUnitario
      : producto.precioUnitario;
  producto.activo =
    req.body.activo !== undefined ? req.body.activo : producto.activo;
  producto.marca = req.body.marca || producto.marca;
  producto.categoria = req.body.categoria || producto.categoria;

  res.json(producto);
});
// DELETE
app.delete("/productos/:id", (req: Request, res: Response) => {
  const index = productos.findIndex(
    (p) => p.id === parseInt(req.params.id as string),
  );
  if (index === -1) return res.status(404).send("Producto no encontrado");
  const eliminado = productos.slice(index, 1);
  res.json(eliminado[0]);
});

app.listen(3000, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});
