import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function GET(request: Request) {
  const identifier = request.headers.get("x-real-ip") || "unknown";
  const limit = await checkRateLimit(`api_${identifier}`);

  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.reset.getTime() - Date.now()) / 1000)) } }
    );
  }

  return NextResponse.json(
    { message: "Success", remaining: limit.remaining },
    {
      headers: {
        "X-RateLimit-Limit": String(MAX_TOKENS),
        "X-RateLimit-Remaining": String(limit.remaining),
        "X-RateLimit-Reset": String(Math.floor(limit.reset.getTime() / 1000)),
      },
    }
  );
}
