import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";
import { deployment } from "./deployment";

export const metric = pgTable("metric", {
  id: text("id").$defaultFn(() => randomUUID()).primaryKey(),
  deploymentId: text("deployment_id")
    .notNull()
    .references(() => deployment.id, { onDelete: "cascade" }),
  cpuUsage: real("cpu_usage").notNull(),
  memoryUsage: real("memory_usage").notNull(),
  diskUsage: real("disk_usage"),               
  networkIn: real("network_in"),              
  networkOut: real("network_out"),             
  uptime: real("uptime"),                   

  createdAt: timestamp("created_at").defaultNow(),
});
