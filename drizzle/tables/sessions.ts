
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  sessionToken: text("sessionToken").unique(),
  userId: text("userId"),
  expires: timestamp("expires"),
  tenantId: text("tenantId"),
});
