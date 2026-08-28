import { pool } from "../config/db.js";

export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  email: string;
  ciudad: string;
}

export interface PaginaResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CreateClienteInput = Omit<Cliente, "id">;

export type UpdateClienteInput = Pick<
  Cliente,
  "telefono" | "direccion"
>;


export const ClienteModel = {
  findAll: async (): Promise<Cliente[]> => {
    const { rows } = await pool.query(
      "SELECT * FROM clientes ORDER BY id ASC;"
    );

    return rows;
  },

  findById: async (id: number): Promise<Cliente | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM clientes WHERE id = $1;",
      [id]
    );

    return rows[0] || null;
  },

  findByCiudad: async (ciudad: string): Promise<Cliente[]> => {
    const { rows } = await pool.query(
      "SELECT * FROM clientes WHERE ciudad = $1 ORDER BY id ASC;",
      [ciudad]
    );

    return rows;
  },

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

  delete: async (id: number): Promise<boolean> => {

    const { rowCount } = await pool.query(
      "DELETE FROM clientes WHERE id = $1;",
      [id]
    );

    return (rowCount ?? 0) > 0;
  },

  findWithFilter: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    ciudad?: string
  ): Promise<PaginaResult<Cliente>> => {

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(
        `(nombres ILIKE $${paramIndex} OR apellidos ILIKE $${paramIndex})`
      );

      values.push(`%${search}%`);
      paramIndex++;
    }

    if (ciudad) {
      conditions.push(`ciudad ILIKE $${paramIndex}`);
      values.push(ciudad);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const countQuery = `
      SELECT COUNT(*)
      FROM clientes
      ${whereClause};
    `;

    const countResult = await pool.query(
      countQuery,
      values
    );

    const total = Number(countResult.rows[0].count);

    const offset = (page - 1) * limit;

    const dataValues = [
      ...values,
      limit,
      offset
    ];

    const dataQuery = `
      SELECT *
      FROM clientes
      ${whereClause}
      ORDER BY id ASC
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1};
    `;

    const { rows } = await pool.query(
      dataQuery,
      dataValues
    );

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  }
};