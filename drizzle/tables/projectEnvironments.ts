
import { pgTable, text, timestamp, jsonb, index, boolean, pgEnum } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";
import { projects } from "./projects.ts";

// Define a new enum for environment types
export const envTypeEnum = pgEnum("env_type", ["development", "staging", "production"]);

export const projectEnvironments = pgTable("project_environments", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  type: envTypeEnum("type").notNull().default("development"),

  envVars: jsonb("env_vars").notNull(),

  isActive: boolean("is_active").default(true),

  deletedAt: timestamp("deleted_at"),

  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    envProjectIdx: index("env_project_idx").on(table.projectId),
  };
});
