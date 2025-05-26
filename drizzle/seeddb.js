
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { Pool } from 'pg';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema/schema';
import { isEdgeRuntime } from './runtime';

// Type-safe exports
let db: ReturnType<typeof drizzleNode> | ReturnType<typeof drizzleNeon>;
let rawClient: Pool | ReturnType<typeof neon>;

if (isEdgeRuntime()) {
  // Edge Runtime - Neon HTTP driver
  rawClient = neon(process.env.DATABASE_URL!);
  db = drizzleNeon(rawClient, { 
    schema,
    logger: process.env.NODE_ENV === 'development'
  });
} else {
  // Node.js Runtime - Standard Postgres (Pool)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { 
      rejectUnauthorized: false 
    } : false,
    max: 5,
    idleTimeoutMillis: 30000
  });

  rawClient = pool;
  db = drizzleNode(pool, { 
    schema,
    logger: process.env.NODE_ENV === 'development'
  });

  // Connection cleanup
  const cleanup = () => pool.end().catch(console.error);
  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

export { db, rawClient };
