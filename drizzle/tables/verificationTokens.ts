
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier"),
  token: text("token").unique(),
  expires: timestamp("expires"),
  tenantId: text("tenantId"),
});
