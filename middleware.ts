import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { headers as nextHeaders } from "next/headers";

/**
 * Interface for logging context that will be passed to all logging functions
 * Includes correlationId for request tracing and optional userId for authenticated requests
 */
interface LogContext {
  correlationId: string;
  userId?: string;
  [key: string]: any; // Allows additional properties
}

/**
 * Interface defining our logger methods
 * Includes request logging, error logging, and authentication attempt logging
 */
interface RequestLogger {
  logRequest: (req: NextRequest, context: LogContext) => void;
  logError: (req: NextRequest, error: Error, context: LogContext) => void;
  logAuthAttempt: (req: NextRequest, success: boolean, context: LogContext) => void;
}

/**
 * Implementation of our logger with structured logging
 * In production, you would replace console logs with actual logging service calls
 */
const logger: RequestLogger = {
  logRequest: (req, context) => {
    // Get client IP from various possible headers
    const ip = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Structure our log data with consistent fields
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'info',
      type: 'request',
      method: req.method,
      path: req.nextUrl.pathname,
      ip,
      userAgent,
      ...context // Spread in any additional context
    };

    console.log(JSON.stringify(logData));
    // In production: sendToLoggingService(logData);
  },

  logError: (req, error, context) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'error',
      type: 'middleware_error',
      method: req.method,
      path: req.nextUrl.pathname,
      ip,
      error: {
        name: error.name,
        message: error.message,
        // Only include stack trace in development for security
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      ...context
    };

    console.error(JSON.stringify(logData));
    // In production: sendToErrorTrackingService(logData);
  },

  logAuthAttempt: (req, success, context) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    
    const logData = {
      timestamp: new Date().toISOString(),
      level: success ? 'info' : 'warn',
      type: 'auth_attempt',
      method: req.method,
      path: req.nextUrl.pathname,
      ip,
      success,
      ...context
    };

    console.log(JSON.stringify(logData));
  }
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 100; // Max 100 requests per window
const rateLimitCache = new Map<string, { count: number, lastReset: number }>();

export async function middleware(request: NextRequest) {
  const start = Date.now(); // Track request start time for performance monitoring
  const correlationId = crypto.randomUUID(); // Unique ID for request tracing
  const context: LogContext = { correlationId }; // Initialize logging context

  try {
    // Rate limiting (only in production)
    if (process.env.NODE_ENV === 'production') {
      const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
      const currentTime = Date.now();

      // Get or initialize rate limit record for this IP
      let record = rateLimitCache.get(ip);
      if (!record || currentTime - record.lastReset > RATE_LIMIT_WINDOW_MS) {
        record = { count: 0, lastReset: currentTime };
        rateLimitCache.set(ip, record);
      }

      // Increment request count and check against limit
      record.count++;
      if (record.count > RATE_LIMIT_MAX_REQUESTS) {
        const retryAfterSeconds = Math.ceil(
          (RATE_LIMIT_WINDOW_MS - (currentTime - record.lastReset)) / 1000
        );
        
        logger.logRequest(request, {
          ...context,
          status: 429,
          reason: 'Rate limit exceeded'
        });

        return new NextResponse(
          JSON.stringify({ 
            error: 'Too many requests',
            retryAfter: retryAfterSeconds
          }), 
          {
            status: 429,
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': String(retryAfterSeconds),
              'x-correlation-id': correlationId
            }
          }
        );
      }
    }

    // Set correlation ID header for downstream services
    request.headers.set('x-correlation-id', correlationId);
    const requestHeaders = new Headers(request.headers);

    // Log the incoming request
    logger.logRequest(request, context);

    // Define route categories
    const protectedRoutes = ['/dashboard', '/account', '/settings', '/admin'];
    const publicRoutes = ['/', '/login', '/signup', '/api/public', '/healthcheck'];
    
    // Check if current path is protected or public
    const isProtected = protectedRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    );
    const isPublic = publicRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    );

    // Skip middleware for public routes and static files
    if (!isProtected || isPublic) {
      const response = NextResponse.next();
      response.headers.set('x-correlation-id', correlationId);
      return response;
    }

    // Authentication check for protected routes
    const cookie = getSessionCookie(request);
    if (!cookie) {
      logger.logAuthAttempt(request, false, {
        ...context,
        status: 302,
        reason: 'Unauthorized - no session cookie'
      });
      // Redirect to login with return URL for better UX
      return NextResponse.redirect(
        new URL(`/login?returnUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url)
      );
    }

    // Session validation with the specified method
    try {
      // Fetch session using the exact method you specified
      const session = await auth.api.getSession({
        query: {
          disableCookieCache: true, // Ensure fresh session data
        },
        headers: requestHeaders // Pass through all headers
      });

      if (!session?.user) {
        logger.logAuthAttempt(request, false, {
          ...context,
          status: 403,
          reason: 'Forbidden - invalid session'
        });
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Role-based access control
      const requiredRoles = getRequiredRoles(request.nextUrl.pathname);
      if (requiredRoles.length > 0 && !requiredRoles.some(role => session.user?.roles?.includes(role))) {
        logger.logAuthAttempt(request, false, {
          ...context,
          status: 403,
          reason: 'Forbidden - insufficient permissions',
          requiredRoles,
          userRoles: session.user?.roles
        });
        return NextResponse.redirect(new URL('/forbidden', request.url));
      }

      // Successful authentication
      logger.logAuthAttempt(request, true, {
        ...context,
        userId: session.user.id,
        userRoles: session.user.roles
      });

      // Prepare response with user context headers
      const response = NextResponse.next();
      response.headers.set('x-correlation-id', correlationId);
      response.headers.set('x-user-id', session.user.id);
      response.headers.set('x-user-roles', session.user.roles?.join(',') || '');
      response.headers.set('x-user-email', session.user.email || '');

      // Special headers for streaming endpoints
      if (request.nextUrl.pathname.startsWith('/api/stream')) {
        response.headers.set('Content-Type', 'text/event-stream');
        response.headers.set('Cache-Control', 'no-cache');
        response.headers.set('Connection', 'keep-alive');
      }

      return response;
    } catch (authError) {
      logger.logError(request, authError as Error, context);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    // Handle unexpected errors
    logger.logError(request, error as Error, context);

    // Return JSON error for API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json(
        { 
          error: 'Internal Server Error',
          correlationId,
          timestamp: new Date().toISOString()
        },
        { 
          status: 500, 
          headers: { 
            'x-correlation-id': correlationId,
            'Content-Type': 'application/json'
          } 
        }
      );
    }

    // Redirect to error page for non-API routes
    return NextResponse.redirect(
      new URL(`/error?correlationId=${correlationId}`, request.url)
    );
  } finally {
    // Log request completion with duration
    const duration = Date.now() - start;
    logger.logRequest(request, {
      ...context,
      duration,
      status: 200 // This would be updated based on actual response status
    });
  }
}

/**
 * Helper function to determine required roles for a given path
 * This implements your role-based access control logic
 */
function getRequiredRoles(path: string): string[] {
  if (path.startsWith('/admin')) return ['admin'];
  if (path.startsWith('/settings')) return ['user', 'admin'];
  if (path.startsWith('/dashboard')) return ['user'];
  return [];
}

export const config = {
  matcher: [
    // Match all paths except:
    // - Next.js internal paths
    // - Static files
    // - Public routes
    // - Health check endpoint
    '/((?!_next/static|_next/image|favicon.ico|public|healthcheck).*)',
  ],
};
