import { pgTable, text, timestamp, integer, real } from "drizzle-orm/pg-core";
import {deployments} from "./deployments.ts"
export const metrics = pgTable("metrics", {
  id:text("id").$defaultFn(()=> randomUUID()).primaryKey(),
  deploymentId: text("deployment_id").notNull().references(() => deployments.id),
  cpuUsage: real("cpu_usage").notNull(),
  memoryUsage: real("memory_usage").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
