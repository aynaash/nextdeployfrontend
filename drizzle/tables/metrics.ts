import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";
import { deployments } from "./deployments";

export const metrics = pgTable("metrics", {
  id: text("id").$defaultFn(() => randomUUID()).primaryKey(),

  deploymentId: text("deployment_id")
    .notNull()
    .references(() => deployments.id, { onDelete: "cascade" }),

  cpuUsage: real("cpu_usage").notNull(),       // in percentage e.g., 73.5
  memoryUsage: real("memory_usage").notNull(), // in MB or GB

  diskUsage: real("disk_usage"),               // optional: in GB
  networkIn: real("network_in"),               // MB/s
  networkOut: real("network_out"),             // MB/s
  uptime: real("uptime"),                      // seconds or minutes

  createdAt: timestamp("created_at").defaultNow(),
});
