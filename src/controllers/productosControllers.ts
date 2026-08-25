import type { Request, Response } from "express";
import { ProductsModel } from "../models/productos.model.js";

export async function getProducts(req: Request, res: Response) {
  try {
    const product = await ProductsModel.findAll();
    res.json({ totalProductos: product.length, data: product });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    });
  }
}

export async function getProductsById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el ud debe ser numerico" });
      return;
    }
    const product = await ProductsModel.findById(id);
    if (!product) {
      res.status(400).json({ error: "producto no encotnrado" });
      return;
    }
    res.json({ data: product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function postProduct(req: Request, res: Response) {
  try {
    const { nombre, precio, categoria, disponible } = req.body;
    if (!nombre || !categoria || !precio || !disponible) {
      res.status(400).json({ error: "faltan datos obligatorios" });
    }
    const newProduct = await ProductsModel.create({ nombre, categoria, precio, disponible });
    res.status(201).json({ data: newProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function putProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const productoUpdate = await ProductsModel.update(id, req.body);
    if (!productoUpdate) {
      res.status(404).json({ error: "producto no encontrado" });
      return;
    }
    res.json({ data: productoUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteProducts(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const productEliminado = await ProductsModel.delete(id);
    if (productEliminado) {
      res.status(200).json({ message: "producto eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "producto no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
