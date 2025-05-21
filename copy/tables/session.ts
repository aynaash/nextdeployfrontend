
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";
import { user } from "./user.ts";

export const session = pgTable("session", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
  tenantId: text("tenantId").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: text("active_organization_id"),
  impersonatedBy: text("impersonated_by"),
});
