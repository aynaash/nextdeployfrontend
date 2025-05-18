
import { pgTable, text, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.ts";
import { randomUUID } from "crypto";

export const passkey = pgTable("passkeys", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name"),
  credentialID: text("credential_id").notNull(),
  publicKey: text("public_key").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: json("transports"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow()
});
