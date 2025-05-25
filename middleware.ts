import { auth } from "./auth.ts";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession(req);

  console.log({ session });

  if (!session) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
