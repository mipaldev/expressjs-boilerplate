import { envConfig } from '@/config/env.config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: envConfig.db.url,
});

export const db = drizzle(pool);
