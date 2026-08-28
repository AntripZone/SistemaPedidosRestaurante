import { pool } from "../config/db.js";

export interface Pedidos {
    id: number,
    cliente_id: number,
    fecha: string,
    estado: string,
    total: number,
    id_repartidor: number | null
}
export interface paginaResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CreatePedidoInput = Omit<Pedidos, "id" | "fecha" | "estado" | "id_repartidor">& {id_repartidor?: Pedidos["id_repartidor"]};
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
      "INSERT INTO pedidos (cliente_id, fecha, estado, total, id_repartidor) VALUES ($1, CURRENT_DATE,'Pendiente',$2, $3) RETURNING *;";
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
  findByClienteId: async (cliente_id: number): Promise<Pedidos[]> => {
    const { rows } = await pool.query<Pedidos>(
      "SELECT * FROM pedidos WHERE cliente_id = $1 ORDER BY id ASC;",
      [cliente_id],
    );
    return rows;
  },
  findWhitFilter: async (
    page: number = 1,
    limit: number = 10,
    search?: string, // where name ILIKE %${search}%
    estado?: string, // where precio >= ${minPirce}
  ): Promise<paginaResult<[Pedidos]>> => {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    //la construccion de las condiciones
    if (search) {
      conditions.push(`cliente_id <= $${paramIndex}`);
      paramIndex++;
      values.push(`%${search}%`);
    }

    if (estado !== undefined) {
      conditions.push(`LOWER(estado) = LOWER($${paramIndex})`);
      paramIndex++;
      values.push(estado);
    }
    // unir las condiciones existentes con AND
    const whereUnited =
      conditions.length > 0 ? `WHERE ${conditions.join(` AND `)}` : "";
    //CONTEO TOTAL de prodcutos q coinciden con los filtros aplicados (en caso de haberlos)
    const countQuery = `SELECT COUNT(*) FROM pedidos ${whereUnited}`;
    const countResult = await pool.query(countQuery, values);
    const total = Number(countResult.rows[0].count);
    //consulta de datos con limit y offset
    const offset = (page - 1) * limit;
    //agregar el limit y offset a los placeholder dinamicos
    const dataValues = [...values, limit, offset];
    const dataQuery = `
    SELECT * FROM pedidos
    ${whereUnited}
    ORDER BY id ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const { rows } = await pool.query(dataQuery, dataValues);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },
}
