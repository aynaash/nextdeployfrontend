
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { headers as nextHeaders } from "next/headers";

interface RequestLogger {
  logRequest: (req: NextRequest, meta?: Record<string, any>) => void;
  logError: (req: NextRequest, error: Error, meta?: Record<string, any>) => void;
}

const logger: RequestLogger = {
  logRequest: (req, meta = {}) => {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
    const log = {
      timestamp: new Date().toISOString(),
      type: "request",
      ip,
      method: req.method,
      path: req.nextUrl.pathname,
      ...meta,
    };
    console.log(JSON.stringify(log));
    // Optionally: streamLogToService(log);
  },

  logError: (req, error, meta = {}) => {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
    const log = {
      timestamp: new Date().toISOString(),
      type: "error",
      ip,
      path: req.nextUrl.pathname,
      error: {
        message: error.message,
        stack: error.stack,
      },
      ...meta,
    };
    console.error(JSON.stringify(log));
    // Optionally: streamErrorToService(log);
  },
};

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const correlationId = crypto.randomUUID();

  try {
    request.headers.set("x-correlation-id", correlationId);

    logger.logRequest(request, { correlationId });

    const protectedRoutes = ["/dashboard"];
    const isProtected = protectedRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    );

    if (isProtected) {
      const cookie = getSessionCookie(request);
      if (!cookie) {
        logger.logRequest(request, {
          correlationId,
          status: 302,
          reason: "Unauthorized - no session",
        });
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Optional: Load and validate session/roles
      const headerSet = await nextHeaders();
      const session = await auth.api.getSession({ headers: headerSet });

      if (!session || !session.user?.roles?.includes("admin")) {
        logger.logRequest(request, {
          correlationId,
          status: 403,
          reason: "Forbidden - insufficient permissions",
        });
        return NextResponse.redirect(new URL("/forbidden", request.url));
      }

      logger.logRequest(request, { correlationId, userId: session.user.id });
    }

    const response = NextResponse.next();

    // Add headers to response
    response.headers.set("x-correlation-id", correlationId);

    if (request.nextUrl.pathname.startsWith("/api/stream")) {
      response.headers.set("Content-Type", "text/event-stream");
      response.headers.set("Cache-Control", "no-cache");
      response.headers.set("Connection", "keep-alive");
    }

    const duration = Date.now() - start;
    logger.logRequest(request, { correlationId, duration });

    return response;

  } catch (error) {
    logger.logError(request, error as Error, { correlationId });

    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Internal Server Error", correlationId },
        { status: 500 }
      );
    }

    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
