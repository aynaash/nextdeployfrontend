
import { pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const organization = pgTable("organization", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  name: text("name").notNull(),

  slug: text("slug").unique(),

  logo: text("logo"), // Can be a URL or CDN key

  createdAt: timestamp("created_at").defaultNow().notNull(),

  metadata: json("metadata"), // for flexible data like billing plan, preferences, etc.
});
