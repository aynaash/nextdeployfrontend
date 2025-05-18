import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { userRoleEnum } from "../enums";

export const users = pgTable("users", {
  id: text("id", {length:36}).primaryKey().$defaultFn(()=> randomUUID()),
  name: text("name"),
  firstName: text("first_name", { length: 100 }),
  lastName: text("last_name", { length: 100 }),
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
  banned:boolean("banned").default(false),
  banReason:text("banReason"),
  twoFactorEnabled:boolean("twoFactorEnabled").default(true)
});
