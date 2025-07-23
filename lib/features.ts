// import { db } from './db';
// import { featureFlags } from './schema';
// import { eq, and, or } from 'drizzle-orm';
//
// export async function isFeatureEnabled(
//   featureName: string,
//   userId?: string,
//   teamId?: string
// ): Promise<boolean> {
//   const [flag] = await db.select()
//     .from(featureFlags)
//     .where(eq(featureFlags.name, featureName))
//     .limit(1);
//
//   if (!flag) return false;
//   if (!flag.isEnabled) return false;
//
//   // Check if user is explicitly enabled
//   if (userId && flag.userIds?.includes(userId)) {
//     return true;
//   }
//
//   // Check if team is explicitly enabled
//   if (teamId && flag.teamIds?.includes(teamId)) {
//     return true;
//   }
//
//   // Check rollout percentage
//   if (flag.rolloutPercentage > 0) {
//     const hash = userId ?
//       cyrb53(userId) :
//       Math.floor(Math.random() * 100);
//     return (hash % 100) < flag.rolloutPercentage;
//   }
//
//   return flag.isEnabled;
// }
//
// // Simple hash function for consistent user bucketing
// function cyrb53(str: string, seed = 0) {
//   let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
//   for (let i = 0, ch; i < str.length; i++) {
//     ch = str.charCodeAt(i);
//     h1 = Math.imul(h1 ^ ch, 2654435761);
//     h2 = Math.imul(h2 ^ ch, 1597334677);
//   }
//   h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
//   h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
//   return 4294967296 * (2097151 & h2) + (h1 >>> 0);
// }
