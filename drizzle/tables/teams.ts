
import { pgTable, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";
export const teams = pgTable("teams", {
  id: text("id").$defaultFn(()=> randomUUID).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
