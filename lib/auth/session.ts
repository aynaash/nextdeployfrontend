import { auth } from "../../auth.ts";
import { db } from "../db.ts";
import { sessions } from "../session.ts";
import { eq, lt } from "drizzle-orm";

export async function getActiveSessions(userId: string) {
  return db.query.sessions.findMany({
    where: and(
      eq(sessions.userId, userId),
      lt(sessions.expires, new Date())
    ),
  });
}

export async function revokeSession(sessionId: string) {
  return db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function revokeAllSessions(userId: string) {
  return db.delete(sessions).where(eq(sessions.userId, userId));
}
