import { create } from "node:domain";
import { pool } from "../config/db.js";

export interface Pedidos {
    id: number,
    fecha: string,
    estado: string,
    total: number
}

export type CreatePedidoInput = Omit<Pedidos, "id">;
export type UpdatePedidoInput = Partial<CreatePedidoInput>;


export const PedidosModel = {
    findAll: async (estado?: string): Promise<Pedidos[]> => {
         const {rows} = await pool.query("SELECT * FROM pedidos WHERE ($1::text IS NULL OR LOWER(estado) = LOWER($1)) ORDER BY id ASC", [estado ?? null]);
         return rows;
    },
    findById: async (id: number): Promise<Pedidos | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM productos WHERE id = $1;",
      [id],
    );
    return rows[0] || null;
  },
  create: async (dato: CreatePedidoInput): Promise<Pedidos> => {
    const { fecha, estado, total } = dato;
    const query =
      "INSERT INTO pedidos (fecha , estado , total) VALUES ($1,$2,$3) RETURNING *;";
    const { rows } = await pool.query(query, [fecha, estado, total]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdatePedidoInput,
  ): Promise<Pedidos | null> => {
    const { rows } = await pool.query(
      `UPDATE pedidos
            SET fecha = $1,
            estado = $2,
            total = $3
            WHERE id = $4
            RETURNING *;
`,
      [dato.fecha, dato.estado, dato.total, id],
    );
    return rows[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM pedidos WHERE id = $1;",
      [id],
    );
    return (rowCount ?? 0) > 0;
  },
}