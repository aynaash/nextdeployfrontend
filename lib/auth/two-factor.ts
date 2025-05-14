import { authenticator } from "otplib";
import { db } from "../db.ts";
import { users } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";

export function generateTwoFactorSecret() {
  return authenticator.generateSecret();
}

export async function enableTwoFactorAuth(userId: string) {
  return db
    .update(users)
    .set({ isTwoFactorEnabled: true })
    .where(eq(users.id, userId));
}

export async function disableTwoFactorAuth(userId: string) {
  return db
    .update(users)
    .set({
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
    })
    .where(eq(users.id, userId));
}

export async function verifyTwoFactorToken(userId: string, token: string) {
  const [user] = await db
    .select({ twoFactorSecret: users.twoFactorSecret })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user?.twoFactorSecret) return false;

  return authenticator.verify({
    token,
    secret: user.twoFactorSecret,
  });
}
