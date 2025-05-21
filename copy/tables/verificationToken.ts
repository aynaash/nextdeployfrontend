
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const verificationToken = pgTable("verification_token", {
  identifier: text("identifier"),
  token: text("token").unique(),
  expires: timestamp("expires"),
  tenantId: text("tenantId"),
});
