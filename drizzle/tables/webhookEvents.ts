
import { pgTable, text, timestamp, jsonb, boolean, index, integer } from "drizzle-orm/pg-core";

export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),

  tenantId: text("tenant_id").notNull(),

  source: text("source").notNull(), // e.g., 'github', 'stripe', 'vercel'

  eventType: text("event_type").notNull(), // 🆕 e.g., 'deployment.success'

  uniqueRequestId: text("unique_request_id").notNull(), // 🆕 idempotency key

  payload: jsonb("payload").notNull(),

  processed: boolean("processed").default(false),

  responseStatus: integer("response_status"), // 🆕 capture HTTP status codes

  receivedAt: timestamp("received_at").defaultNow(),
  processedAt: timestamp("processed_at"), // 🆕

}, (table) => {
  return {
    webhookSourceIdx: index("webhook_source_idx").on(table.source),
    uniqueReqIdx: index("webhook_request_idx").on(table.uniqueRequestId), // 🆕 fast lookup
  };
});
