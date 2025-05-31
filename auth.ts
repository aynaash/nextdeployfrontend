
import { db } from "./lib/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth, type BetterAuthOptions } from "better-auth";
// import { resend } from "./lib/auth/authUtils";
// import { reactInvitationEmail, reactResetPasswordEmail } from "./lib/auth/authUtils";
import { Stripe } from "stripe";
import { stripe } from "@better-auth/stripe";
import * as schema from "./drizzle/schema/schema"
// Plugins
import {
  admin,
  bearer,
  multiSession,
  organization,
  twoFactor,
  openAPI,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;
const FROM_EMAIL = process.env.BETTER_AUTH_EMAIL || "no-reply@yourdomain.com";
const TEST_EMAIL = process.env.TEST_EMAIL;
const STRIPE_KEY = process.env.STRIPE_API_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
if (!BETTER_AUTH_URL || !STRIPE_KEY || !STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing required environment variables");
}
const adapter = drizzleAdapter(db, {
  provider: "pg",
  schema,
});
// Pricing IDs
const PRICING_IDS = {
  professional: {
    default: "price_live_PRO",
    annual: "price_live_PRO_ANNUAL",
  },
  starter: {
    default: "price_live_STARTER",
    annual: "price_live_STARTER_ANNUAL",
  },
};

export const auth = betterAuth({
  appName: "NextDeploy",
  baseURL: BETTER_AUTH_URL,
  
  // Database configuration
  database: adapter,

  // Session management
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // Email verification
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        console.log("Sent the verification email")
        //await resend.emails.send({
         // from: FROM_EMAIL,
          //to: user.email,
          //subject: "Verify your NextDeploy account",
         // html: `<a href="${url}">Click here to verify your email</a>`,
       // });
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
        // await resend.emails.send({
        //   from: FROM_EMAIL,
        //   to: user.email,
        //   subject: "Reset your NextDeploy password",
        //   react: reactResetPasswordEmail({
        //     username: user.email,
        //     resetLink: url,
        //   }),
        // });
        console.log("Sent the reset password email")
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
      redirectURI: `${BETTER_AUTH_URL}/api/auth/callback/google`,
      prompt: "select_account",
    },
  },

  // Account linking
  account: {
    accountLinking: {
      trustedProviders: ["google", "github"],
    },
  },

  // Plugins
  plugins: [
    // Core plugins first
    bearer(),
    openAPI(),

    // Authentication enhancements
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          // await resend.emails.send({
          //   from: FROM_EMAIL,
          //   to: user.email,
          //   subject: "Your NextDeploy OTP Code",
          //   html: `Your verification code is: <strong>${otp}</strong>`,
         /*  }); */
        console.log("Sent the OTP email")
        },
      },
    }),
    passkey(),

    // Organization features
    organization({
      sendInvitationEmail: async (data) => {
        // await resend.emails.send({
        //   from: FROM_EMAIL,
        //   to: data.email,
        //   subject: `Invitation to join ${data.organization.name} on NextDeploy`,
        //   react: reactInvitationEmail({
        //     username: data.email,
        //     invitedByUsername: data.inviter.user.name || data.inviter.user.email,
        //     invitedByEmail: data.inviter.user.email,
        //     teamName: data.organization.name,
        //     inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${data.id}`,
        //   }),
        // });
        console.log("Sent the invitation email")
      },
    }),

    // Admin features
    admin({
      adminUserIds: process.env.ADMIN_USER_IDS?.split(",") || [],
    }),

    // Multi-session support
    multiSession(),

    // Stripe integration
    stripe({
      stripeClient: new Stripe(STRIPE_KEY),
      stripeWebhookSecret: STRIPE_WEBHOOK_SECRET,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "Starter",
            priceId: PRICING_IDS.starter.default,
            annualDiscountPriceId: PRICING_IDS.starter.annual,
            freeTrial: { days: 7 },
          },
          {
            name: "Professional",
            priceId: PRICING_IDS.professional.default,
            annualDiscountPriceId: PRICING_IDS.professional.annual,
          },
          {
            name: "Enterprise",
            customPricing: true,
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
