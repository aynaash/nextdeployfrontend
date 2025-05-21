
import { pgTable, text, integer, timestamp, primaryKey, index } from "drizzle-orm/pg-core";

export const rateLimit = pgTable("rate_limit", {
  identifier: text("identifier").notNull().primaryKey(),
  tokens: integer("tokens").notNull(),
  lastRefill: timestamp("last_refill", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  identifierIdx: index("idx_rate_limits_identifier").on(table.identifier),
}));
