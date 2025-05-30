import { auth } from "../../auth.ts";
import { cache } from "react";
import { headers } from "next/headers";

export const getCurrentUser = cache(async () => {
  const requestHeaders = headers();
  console.log("Request headers at session.ts:", requestHeaders);

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  console.log("Session returned from Better Auth at session.ts:", session);

  if (!session?.user) {
    console.warn("No user in session.");
    return undefined;
  }

  console.info("Authenticated user at session.ts is:", session.user);
  return session.user;
});
