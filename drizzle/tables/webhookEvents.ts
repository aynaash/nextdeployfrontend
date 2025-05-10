
import { pgTable, text, timestamp,jsonb,boolean, integer } from "drizzle-orm/pg-core";
export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  source: text("source").notNull(),
  payload: jsonb("payload").notNull(),
  receivedAt: timestamp("received_at").defaultNow(),
  processed: boolean("processed").default(false),
  tenantId: text("tenant_id").notNull(),
});

export const webhookSourceIdx = index("webhook_source_idx").on(webhookEvents.source);
