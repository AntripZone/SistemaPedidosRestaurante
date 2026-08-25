import { pool } from "../config/db.js";

// TIPADO DE LA TABLA
export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  disponible: boolean;
}

// TIPOS PARA CREAR Y ACTUALIZAR
export type CreateProductoInput = Omit<Producto, "id">;
export type UpdateProductoInput = Partial<CreateProductoInput>;

// FUNCIONES QUE CONSULTAN A LA BASE DE DATOS
export const ProductsModel = {

  // GET 
  findAll: async (): Promise<Producto[]> => {

    const { rows } = await pool.query(
      "SELECT * FROM productos ORDER BY id ASC;"
    );

    return rows;
  },


  // GET - Obtener por ID
  findById: async (id: number): Promise<Producto | null> => {

    const { rows } = await pool.query(
      "SELECT * FROM productos WHERE id = $1;",
      [id]
    );

    return rows[0] || null;
  },


  // POST 
  create: async (
    dato: CreateProductoInput
  ): Promise<Producto> => {

    const {
      nombre,
      categoria,
      precio,
      disponible
    } = dato;

    const query = `
      INSERT INTO productos
        (nombre, categoria, precio, disponible)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *;
    `;

    const { rows } = await pool.query<Producto>(
      query,
      [nombre, categoria, precio, disponible]
    );
    if (!rows[0]) {
      throw new Error("No se pudo crear el producto");
    }
    return rows[0];
  },


  // PUT
  update: async (
    id: number,
    dato: UpdateProductoInput
  ): Promise<Producto | null> => {

    const { rows } = await pool.query<Producto>(
      `UPDATE productos
       SET nombre = $1,
           categoria = $2,
           precio = $3,
           disponible = $4
       WHERE id = $5
       RETURNING *;`,
      [
        dato.nombre,
        dato.categoria,
        dato.precio,
        dato.disponible,
        id
      ]
    );

    return rows[0] || null;
  },


  // DELETE 
  delete: async (id: number): Promise<boolean> => {

    const { rowCount } = await pool.query(
      "DELETE FROM productos WHERE id = $1;",
      [id]
    );

    return (rowCount ?? 0) > 0;
  }

};
