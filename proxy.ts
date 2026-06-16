// proxy.ts — Next 15 Node-runtime middleware (runs at the edge on Workers).
//
// NextDeploy's generated edge guard already enforces auth + rate-limiting from
// nextdeploy.yml BEFORE this file runs, so keep app-specific logic here (e.g.
// request shaping, custom headers). Infra bindings (DB, R2, AI, secrets) are
// reachable via getEnv() from "@/lib/env".
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("x-powered-by", "NextDeploy");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
