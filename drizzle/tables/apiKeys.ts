
import { pgTable, text, timestamp, integer ,boolean, varchar} from "drizzle-orm/pg-core";
import {users} from "./users.ts"
export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey().$defaultFn(()=> randomUUID()),
  userId:text("user_id").notNull().references(() => users.id),
  key: varchar("key", { length: 255 }).notNull(),
  label: varchar("label", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  revoked: boolean("revoked").default(false),
});
