import { auth } from "../../auth";
import { headers as nextHeaders } from "next/headers";
import { User, UserRole } from "../../lib/types";

const VALID_ROLES: UserRole[] = ["admin", "user", "super_admin"];

export async function getCurrentUser(): Promise<User | undefined> {
  try {
    const rawHeaders = await nextHeaders();

    if (!rawHeaders || typeof rawHeaders.get !== "function") {
      console.warn("Headers object is malformed or missing");
      return undefined;
    }

    // Clone headers into a real Headers instance
    const realHeaders = new Headers();

    for (const [key, value] of rawHeaders.entries()) {
      realHeaders.append(key, value);
    }

    const session = await auth.api.getSession({ headers: realHeaders });

    if (!session?.user || typeof session.user !== "object") {
      console.warn("No valid user in session");
      return undefined;
    }

    return normalizeSessionUser(session.user);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err);
    console.error("Failed to retrieve session:", errorMessage);
    return undefined;
  }
}

function normalizeSessionUser(sessionUser: any): User {
  const getOrDefault = <T>(value: T | undefined, fallback: T): T =>
    value !== undefined && value !== null ? value : fallback;

  const role = VALID_ROLES.includes(sessionUser.role as UserRole)
    ? (sessionUser.role as UserRole)
    : "user";

  return {
    id: getOrDefault(sessionUser.id, ""),
    name: getOrDefault(sessionUser.name, ""),
    email: getOrDefault(sessionUser.email, ""),
    emailVerified: getOrDefault(sessionUser.emailVerified, false),
    image: getOrDefault(sessionUser.image, null),
    firstName: sessionUser.firstName ?? undefined,
    lastName: sessionUser.lastName ?? undefined,
    role,
    banned: sessionUser.banned ?? null,
    banReason: sessionUser.banReason ?? null,
    twoFactorEnabled: getOrDefault(sessionUser.twoFactorEnabled, false),
    stripeCustomerId: sessionUser.stripeCustomerId ?? null,
    stripeSubscriptionId: sessionUser.stripeSubscriptionId ?? null,
    stripePriceId: sessionUser.stripePriceId ?? null,
    stripeCurrentPeriodEnd: sessionUser.stripeCurrentPeriodEnd ?? null,
    lastLoginAt: sessionUser.lastLoginAt ?? undefined,
    preferredLanguage: sessionUser.preferredLanguage ?? null,
    createdAt:
      sessionUser.createdAt instanceof Date
        ? sessionUser.createdAt
        : new Date(),
    updatedAt:
      sessionUser.updatedAt instanceof Date
        ? sessionUser.updatedAt
        : new Date(),
  };
}
