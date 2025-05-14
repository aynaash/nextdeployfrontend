// middleware.ts
import { NextResponse } from "next/server";
import { checkRateLimit } from "./lib/auth/rate-limit.ts";

export async function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
  const path = request.nextUrl.pathname;

  // Apply rate limiting to API routes
  if (path.startsWith("/api")) {
    const limit = await checkRateLimit(`api_${ip}_${path}`);
    
    if (!limit.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          retryAfter: Math.ceil(
            (limit.reset.getTime() - Date.now()) / 1000
          ),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(
              Math.ceil((limit.reset.getTime() - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(MAX_TOKENS));
    response.headers.set("X-RateLimit-Remaining", String(limit.remaining));
    response.headers.set("X-RateLimit-Reset", String(Math.floor(limit.reset.getTime() / 1000)));
    return response;
  }

  return NextResponse.next();
}
