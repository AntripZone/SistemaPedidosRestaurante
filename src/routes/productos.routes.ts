import { Router } from "express";
import productos from "../productos.json" with { type: "json" };

const router = Router();

router.get("/", (req, res) => {
  // #swagger.tags = ['PRODUCTOS ✅ ']
  // #swagger.description = 'obtiene la lista de productos'
  // #swagger.description = permite filtrar los productos por categoria
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
  /*  // #swagger.tags = ['PRODUCTOS ID 🔑']
  // #swagger.description = 'Obtiene la informacion de un producto en especifico por su id'
    #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID del producto a buscar',
          required: true,
          type: 'integer'
  }  */
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
  /*
      #swagger.tags = ['CREAR UN PRODUCTO 🏷️']
      #swagger.summary = 'crear un producto nuevo'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para crear un producto nuevo',
        required: true,
        schema: {
          $nombre: "coca cola",
          $categoria: "bebida",
          $precio: 15,
          disponible: "true"
        }
      }
    */
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
router.put("/:id", (req, res) => {
  /*
    #swagger.tags = ['ACTUALIZAR UN PRODUCTO 🧾']
    #swagger.summary = 'actualizar un producto existente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'id del producto a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del producto',
      required: true,
      schema: {
        $nombre: "coca cola",
          $categoria: "bebida",
          $precio: 15,
          disponible: "true"
      }
    }
  */
  const id = Number(req.params.id);

  const producto = productos.find((producto) => producto.id === id);

  if (!producto) {
    return res.status(404).json({
      mensaje: "Producto no encontrado",
    });
  }

  const { nombre, precio, disponible } = req.body;

  if (precio !== undefined && precio <= 0) {
    return res.status(400).json({
      mensaje: "El precio debe ser mayor a 0",
    });
  }

  if (nombre !== undefined) {
    producto.nombre = nombre;
  }

  if (precio !== undefined) {
    producto.precio = precio;
  }

  if (disponible !== undefined) {
    producto.disponible = disponible;
  }

  res.json(producto);
});
router.delete("/:id", (req, res) => {
  /*
    #swagger.tags = ['ELIMINAR UN PRODUCTO ❌']
    #swagger.summary = 'eliminar un producto'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del producto a eliminar',
      required: true,
      type: 'integer'
    }
  */
  const id = Number(req.params.id);

  const indice = productos.findIndex((producto) => producto.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Producto no encontrado",
    });
  }

  productos.splice(indice, 1);

  res.json({
    mensaje: "Producto eliminado correctamente",
  });
});

export default router;