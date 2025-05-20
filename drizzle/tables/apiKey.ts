
import {
  pgTable,
  text,
  timestamp,
  varchar,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";
import { team } from "./teams";

// Define enum for key scopes
export const apiKeyScopeEnum = pgEnum("api_key_scope", ["read", "write", "admin"]);

export const apiKey = pgTable("api_key", {
  id: text("id").$defaultFn(() => randomUUID()).primaryKey(),

  // 🔐 Hashed API key (store only hashed for security)
  key_hash: text("key_hash").notNull(),

  // 🔍 Optional human-readable name
  name: varchar("name", { length: 100 }),

  // 🌍 Multi-tenant awareness
  team_id: text("team_id").notNull().references(() => team.id),

  // 🎯 Scope for fine-grained permission control
  scope: apiKeyScopeEnum("scope").notNull().default("read"),

  // 📅 Audit fields
  created_at: timestamp("created_at").defaultNow().notNull(),
  last_used_at: timestamp("last_used_at"),
  revoked_at: timestamp("revoked_at"),

  // 🧼 Soft delete
  is_revoked: boolean("is_revoked").default(false).notNull(),
});
