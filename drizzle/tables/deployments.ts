
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { deploymentStatusEnum } from "../enums";

export const deployments = pgTable("deployments", {
  id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  imageUrl: text("imageUrl"),
  status: deploymentStatusEnum("status"),
  tenantId: text("tenantId"),
  projectId: text("projectId"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
