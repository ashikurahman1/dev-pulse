import { pool } from "../../db/dbConfig.js";


export const createIssue = async (body: any, reporterId: number) => {
  const { title, description, type } = body;

  const sql = `
  INSERT INTO issues (title, description, type, reporter_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;
  const result = await pool.query(sql, [title, description, type, reporterId]);
  return result.rows[0];
};