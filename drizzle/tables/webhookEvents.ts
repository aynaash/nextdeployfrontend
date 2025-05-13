
import { pgTable, text, timestamp, jsonb, boolean, index } from "drizzle-orm/pg-core";

// Define the 'webhook_events' table
export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  source: text("source").notNull(),
  payload: jsonb("payload").notNull(),
  receivedAt: timestamp("received_at").defaultNow(),
  processed: boolean("processed").default(false),
  tenantId: text("tenant_id").notNull(),
}, (table) => {
  // Define index inside the schema block
  return {
    webhookSourceIdx: index("webhook_source_idx").on(table.source), // Must use `table.source` here
  };
});
