import { NextResponse, type NextRequest } from 'next/server';

/**
 * Generates a very basic RFC4122 v4 UUID
 * (Not cryptographically strong, but works for tracing and correlation)
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0; // get random int from 0 to 15
    const v = c === 'x' ? r : (r & 0x3) | 0x8; // version bits
    return v.toString(16); // convert to hex
  });
}

// 🔥 Middleware: entrypoint for all requests
export async function middleware(request: NextRequest) {
  // 🧠 Start timer to measure how long request takes
  const start = Date.now();

  // 🧾 Generate unique ID for this request (for logs, trace, errors)
  const correlationId = generateUUID();

  // 🧠 Log the request method and path — basic insight into request traffic
  console.log(`[${correlationId}] → ${request.method} ${request.nextUrl.pathname}`);

  // 🛑 Short-circuit if request is for static assets (skip extra work)
  if (isStaticFile(request)) {
    console.log(`[${correlationId}] ⏭ Static file, skipping`);
    return NextResponse.next();
  }

  // 🧱 Log basic metadata — user agent is useful for debugging real-world issues
  const userAgent = request.headers.get('user-agent') || 'unknown';
  console.log(`[${correlationId}] 📦 User Agent: ${userAgent}`);

  // ⚠️ In real world, you’d check auth/session here (skipped for now)
  // const session = await getSession(request) ...

  // ✅ Final response if all checks passed
  const response = NextResponse.next();

  // ➕ Add correlation ID to response headers for tracing in frontend/backend logs
  response.headers.set('x-correlation-id', correlationId);

  // 🧠 Measure duration and log it — very helpful for debugging slow requests
  const duration = Date.now() - start;
  console.log(`[${correlationId}] ✅ Done in ${duration}ms`);

  return response;
}

// 🎯 Helper to detect if file is static (skip logging/auth/etc)
function isStaticFile(req: NextRequest): boolean {
  return [
    '/not-found',
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
    '/static/',
    '/assets/',
    '/robots.txt',
    '/sitemap.xml',
  ].some((prefix) => req.nextUrl.pathname.startsWith(prefix));
}
