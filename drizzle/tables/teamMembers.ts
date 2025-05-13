
import { pgTable, text, timestamp,varchar, integer } from "drizzle-orm/pg-core";
import {users} from "./users.ts"
import {teams} from "./teams.ts"
export const teamMembers = pgTable("team_members", {
  id: text("id").$defaultFn(()=> randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  teamId: text("team_id").notNull().references(() => teams.id),
  role: varchar("role", { length: 50 }).default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
});
