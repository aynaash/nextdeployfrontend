import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "../schema.ts";
import { eq, and } from "drizzle-orm";
import { Adapter } from "next-auth/adapters";

export function DrizzleAdapter(): Adapter {
  return {
    async createUser(user) {
      const [newUser] = await db.insert(users).values({
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role || "USER", // default role
      }).returning();
      
      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
        image: newUser.image,
        role: newUser.role as UserRole,
      };
    },

    async getUser(id) {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || null;
    },

    async getUserByEmail(email) {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || null;
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const [result] = await db
        .select()
        .from(accounts)
        .innerJoin(users, eq(accounts.userId, users.id))
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        );
      
      return result?.user || null;
    },

    async updateUser(user) {
      const [updatedUser] = await db
        .update(users)
        .set(user)
        .where(eq(users.id, user.id))
        .returning();
      
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        role: updatedUser.role as UserRole,
      };
    },

    async deleteUser(id) {
      await db.delete(users).where(eq(users.id, id));
    },

    async linkAccount(account) {
      await db.insert(accounts).values({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      });
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        );
    },

    async createSession(session) {
      const [newSession] = await db.insert(sessions).values({
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: session.expires,
      }).returning();
      
      return newSession;
    },

    async getSessionAndUser(sessionToken) {
      const [result] = await db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.sessionToken, sessionToken));
      
      if (!result) return null;
      
      return {
        session: result.session,
        user: result.user,
      };
    },

    async updateSession(session) {
      const [updatedSession] = await db
        .update(sessions)
        .set({
          sessionToken: session.sessionToken,
          expires: session.expires,
        })
        .where(eq(sessions.sessionToken, session.sessionToken))
        .returning();
      
      return updatedSession;
    },

    async deleteSession(sessionToken) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },

    async createVerificationToken(token) {
      const [newToken] = await db.insert(verificationTokens).values(token).returning();
      return newToken;
    },

    async useVerificationToken({ identifier, token }) {
      try {
        const [deletedToken] = await db
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, identifier),
              eq(verificationTokens.token, token)
            )
          )
          .returning();
        
        return deletedToken || null;
      } catch (error) {
        return null;
      }
    },
  };
}
