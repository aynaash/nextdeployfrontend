// lib/db.ts
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleEdge } from 'drizzle-orm/vercel-postgres';
import { Pool } from 'pg';
import { sql } from '@vercel/postgres';
import * as schema from '../drizzle/schema.ts';
import { isEdgeRuntime } from './runtime';

let db;
let client;

if (isEdgeRuntime()) {
  // Edge Runtime Configuration
  console.log('Using Edge-compatible database client');
  client = sql;
  db = drizzleEdge(client, { schema });
} else {
  // Node.js Runtime Configuration
  console.log('Using Node.js database client');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  client = pool;
  db = drizzleNode(pool, { schema });
  
  // Graceful shutdown for Node.js
  process.on('exit', () => {
    pool.end().catch(console.error);
  });
}

export { db, client };
