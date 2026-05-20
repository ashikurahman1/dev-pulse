import { Pool } from 'pg';
import envConfig from '../config/envConfig.js';

export const pool = new Pool({
  connectionString: envConfig.connectionString,
  ssl: false,
});

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY, 
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(255) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
      `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(255) NOT NULL CHECK (type IN ('bug', 'feature_request')),
      status VARCHAR(255) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
      reporter_id INT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
      `);

    

    console.log('Database connected successfully');
  } catch (error) {
    console.log(error);
  }
};
