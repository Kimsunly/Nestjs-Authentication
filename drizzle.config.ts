import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: './src/db/schema.ts', // where the tables are defined
  out: './drizzle', // where migration SQL files are saved
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

export default config;
