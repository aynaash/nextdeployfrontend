
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./lib/db";
import { users, sessions, verificationTokens } from "./drizzle/schema.ts"; // Import your Drizzle schemas
import { resend } from "./lib/auth/authUtils";
import { reactInvitationEmail, reactResetPasswordEmail } from "./lib/auth/authUtils";
import { Stripe } from "stripe";
import { stripe } from "@better-auth/stripe";
import {schema} from "./drizzle/schema.ts"
// Plugins
import {
  admin,
  bearer,
  multiSession,
  organization,
  twoFactor,
  openAPI,
  nextCookies,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

// Environment validation
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;
const FROM_EMAIL = process.env.BETTER_AUTH_EMAIL || "no-reply@yourdomain.com";
const STRIPE_KEY = process.env.STRIPE_API_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!BETTER_AUTH_URL || !STRIPE_KEY || !STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing required environment variables");
}

export const auth = betterAuth({
  appName: "NextDeploy",
  baseUrl: BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.user
    }
  }),

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // User fields configuration
  user: {
    additionalFields: {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
    },
  },

  // Email verification
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: "Verify your NextDeploy account",
          html: `<a href="${url}">Click here to verify your email</a>`,
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
        throw error;
      }
    },
  },

  // Email/password authentication
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: "Reset your NextDeploy password",
          react: reactResetPasswordEmail({
            username: user.email,
            resetLink: url,
          }),
        });
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw error;
      }
    },
  },

  // Social providers
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: `${BETTER_AUTH_URL}/api/auth/callback/github`,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUrl: `${BETTER_AUTH_URL}/api/auth/callback/google`,
      prompt: "select_account",
    },
  },
 usePlural: true,
  // Plugins
  plugins: [
    bearer(),
    openAPI(),
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: "Your NextDeploy OTP Code",
            html: `Your verification code is: <strong>${otp}</strong>`,
          });
        },
      },
    }),
    passkey(),
    organization({
      sendInvitationEmail: async (data) => {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: data.email,
          subject: `Invitation to join ${data.organization.name} on NextDeploy`,
          react: reactInvitationEmail({
            username: data.email,
            invitedByUsername: data.inviter.user.name || data.inviter.user.email,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${data.id}`,
          }),
        });
      },
    }),
    admin({
      adminUserIds: process.env.ADMIN_USER_IDS?.split(",") || [],
    }),
    multiSession(),
    stripe({
      stripeClient: new Stripe(STRIPE_KEY),
      stripeWebhookSecret: STRIPE_WEBHOOK_SECRET,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "Starter",
            priceId: process.env.STRIPE_STARTER_PRICE_ID!,
            annualDiscountPriceId: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID!,
            freeTrial: { days: 7 },
          },
          {
            name: "Professional",
            priceId: process.env.STRIPE_PRO_PRICE_ID!,
            annualDiscountPriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
          },
        ],
      },
    }),
  ],

  // Security
  trustedOrigins: [
    BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean) as string[],
} satisfies BetterAuthOptions);
