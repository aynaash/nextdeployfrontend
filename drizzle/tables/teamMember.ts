import { pgTable,pgEnum, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";
import { user } from "./users";
import { team } from "./teams";

// Define the status enum (pending, accepted, rejected)
export const memberStatusEnum = pgEnum("member_status", ["pending", "accepted", "rejected"]);

export const teamMember = pgTable("team_member", {
  id: text("id").$defaultFn(() => randomUUID()).primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  teamId: text("team_id").notNull().references(() => team.id),
  role: varchar("role", { length: 50 }).default("member"),
  invited_by_user_id: text("invited_by_user_id"),
  status: memberStatusEnum("status").notNull().default("pending"),
  joinedAt: timestamp("joined_at").defaultNow(),
});
