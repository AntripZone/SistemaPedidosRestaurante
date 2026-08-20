import express from "express";
import { validarRepartidor } from "../middlewares/repartidores.validos.js";
const router = express.Router();

let repartidores = [
  {
    id: 1,
    nombre: "Felipe Arroyo",
    vehiculo: "moto",
    telefono: "12858190",
    activo: true,
    pedidosAsignados: [],
  },
];
let idRepartidor = 2;

// GET /repartidores
router.get("/", (req, res) => {
  /* 
    #swagger.tags = ['Repartidores']
    #swagger.descripcion = 'Muestra la lista del personal de entrega 
    #swagger.parametrs['activo'] = {
        in:'query',
        descripcion:'Filtrar por estudo activo (true/false)',
        type:'boolean',
        required:false
    }
    #swagger.response[200] = {descripcion: 'Lista de repartidores obtenida'}
     */
  const { activo } = req.query;
  if (activo !== undefined) {
    const esActivo = activo === "true";
    const filtrados = repartidores.filter((r) => r.activo === esActivo);
    return res.json(filtrados);
  }
  res.json(repartidores);
});

//GET /repartidores/:id
router.get("/:id", (req, res) => {
  /*
    #swagger.tags = ['Repartidores']
    #swagger.descripcion = 'Consulta los datos y perfil del repartidor'
    #swagger.parameters['id'] = {descripcion: 'ID numerico del repartidor'}
    #swagger.responses[200] = {descripcion: 'Repartidor encontrado'}
    #swagger.responses[404] = {descripcion: 'Repartidor no encontrado'}
     */
  const repartidor = repartidores.find((r) => r.id === parseInt(req.params.id));
  if (!repartidor)
    return res.status(404).json({ error: "Repartidor no encontrado" });
  res.json(repartidor);
});

//POST /repartidores
router.post("/", validarRepartidor, (req, res) => {
  /*
    #swagger.tags = ['Repartidores']
    #swagger.descripcion = 'Registra a un nuevo repartidor'
    #swagger.parameters['obj'] = {
        in:'body',
        descripcion: 'Datos del nuevo repartidor',
        required: true,
        schema: {nombre: 'Felipe Arroyo', vehiculo: 'Moto', telefono:'09258145', activo: true}
    }
    #swagger.responses[201] = {descripcion: 'Repartidor creado existosamente'}
    #swagger.responses[400] = {descripcion: 'Datos invalidos o faltantes'} 
     */
  const { nombre, vehiculo, telefono, activo } = req.body;
  const nuevoRepartidor = {
    id: idRepartidor++,
    nombre,
    vehiculo,
    telefono,
    activo,
    pedidosAsignados: [],
  };
  repartidores.push(nuevoRepartidor);
  res.status(201).json(nuevoRepartidor);
});

//POST /repartidores/:id
router.put("/:id", validarRepartidor, (req, res) => {
  /*
    #swagger.tags = ['Repartidores']
    #swagger.descripcion = 'Actualiza los datos'
    #swagger.parameters['id'] = {descripcion: 'ID numerico del repartidor'}
    #swagger.parameters['obj'] = {
        in: 'body',
        descripcion: 'Datos a actualizar',
        schema: {vehiculo: 'Moto', telefono:'12875312', activo:false}
    }
    #swagger.responses[200] = {descripcion: 'Reprtidor actualizado'}
    #swagger.responses[400] = {descripcion: 'Datos de actulizacion invalidos'}
    #swagger.responses[404] = {descripcion: 'Repartidor no encontrado'}
     */
  const repartidor = repartidores.find((r) => r.id === parseInt(req.params.id));
  if (!repartidor)
    return res.status(404).json({ error: "Repartidor no encontrado" });
  const { telefono, vehiculo, activo } = req.body;
  if (telefono !== undefined) repartidor.telefono = telefono;
  if (vehiculo !== undefined) repartidor.vehiculo = vehiculo;
  if (activo !== undefined) repartidor.activo = activo;

  res.json(repartidor);
});

// DELETE /repartidores/:id
router.delete("/:id", (req, res) => {
  /*
    #swagger.tags = ['Repartidores']
    #swagger.descripcion = 'Elimina un repartidor del sistema'
    #swagger.parameters['id'] = {descripcion: 'ID numerico del repartidor'}
    #swagger.responses[200] = {descripcion: 'Reprtidor eliminado'}
    #swagger.responses[404] = {descripcion: 'Repartidor no encontrado'}
     */
  const index = repartidores.findIndex((r) => r.id === parseInt(req.params.id));
  if (index === -1)
    return repartidores.status(404).json({ error: "Repartidor no encontrado" });

  repartidores.splice(index, 1);
  res.json({ mensaje: "Repartidor eliminado del sistema" });
});

export default router;
