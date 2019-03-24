
import { Database } from 'arangojs';
import dotenv from 'dotenv';

// Inject environment variable from .env
dotenv.config();

const arangoDB = new Database({
  url: process.env.ARANGO_DB_PATH,
});

try {
  arangoDB.useDatabase(process.env.ARANGO_DB_NAME ? process.env.ARANGO_DB_NAME : 'pn');
} catch (error) {
  console.error(error);
  process.exit(1);
}

export default arangoDB;
