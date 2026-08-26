import { pool } from "../config/db.js";

export interface Pedidos {
    id: number,
    cliente_id: number,
    fecha: string,
    estado: string,
    total: number,
    id_repartidor: number | null
}

export type CreatePedidoInput = Omit<Pedidos, "id" | "fecha" | "estado">;
export type UpdatePedidoInput = { estado: string;};

export const PedidosModel = {
    findAll: async (estado?: string): Promise<Pedidos[]> => {
         const {rows} = await pool.query("SELECT * FROM pedidos WHERE ($1::text IS NULL OR LOWER(estado) = LOWER($1)) ORDER BY id ASC", [estado ?? null]);
         return rows;
    },
    findById: async (id: number): Promise<Pedidos | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM pedidos WHERE id = $1;",
      [id],
    );
    return rows[0] || null;
  },
  create: async (dato: CreatePedidoInput): Promise<Pedidos> => {
    const { cliente_id, total, id_repartidor } = dato;
    const query =
      "INSERT INTO pedidos (cliente_id, fecha, estado, total, id_repartidor) VALUES ($1, CURRENT_TIMESTAMP,'Preparando',$2, $3) RETURNING *;";
    const { rows } = await pool.query(query, [
      cliente_id,
      total,
      id_repartidor ?? null,
    ]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdatePedidoInput,
  ): Promise<Pedidos | null> => {
    const { rows } = await pool.query(
      `UPDATE pedidos
            SET estado = $1
            WHERE id = $2
            RETURNING *;
`,
       [dato.estado, id],
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
