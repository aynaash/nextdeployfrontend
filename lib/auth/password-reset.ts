// import { db } from "../db.ts";
// import { passwordResetTokens, users } from "../../drizzle/schema.ts";
// import { eq } from "drizzle-orm";
// import crypto from "crypto";
// import { hash } from "bcryptjs";
//
// export async function generatePasswordResetToken(email: string) {
//   const token = crypto.randomBytes(32).toString("hex");
//   const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
//
//   // Delete any existing tokens
//   await db
//     .delete(passwordResetTokens)
//     .where(eq(passwordResetTokens.email, email));
//
//   // Create new token
//   await db.insert(passwordResetTokens).values({
//     email,
//     token,
//     expires,
//   });
//
//   return token;
// }
//
// export async function verifyPasswordResetToken(token: string) {
//   const [existingToken] = await db
//     .select()
//     .from(passwordResetTokens)
//     .where(eq(passwordResetTokens.token, token))
//     .limit(1);
//
//   if (!existingToken) return null;
//
//   // Delete token after verification
//   await db
//     .delete(passwordResetTokens)
//     .where(eq(passwordResetTokens.id, existingToken.id));
//
//   // Check if token expired
//   if (new Date(existingToken.expires) < new Date()) return null;
//
//   return existingToken.email;
// }
//
// export async function updateUserPassword(email: string, newPassword: string) {
//   const hashedPassword = await hash(newPassword, 12);
//   return db
//     .update(users)
//     .set({ password: hashedPassword })
//     .where(eq(users.email, email));
// }
