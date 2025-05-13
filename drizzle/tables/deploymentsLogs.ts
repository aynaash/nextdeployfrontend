
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { deployments } from "./deployments";

export const deploymentLogs = pgTable("deployment_logs", {
  id: text("id").$defaultFn(() => crypto.randomUUID()).primaryKey(),
  deployment_id: text("deployment_id")
    .notNull()
    .references(() => deployments.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  level: text("level").default("info"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    // ✅ this is safe and correct
    deploymentIdIdx: index("log_deployment_idx").on(table.deployment_id),
  };
});
