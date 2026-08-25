import { Router } from "express";
import { clientes } from "../data/clientes.data.js";
import { validarCliente } from "../middlewares/clientes.middleware.js";
import type { Cliente } from "../types/cliente.js";

const router = Router();

// GET /clientes
// Muestra todos los clientes
// También permite filtrar por ciudad:
// /clientes?ciudad=Jalapa

router.get("/", (req, res) => {
  const ciudad = req.query.ciudad;

  if (ciudad && typeof ciudad === "string") {
    const clientesFiltrados = clientes.filter((cliente) => {
      return cliente.ciudad.toLowerCase() === ciudad.toLowerCase();
    });

    return res.status(200).json(clientesFiltrados);
  }

  return res.status(200).json(clientes);
});


// GET /clientes/:id
// Busca un cliente específico mediante su ID

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const cliente = clientes.find((cliente) => {
    return cliente.id === id;
  });

  if (!cliente) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado",
    });
  }

  return res.status(200).json(cliente);
});


/* Post de los clientes */


router.post("/", validarCliente, (req, res) => {
  const { nombre, telefono, direccion, ciudad } = req.body;

  const nuevoCliente: Cliente = {
    id:
      clientes.length > 0
        ? Math.max(...clientes.map((cliente) => cliente.id)) + 1
        : 1,
    nombre,
    telefono,
    direccion,
    ciudad,
  };

  clientes.push(nuevoCliente);

  return res.status(201).json({
    mensaje: "Cliente creado correctamente",
    cliente: nuevoCliente,
  });
});

/* PUT de los clientes */

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const cliente = clientes.find((cliente) => {
    return cliente.id === id;
  });

  if (!cliente) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado",
    });
  }

  const { telefono, direccion } = req.body;

  if (!telefono && !direccion) {
    return res.status(400).json({
      mensaje: "Debe enviar telefono o direccion para actualizar",
    });
  }

  if (telefono !== undefined) {
    if (typeof telefono !== "string") {
      return res.status(400).json({
        mensaje: "El telefono debe ser de tipo texto",
      });
    }

    cliente.telefono = telefono;
  }

  if (direccion !== undefined) {
    if (typeof direccion !== "string") {
      return res.status(400).json({
        mensaje: "La direccion debe ser de tipo texto",
      });
    }

    cliente.direccion = direccion;
  }

  return res.status(200).json({
    mensaje: "Cliente actualizado correctamente",
    cliente: cliente,
  });
});

/* Delete del cliente  */

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = clientes.findIndex((cliente) => {
    return cliente.id === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado",
    });
  }

  const clienteEliminado = clientes.splice(indice, 1);

  return res.status(200).json({
    mensaje: "Cliente eliminado correctamente",
    cliente: clienteEliminado[0],
  });
});
export default router;