import { betterAuth } from "better-auth";
import {
  bearer,
  admin,
  multiSession,
  organization,
  twoFactor,
  oneTap,
  oAuthProxy,
  openAPI,
  oidcProvider,
  customSession,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { reactInvitationEmail } from "./lib/auth/authUtils.ts";
import { reactResetPasswordEmail } from "./lib/auth/authUtils.ts";
import { resend } from "./lib/auth/authUtils.ts";
import { MysqlDialect } from "kysely"; // Only for MySQL, skipped in this config
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { stripe } from "@better-auth/stripe";
import { Stripe } from "stripe";

const from = process.env.BETTER_AUTH_EMAIL || "support@nextdeploy.dev";
const to = process.env.TEST_EMAIL || "";

// ✅ PostgreSQL dialect only
const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.POSTGRES_URL!,
  }),
});

// Pricing IDs
const PROFESSION_PRICE_ID = {
  default: "price_live_PRO",
  annual: "price_live_PRO_ANNUAL",
};

const STARTER_PRICE_ID = {
  default: "price_live_STARTER",
  annual: "price_live_STARTER_ANNUAL",
};

export const auth = betterAuth({
  appName: "NextDeploy Auth",
  database: {
    dialect,
    type: "postgres",
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Verify your email",
        html: `<a href="${url}">Click here to verify your email</a>`,
      });
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["google", "github"],
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Reset your password",
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      prompt:"select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        await resend.emails.send({
          from,
          to: data.email,
          subject: "You're invited to NextDeploy",
          react: reactInvitationEmail({
            username: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${data.id}`,
          }),
        });
      },
    }),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          await resend.emails.send({
            from,
            to: user.email,
            subject: "Your OTP",
            html: `Your One-Time Password is: <strong>${otp}</strong>`,
          });
        },
      },
    }),
    passkey(),
    openAPI(),
    bearer(),
    admin({
      adminUserIds: ["your-admin-user-id"],
    }),
    multiSession(),
    oAuthProxy(),
    nextCookies(),
    oidcProvider({ loginPage: "/sign-in" }),
    oneTap(),
    customSession(async (session) => ({
      ...session,
      user: {
        ...session.user,
        plan: "starter",
      },
    })),
    stripe({
      stripeClient: new Stripe(process.env.STRIPE_KEY!),
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "Starter",
            priceId: STARTER_PRICE_ID.default,
            annualDiscountPriceId: STARTER_PRICE_ID.annual,
            freeTrial: { days: 7 },
          },
          {
            name: "Professional",
            priceId: PROFESSION_PRICE_ID.default,
            annualDiscountPriceId: PROFESSION_PRICE_ID.annual,
          },
          {
            name: "Enterprise",
          },
        ],
      },
    }),
  ],
  trustedOrigins: ["https://nextdeploy.dev"],
});
