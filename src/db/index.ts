import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// create serverless HTTP SQL connection to neon
const sql = neon(process.env.DATABASE_URL!);

// pass the SQL client and schema to drizzle
// we pass the { schema } to drizzle to enable Drizzle's relational queries API
export const db = drizzle(sql, { schema });
