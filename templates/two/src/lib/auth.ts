import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { anonymous, magicLink, openAPI } from "better-auth/plugins";
import { sendMagicLinkEmail } from "./email";


export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    socialProviders:{
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        },
    },

    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    plugins: [
        nextCookies(),
        magicLink({
            sendMagicLink: async ({ email, url }) => {
                try {
                    await sendMagicLinkEmail({ email, url });
                } catch (error) {
                    console.error('Failed to send magic link email:', error);
                    throw new Error('Failed to send magic link email');
                }
            }
        }),
        openAPI(),
        anonymous()

    ]
});
