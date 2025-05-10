import { pgTable, text } from "drizzle-orm/pg-core";

export const userAccounts = pgTable("user_accounts", {
  id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  userId: text("userId"),
  accountId: text("accountId"),
  tenantId: text("tenantId"),
});
