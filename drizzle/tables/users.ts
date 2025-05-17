import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { userRoleEnum } from "../enums";

export const users = pgTable("users", {
  id: text("id", {length:36}).primaryKey().$defaultFn(()=> randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").default("USER"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tenantId: text("tenantId"),
  banned:
});
