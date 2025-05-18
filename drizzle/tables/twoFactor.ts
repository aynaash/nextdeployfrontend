
import { pgTable, text, json } from "drizzle-orm/pg-core";
import { user } from "./users.ts";
import { randomUUID } from "crypto";

export const twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  // 2FA secret (e.g., for TOTP apps like Google Authenticator)
  secret: text("secret").notNull(),

  // Store backup codes as a JSON array (["code1", "code2", ...])
  backupCodes: json("backup_codes").notNull(),

  // FK reference to the user
  userId: text("user_id").notNull().references(() => user.id, {
    onDelete: "cascade",
  }),
});
