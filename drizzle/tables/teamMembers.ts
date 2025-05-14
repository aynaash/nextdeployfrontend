import { pgTable,pgEnum, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";
import { users } from "./users";
import { teams } from "./teams";

// Define the status enum (pending, accepted, rejected)
export const memberStatusEnum = pgEnum("member_status", ["pending", "accepted", "rejected"]);

export const teamMembers = pgTable("team_members", {
  id: text("id").$defaultFn(() => randomUUID()).primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  teamId: text("team_id").notNull().references(() => teams.id),
  role: varchar("role", { length: 50 }).default("member"),
  invited_by_user_id: text("invited_by_user_id"),
  status: memberStatusEnum("status").notNull().default("pending"),
  joinedAt: timestamp("joined_at").defaultNow(),
});
