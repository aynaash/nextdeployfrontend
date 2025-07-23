import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/migrations',
  schema: './drizzle/schema/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://elitebook:50307813117@localhost:5432/nextdeploy_dev',
  },
});
