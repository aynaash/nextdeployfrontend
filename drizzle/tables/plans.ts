
import { pgTable, text, timestamp, real, index, jsonb } from "drizzle-orm/pg-core";

// Defining the 'plans' table
export const plans = pgTable("plans", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name").notNull().unique(),
  price: real("price").notNull(),
  interval: text("interval").default("monthly"),
  stripePriceId: text("stripe_price_id").notNull(),
  features: jsonb("features").notNull(), // array of strings or structured
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  // Correctly using the 'table' parameter here
  return {
    planPriceIdx: index("plan_price_idx").on(table.price), // Use `table` here, not `plans`
  };
});
