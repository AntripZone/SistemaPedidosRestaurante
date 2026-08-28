import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import { ProductsModel } from "../models/productos.model.js";
import{
  createProductoSchema,
  updateProductoSchema,
} from "../schemas/productosSchema.js";
// GET /productos
// Obtener todos los productos
export async function getProducts(req: Request,res: Response){
  try {
    const result = await pool.query("SELECT * FROM productos;");
    console.log(result);
    res.json({
      message:"conexion exitosa a la base de datos",
      total:result.rowCount,
      data: result.rows
    });

  } catch (error: any) {
    console.error("Error al consultar PostgreSQL:", error);

    return res.status(500).json({
      error: "Error al intentar conectar con la base de datos"
    });
  }
}


// GET /productos/:id
// Obtener un producto por ID
export async function getProductoPorId(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico"
      });
    }

    const product = await ProductsModel.findById(id);

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    return res.status(200).json({
      data: product
    });

  } catch (error: any) {
    console.error("Error al obtener producto:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}


// POST /productos
// Crear un nuevo producto
export async function crearProducto(
  req: Request,
  res: Response
) {
   /*
      #swagger.tags = ['Producto']
      #swagger.summary = 'crear un producto nuevo'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para crear un producto nuevo',
        required: true,
        schema: {
          $nombre: "coca cola",
          $categoria: "bebida",
          $precio: 15,
          disponible: true
        }
      }
    */
  try {
    const result = createProductoSchema.safeParse(req.body);

    if(!result.success){
      return res.status(400).json({
        error: result.error.issues
      });
    }
 
    const newProduct = await ProductsModel.create(result.data);
  

    return res.status(201).json({
      data: newProduct
    });

  } catch (error: any) {
    console.error("Error al crear producto:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}

export async function actualizarProducto(req: Request,res: Response){
  try{
    const id = Number(req.params.id);
    if(isNaN(id)){
      res.status(400).json({error:"el id debe ser un numer"});
    }
    const productoUpdate =await ProductsModel.update(id, req.body);
    if(!productoUpdate){
      res.status(404).json({error: "producto no encontrado"});
      return;
    }
    res.json({data: productoUpdate});
  }catch(error: any){
    res.status(500).json({error:error.message});
  }

}

// DELETE /productos/:id
// Eliminar un producto
export async function eliminarProducto(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico"
      });
    }

    const productoEliminado = await ProductsModel.delete(id);

    if (!productoEliminado) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    return res.status(200).json({
      message: "Producto eliminado exitosamente"
    });

  } catch (error: any) {
    console.error("Error al eliminar producto:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}