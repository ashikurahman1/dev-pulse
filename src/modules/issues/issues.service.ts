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

export const getAllIssues = async (filters: any) => {
  let sql = `SELECT * FROM issues WHERE 1=1`;

  const params: any[] = [];

  let paramCount = 1;

  if (filters.type) {
    sql += `AND type = $${paramCount}`;
    params.push(filters.type);
    paramCount++
  }

  if (filters.status) {
    sql += ` AND status = $${paramCount}`;
    params.push(filters.status);
    paramCount++
  }

  // Sorting logic
  const sortOrder = filters.sort === 'oldest' ? 'ASC' : 'DESC';

  sql += ` ORDER BY created_at ${sortOrder}`;

  const issuesResult= await pool.query(sql, params);
  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  const reporterIds = Array.from(new Set(issues.map(issue => issue.reporter_id)))

  const usersResult = await pool.query(`SELECT id, name FROM users WHERE id IN (${reporterIds.map((_, i) => `$${i + 1}`).join(',')})`, [reporterIds])

  const userMap = new Map(usersResult.rows.map((user) => [user.id, user]))

  return issues.map((issue) => {
    const {reporter_id, ...rest} = issue;
    return {
      ...rest,
      reporter: userMap.get(reporter_id) || null 
    }
  });
}

export const getIssueById = async (id: number) => {
  const issueResult = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);
  const issue = issueResult.rows[0];
  if (!issue) return null;

  const userResult = await pool.query('SELECT id, name, role FROM users WHERE id = $1', [issue.reporter_id]);
  const { reporter_id, ...rest } = issue;
  
  return {
    ...rest,
    reporter: userResult.rows[0] || null
  };
};

export const updateIssue = async (id: number, body: any) => {
  const { title, description, type, status } = body;

  const fields = [];
  const params = [];
  let count = 1;

  if (title) { fields.push(`title = $${count++}`); params.push(title); }
  if (description) { fields.push(`description = $${count++}`); params.push(description); }
  if (type) { fields.push(`type = $${count++}`); params.push(type); }
  if (status) { fields.push(`status = $${count++}`); params.push(status); }

  if (fields.length === 0) return null;

  params.push(id);
  const sql = `UPDATE issues SET ${fields.join(', ')} WHERE id = $${count} RETURNING *`;
  const result = await pool.query(sql, params);
  return result.rows[0];
};

export const deleteIssue = async (id: number) => {
  const result = await pool.query('DELETE FROM issues WHERE id = $1 RETURNING id', [id]);
  return result.rowCount ? result.rowCount > 0 : false;
};