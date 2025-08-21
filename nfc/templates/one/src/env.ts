import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    // BetterAuth
    BETTER_AUTH_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    // Database
    DATABASE_URL: z.string().min(1),
    // Github
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    // Google
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    // Discord
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
});
