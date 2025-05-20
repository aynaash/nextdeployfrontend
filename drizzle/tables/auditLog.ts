
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
export const auditLog = pgTable("audit_log", {
 id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  tenantId: text("tenant_id").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogUserIdx = index("auditlog_user_idx").on(auditLog.userId);
export const auditLogTenantIdx = index("auditlog_tenant_idx").on(auditLog.tenantId);
