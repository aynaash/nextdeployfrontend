
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";
import { user } from "./users";
import { organization } from "./organization";

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  email: text("email").notNull(),

  role: text("role"), // Consider enum if you support specific roles like "admin", "member"

  status: text("status").default("pending").notNull(), // Defaulting to "pending"

  expiresAt: timestamp("expires_at").notNull(),

  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
