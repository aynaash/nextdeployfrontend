import { auth } from "../auth.ts";
import { cache } from "react";
import { headers } from "next/headers";

export const getCurrentUser = cache(async () => {
  const requestHeaders = await headers();

  const debugHeaders = Object.fromEntries(requestHeaders.entries());
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session?.user) {
    console.warn("No user in session.");
    return undefined;
  }
  console.info("Authenticated user:", session.user);
  return session.user;
});
