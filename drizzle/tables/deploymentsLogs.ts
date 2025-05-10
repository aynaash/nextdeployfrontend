
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
export const deploymentLogs = pgTable("deployment_logs", {
  id: text("id").$defaultFn(()=>randomUUID()).primaryKey(),
  deploymentId:text("deployment_id").notNull().references(() => deployments.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  level: text("level").default("info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const logDeploymentIdx = index("log_deployment_idx").on(deploymentLogs.deploymentId);
