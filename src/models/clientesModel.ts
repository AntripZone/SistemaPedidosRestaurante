import { pool } from "../config/db.js";

// TIPADO DE LA TABLA
export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  email: string;
  ciudad: string;
}

// TIPOS PARA CREAR Y ACTUALIZAR
export type CreateClienteInput = Omit<Cliente, "id">;

export type UpdateClienteInput = Pick<
  Cliente,
  "telefono" | "direccion"
>;

// FUNCIONES QUE CONSULTAN A LA BASE DE DATOS
export const ClienteModel = {

  // Obtener todos los clientes
  findAll: async (): Promise<Cliente[]> => {

    const { rows } = await pool.query(
      "SELECT * FROM clientes ORDER BY id ASC;"
    );

    return rows;
  },


  // Buscar cliente por ID
  findById: async (id: number): Promise<Cliente | null> => {

    const { rows } = await pool.query(
      "SELECT * FROM clientes WHERE id = $1;",
      [id]
    );

    return rows[0] || null;
  },


  // Buscar clientes por ciudad
  findByCiudad: async (ciudad: string): Promise<Cliente[]> => {

    const { rows } = await pool.query(
      "SELECT * FROM clientes WHERE ciudad = $1 ORDER BY id ASC;",
      [ciudad]
    );

    return rows;
  },


  // Crear cliente
  create: async (
    dato: CreateClienteInput
  ): Promise<Cliente> => {

    const {
      nombres,
      apellidos,
      telefono,
      direccion,
      email,
      ciudad
    } = dato;

    const query = `
      INSERT INTO clientes
      (nombres, apellidos, telefono, direccion, email, ciudad)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [
      nombres,
      apellidos,
      telefono,
      direccion,
      email,
      ciudad
    ]);

    return rows[0];
  },


  // Actualizar teléfono o dirección
  update: async (
    id: number,
    dato: UpdateClienteInput
  ): Promise<Cliente | null> => {

    const { rows } = await pool.query(
      `
      UPDATE clientes
      SET telefono = COALESCE($1, telefono),
          direccion = COALESCE($2, direccion)
      WHERE id = $3
      RETURNING *;
      `,
      [
        dato.telefono,
        dato.direccion,
        id
      ]
    );

    return rows[0] || null;
  },


  // Eliminar cliente
  delete: async (id: number): Promise<boolean> => {

    const { rowCount } = await pool.query(
      "DELETE FROM clientes WHERE id = $1;",
      [id]
    );

    return (rowCount ?? 0) > 0;
  },

};