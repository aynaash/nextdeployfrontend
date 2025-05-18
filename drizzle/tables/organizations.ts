
import { pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const organization = pgTable("organizations", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});
