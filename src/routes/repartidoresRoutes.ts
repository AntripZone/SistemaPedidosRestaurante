import { Router } from "express";
import { validateRepartidor } from "../middlewares/repartidores.middleware.js";
import { repartidores } from "../data/dataRepartidores.js" with { type: "json" };;

const router = Router();

let idRepartidor = 2;

router.get("/", (req, res) => {
  const { nombres } = req.query;

  if (nombres) {
    const repartidorFiltrado = repartidores.filter(
      (repartidor) => repartidor.nombre === nombres,
    );

    return res.json(repartidorFiltrado);
  }

  res.json(repartidores);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const repartidor = repartidores.find((repartidor) => repartidor.id === id);

  if (!repartidor) {
    return res.status(404).json({
      mensaje: "Repartidor no encontrado",
    });
  }

  res.json(repartidor);
});

router.post("/", validateRepartidor, (req, res) => {
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

router.put("/:id", validateRepartidor, (req, res) => {
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
  const repartidor = repartidores.find((r) => r.id === idRepartidor);
  if (!repartidor)
    return res.status(404).json({ error: "Repartidor no encontrado" });
  const { telefono, vehiculo, activo } = req.body;
  if (telefono !== undefined) repartidor.telefono = telefono;
  if (vehiculo !== undefined) repartidor.vehiculo = vehiculo;
  if (activo !== undefined) repartidor.activo = activo;

  res.json(repartidor);
});

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
    return res.status(404).json({ error: "Repartidor no encontrado" });

  repartidores.splice(index, 1);
  res.json({ mensaje: "Repartidor eliminado del sistema" });
});


export default router;
