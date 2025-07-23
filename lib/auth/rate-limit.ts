// import { db } from "../db.ts";
// import { rateLimits } from "../../drizzle/schema.ts";
// import { eq } from "drizzle-orm";
//
// const REFILL_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
// const MAX_TOKENS = 10;
//
// export async function checkRateLimit(identifier: string) {
//   // First try to update existing record
//   const now = new Date();
//   const lastRefillThreshold = new Date(now.getTime() - REFILL_INTERVAL);
//
//   // Attempt to refill tokens if enough time has passed
//   const updateResult = await db
//     .update(rateLimits)
//     .set({
//       tokens: sql`CASE
//         WHEN ${rateLimits.lastRefill} <= ${lastRefillThreshold}
//         THEN ${MAX_TOKENS} - 1
//         ELSE ${rateLimits.tokens} - 1
//       END`,
//       lastRefill: sql`CASE
//         WHEN ${rateLimits.lastRefill} <= ${lastRefillThreshold}
//         THEN ${now}
//         ELSE ${rateLimits.lastRefill}
//       END`,
//       updatedAt: now,
//     })
//     .where(eq(rateLimits.identifier, identifier))
//     .returning();
//
//   if (updateResult.length > 0) {
//     const record = updateResult[0];
//     if (record.tokens >= 0) {
//       return {
//         success: true,
//         remaining: record.tokens,
//         reset: new Date(record.lastRefill.getTime() + REFILL_INTERVAL),
//       };
//     }
//   }
//
//   // If no existing record, create one
//   if (updateResult.length === 0) {
//     const [newRecord] = await db
//       .insert(rateLimits)
//       .values({
//         identifier,
//         tokens: MAX_TOKENS - 1,
//         lastRefill: now,
//       })
//       .returning();
//
//     return {
//       success: true,
//       remaining: newRecord.tokens,
//       reset: new Date(now.getTime() + REFILL_INTERVAL),
//     };
//   }
//
//   // If we get here, the token count was negative (rate limited)
//   const [record] = await db
//     .select()
//     .from(rateLimits)
//     .where(eq(rateLimits.identifier, identifier));
//
//   return {
//     success: false,
//     remaining: 0,
//     reset: new Date(record.lastRefill.getTime() + REFILL_INTERVAL),
//   };
// }
//
// export async function getRateLimit(identifier: string) {
//   const [record] = await db
//     .select()
//     .from(rateLimits)
//     .where(eq(rateLimits.identifier, identifier));
//
//   if (!record) return null;
//
//   const now = new Date();
//   const timeSinceRefill = now.getTime() - record.lastRefill.getTime();
//   const refillCount = Math.floor(timeSinceRefill / REFILL_INTERVAL);
//   const tokens = Math.min(
//     MAX_TOKENS,
//     record.tokens + refillCount
//   );
//
//   return {
//     tokens,
//     lastRefill: record.lastRefill,
//     reset: new Date(record.lastRefill.getTime() + REFILL_INTERVAL),
//   };
// }
//
// export async function resetRateLimit(identifier: string) {
//   await db
//     .delete(rateLimits)
//     .where(eq(rateLimits.identifier, identifier));
// }
