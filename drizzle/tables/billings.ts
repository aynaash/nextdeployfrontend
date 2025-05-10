
import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";
import { billingStatusEnum } from "../enums";

export const billings = pgTable("billings", {
  id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  amount: real("amount"),
  status: billingStatusEnum("status"),
  tenantId: text("tenantId"),
  userId: text("userId"),
  createdAt: timestamp("createdAt").defaultNow(),
});
