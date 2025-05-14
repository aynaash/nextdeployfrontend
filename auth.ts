import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";
import authConfig from "./drizzle/auth/auth.config.ts";
import { UserRole } from "./schema";
import { checkRateLimit } from "./lib/auth/rate-limit";
import { sendVerificationEmail } from "./lib/auth/email-verification";
import { generateTwoFactorSecret, verifyTwoFactorToken } from "./lib/auth/two-factor.ts";

declare module "better-auth" {
  interface User {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    twoFactorSecret?: string;
    twoFactorBackupCodes?: string[];
  }

  interface Session {
    user: {
      role: UserRole;
      isTwoFactorEnabled: boolean;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = betterAuth({
  database : drizzleAdapter(db, {
    tables: {
      users,
      accounts,
      sessions,
      verificationTokens,
    },
    async getUserByEmail(email) {
      return db.query.users.findFirst({
        where: eq(users.email, email),
      });
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const result = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId)
        ),
        with: {
          user: true,
        },
      });
      return result?.user ?? null;
    },
  }),

  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
    twoFactor: "/auth/two-factor",
  },

  providers: [
    ...authConfig.providers,
    // Add any additional providers here
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Rate limiting
      const rateLimit = await checkRateLimit(user.email ?? account?.providerAccountId ?? "unknown");
      if (!rateLimit.success) {
        throw new Error("Too many attempts. Please try again later.");
      }

      // Handle OAuth providers
      if (account?.provider !== "credentials") {
        if (account.provider === "google" && !profile?.email_verified) {
          return false;
        }
        return true;
      }

      // Credentials provider flow
      if (!user.emailVerified) {
        await sendVerificationEmail(user.email!);
        return "/auth/verify-request";
      }

      if (user.isTwoFactorEnabled) {
        return "/auth/two-factor";
      }

      return true;
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.isTwoFactorEnabled = user.isTwoFactorEnabled;
        token.email = user.email;
      }

      if (trigger === "update") {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.sub!),
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.isTwoFactorEnabled = dbUser.isTwoFactorEnabled;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.id = token.sub!;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      if (!user.emailVerified && user.email) {
        await sendVerificationEmail(user.email);
      }
    },

    async linkAccount({ user, account }) {
      if (account.provider !== "credentials") {
        await db
          .update(users)
          .set({ emailVerified: new Date() })
          .where(eq(users.id, user.id));
      }
    },
  },
// plural 
  usePlural: true,
  // 2FA Configuration
  twoFactor: {
    secret: {
      generate: async (user) => {
        const { secret, uri } = await generateTwoFactorSecret(user.email!);
        return { secret, uri };
      },
      verify: async (user, token) => {
        return verifyTwoFactorToken(user.email!, token);
      },
    },
    backupCodes: {
      generate: async (user) => {
        return Array.from({ length: 8 }, () =>
          crypto.randomBytes(4).toString("hex").toUpperCase()
        );
      },
    },
  },

  // Password Reset Configuration
  passwordReset: {
    token: {
      expiresAfterMinutes: 60,
      generate: async (user) => {
        return crypto.randomBytes(32).toString("hex");
      },
    },
    sendEmail: async (email, token) => {
      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
      // Implement your email sending logic
      console.log(`Password reset URL: ${resetUrl}`);
    },
  },

  // Verification Email Configuration
  emailVerification: {
    token: {
      expiresAfterMinutes: 1440, // 24 hours
      generate: async (email) => {
        return crypto.randomBytes(32).toString("hex");
      },
    },
    sendEmail: async (email, token) => {
      const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
      // Implement your email sending logic
      console.log(`Verification URL: ${verifyUrl}`);
    },
  },

  ...authConfig,
});
