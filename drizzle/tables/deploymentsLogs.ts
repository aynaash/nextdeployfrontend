
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

  // Foreign key to the deployment session
  deployment_id: text("deployment_id")
    .notNull()
    .references(() => deployments.id, { onDelete: "cascade" }),

  // 🔍 Log metadata
  service_name: varchar("service_name", { length: 100 }), // e.g., "next-logger-daemon"
  container_name: varchar("container_name", { length: 100 }), // e.g., "next-js-app"
  daemon: varchar("daemon", { length: 100 }), // e.g., "response_logger"

  request_id: text("request_id"), // Optional: trace individual request per log
  level: text("level").default("info"), // info, warn, error, debug

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
