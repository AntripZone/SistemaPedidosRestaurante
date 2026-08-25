import { pool } from "../config/db.js";

// TIPADO DE LA TABLA
export interface Repartidor {
  id: number;
  nombre: string;
  vehiculo: string;
  activo: boolean;
}

// TIPOS DERIVADOS
export type CreateRepartidorInput = Omit<Repartidor, "id">;
export type UpdateRepartidorInput = Partial<CreateRepartidorInput>;

// FUNCIONES QUE CONSULTAN A LA BASE DE DATOS
export const RepartidorModel = {
  findAll: async (): Promise<Repartidor[]> => {
    const { rows } = await pool.query(
      "SELECT * FROM repartidores ORDER BY id ASC;"
    );
    return rows;
  },

  findById: async (id: number): Promise<Repartidor | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM repartidores WHERE id = $1;",
      [id]
    );
    return rows[0] || null;
  },

  create: async (dato: CreateRepartidorInput): Promise<Repartidor> => {
    const { nombre, vehiculo, activo = true } = dato;
    const query =
      "INSERT INTO repartidores (nombre, vehiculo, activo) VALUES ($1, $2, $3) RETURNING *;";
    const { rows } = await pool.query(query, [nombre, vehiculo, activo]);
    return rows[0];
  },

  update: async (
    id: number,
    dato: UpdateRepartidorInput
  ): Promise<Repartidor | null> => {
    const query = `
      UPDATE repartidores
      SET nombre = COALESCE($1, nombre),
          vehiculo = COALESCE($2, vehiculo),
          activo = COALESCE($3, activo)
      WHERE id = $4
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      dato.nombre,
      dato.vehiculo,
      dato.activo,
      id,
    ]);
    return rows[0] || null;
  },

  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM repartidores WHERE id = $1;",
      [id]
    );
    return (rowCount ?? 0) > 0;
  },
};