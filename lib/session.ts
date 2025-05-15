import { auth } from "../auth.ts";
import { cache } from "react";
import { headers } from "next/headers";

export const getCurrentUser = cache(async () => {
 
const requestHeaders = headers();
const debugHeaders = Object.fromEntries(requestHeaders.entries());
console.log("Request headers at session.ts:", debugHeaders);
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  console.log("Session returned from Better Auth at session.ts:", session);

  if (!session?.user) {
    console.warn("No user in session.");
    return undefined;
  }

  console.info("Authenticated user:", session.user);
  return session.user;
});

