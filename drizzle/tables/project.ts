
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const project = pgTable("project", {
  id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  name: text("name"),
  tenantId: text("tenantId"),
  ownerId: text("ownerId"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
