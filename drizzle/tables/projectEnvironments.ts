
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import {projects} from "./projects.ts"
// Defining the 'project_environments' table
export const projectEnvironments = pgTable("project_environments", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  envVars: jsonb("env_vars").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  // Creating the index on the 'projectId' column
  return {
    envProjectIdx: index("env_project_idx").on(table.projectId), // Use `table` here, not `projectEnvironments`
  };
});
