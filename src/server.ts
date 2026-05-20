import app from './app.js';

import envConfig from './config/envConfig.js';
import { initDB } from './db/dbConfig.js';

const main = () => {
  try {
    initDB();
    console.log('PostgreSQL Connection established successfully.');
    app.listen(envConfig.port, () => {
      console.log(`Server is running on port ${envConfig.port}`);
    });
  } catch (error) {
    console.error('Database connection breakdown:', error);
    process.exit(1);
  }
};

main();
