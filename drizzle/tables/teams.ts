
import { pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const teams = pgTable("teams", {
  id: text("id").$defaultFn(() => randomUUID()).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  owner_id: text("owner_id").notNull(),
  is_deleted: boolean("is_deleted").default(false),
  tenant_id: text("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
