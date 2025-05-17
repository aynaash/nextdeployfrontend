
import { pgTable, text, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { user } from "./users.ts";
import { randomUUID } from "crypto";

export const passkey = pgTable("passkey", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  // Human-readable name for the device
  name: text("name"),

  // PublicKeyCredentialRawId base64url string or Buffer encoded as hex
  credentialID: text("credential_id").notNull(),

  // WebAuthn public key
  publicKey: text("public_key").notNull(),

  // Replay protection
  counter: integer("counter").notNull(),

  // Enum-like: "singleDevice" | "multiDevice"
  deviceType: text("device_type").notNull(),

  // True if passkey is synced/backed up
  backedUp: boolean("backed_up").notNull(),

  // Optional list of transport methods: ["usb", "nfc", "ble", "internal"]
  transports: json("transports"), // array of strings

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow()
});
