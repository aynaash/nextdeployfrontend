// migrations/0001_create_rate_limit_table.ts
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../lib/db";

async function createRateLimitTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS rate_limit (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      tokens INTEGER NOT NULL,
      last_refill TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON rate_limit (identifier);
  `);
}

// Run migration
migrate(db, { migrationsFolder: "drizzle" })
  .then(() => {
    console.log("Migration completed");
    return createRateLimitTable();
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
