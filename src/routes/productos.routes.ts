import { Router } from "express";
import productos from "../productos.json" with { type: "json" };

const router = Router();

router.get("/", (req, res) => {
  const { categoria } = req.query;

  if (categoria) {
    const productosFiltrados = productos.filter(
      (producto) => producto.categoria === categoria,
    );

    return res.json(productosFiltrados);
  }

  res.json(productos);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const producto = productos.find((producto) => producto.id === id);

  if (!producto) {
    return res.status(404).json({
      mensaje: "Producto no encontrado",
    });
  }

  res.json(producto);
});

router.post("/", (req, res) => {
  const { nombre, categoria, precio, disponible } = req.body;

  if (precio <= 0) {
    return res.status(400).json({
      mensaje: "El precio debe ser mayor a 0",
    });
  }

  const nuevoProducto = {
    id: productos.length + 1,
    nombre: nombre,
    categoria: categoria,
    precio: precio,
    disponible: disponible,
  };

  productos.push(nuevoProducto);

  res.status(201).json(nuevoProducto);
});

export default router;
