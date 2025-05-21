 
import {
  pgTable,
  text,
  integer,
  boolean,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./user";

// Define enums
export const deviceTypeEnum = pgEnum("device_type", ["singleDevice", "multiDevice"]);
export const transportsEnum = pgEnum("transports", ["usb", "nfc", "ble", "internal"]);

export const authenticator = pgTable(
  "authenticator",
  {
    credentialID: text("credential_id").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerAccountId: text("provider_account_id").notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: deviceTypeEnum("credential_device_type").notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: text("transports").array(), // stores array of strings
  },
  (authenticator) => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ]
);
