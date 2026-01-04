import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { envConfig } from '@/config/env.config';

const pool = new Pool({
  connectionString: envConfig.db.url,
});

export const db = drizzle(pool);
