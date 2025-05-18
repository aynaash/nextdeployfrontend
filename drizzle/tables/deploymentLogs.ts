
import {
  pgTable,
  text,
  timestamp,
  index,
  varchar,
} from "drizzle-orm/pg-core";
import { deployments } from "./deployments";

export const deploymentLogs = pgTable("deployment_logs", {
  id: text("id").$defaultFn(() => crypto.randomUUID()).primaryKey(),
  deployment_id: text("deployment_id")
    .notNull()
    .references(() => deployments.id, { onDelete: "cascade" }),
  service_name: varchar("service_name", { length: 100 }),
  container_name: varchar("container_name", { length: 100 }),
  daemon: varchar("daemon", { length: 100 }),
  request_id: text("request_id"),
  level: text("level").default("info"),

  // 📄 Main log content
  message: text("message").notNull(),

  // 📆 Timestamps
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    // 🔧 Useful for filtering quickly by deployment or time
    deploymentIdIdx: index("log_deployment_idx").on(table.deployment_id),
    createdAtIdx: index("log_created_at_idx").on(table.createdAt),
    requestIdIdx: index("log_request_id_idx").on(table.request_id),
  };
});
