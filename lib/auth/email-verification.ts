// lib/auth/email-verification.ts
import { db } from "../db.ts";
import { verificationTokens, users } from "../../drizzle/schema.ts";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Delete any existing tokens
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, email));

  // Create new token
  await db.insert(verificationTokens).values({
    identifier: email,
    token,
    expires,
  });

  return token;
}

export async function verifyVerificationToken(token: string) {
  const [existingToken] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token))
    .limit(1);

  if (!existingToken) return null;

  // Delete token after verification
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, existingToken.id));

  // Check if token expired
  if (new Date(existingToken.expires) < new Date()) return null;

  // Update user's email verification status
  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, existingToken.identifier));

  return existingToken.identifier; // returns the verified email
}
