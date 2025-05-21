import { pgTable, text } from "drizzle-orm/pg-core";

export const userAccount = pgTable("user_account", {
  id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  userId: text("userId"),
  accountId: text("accountId"),
  tenantId: text("tenantId"),
});
