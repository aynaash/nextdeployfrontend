
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
export const plans = pgTable("plans", {
  id: text("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  price: float4("price").notNull(),
  interval: text("interval").default("monthly"),
  stripePriceId: text("stripe_price_id").notNull(),
  features: jsonb("features").notNull(), // array of strings or structured
  createdAt: timestamp("created_at").defaultNow(),
});

export const planPriceIdx = index("plan_price_idx").on(plans.price);
