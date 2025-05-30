import { auth } from "../auth.ts";
import { cache } from "react";
import { headers } from "next/headers";
import type { User } from "../../lib/types";

export const getCurrentUser = cache(async (): Promise<User | undefined> => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    console.warn("No user in session.");
    return undefined;
  }

  // You'll need to fetch the role from your database here
  // This is a placeholder - implement your actual database query
  const userWithRole = await fetchUserFromDatabase(session.user.id);

  const user: User = {
    ...session.user,
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    emailVerified: null, // Set from your database if available
    createdAt: new Date(), // Set from your database
    updatedAt: new Date(), // Set from your database
    image: session.user.image || null,
    role: userWithRole?.role || 'user' // Default role if not set
  };

  console.info("Authenticated user:", user);
  return user;
});

// Placeholder function - implement your actual database query
async function fetchUserFromDatabase(userId: string) {
  // Example using Prisma:
  // return await prisma.user.findUnique({
  //   where: { id: userId },
  //   select: { role: true, emailVerified: true, createdAt: true }
  // });
  return { role: 'user' }; // Temporary implementation
}
