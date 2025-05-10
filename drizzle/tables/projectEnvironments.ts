
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
export const projectEnvironments = pgTable("project_environments", {
  id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  projectId:text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  envVars: jsonb("env_vars").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const envProjectIdx = index("env_project_idx").on(projectEnvironments.projectId);
