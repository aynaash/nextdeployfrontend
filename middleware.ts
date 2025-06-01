import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "./auth";
import type { User, UserRole } from "./lib/types";

/**
 * Enhanced LogContext with standardized fields
 */
interface LogContext {
  correlationId: string;
  userId?: string;
  tenantId?: string;
  userRoles?: UserRole[];
  status?: number;
  duration?: number;
  [key: string]: any;
}

/**
 * Comprehensive RequestLogger interface
 */
interface RequestLogger {
  logRequest: (req: NextRequest, context: LogContext) => void;
  logError: (req: NextRequest, error: Error, context: LogContext) => void;
  logAuthAttempt: (req: NextRequest, success: boolean, context: LogContext) => void;
  logRateLimit: (req: NextRequest, context: LogContext) => void;
  logBannedUserAttempt: (req: NextRequest, user: User, context: LogContext) => void;
}

/**
 * Production-ready logger implementation
 */
const logger: RequestLogger = {
  logRequest: (req, context) => {
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'info',
      type: 'request',
      method: req.method,
      path: req.nextUrl.pathname,
      ip: getClientIp(req),
      userAgent: req.headers.get('user-agent') || 'unknown',
      ...context
    };
    console.log(JSON.stringify(logData));
  },

  logError: (req, error, context) => {
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'error',
      type: 'middleware_error',
      method: req.method,
      path: req.nextUrl.pathname,
      ip: getClientIp(req),
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      ...context
    };
    console.error(JSON.stringify(logData));
  },

  logAuthAttempt: (req, success, context) => {
    const logData = {
      timestamp: new Date().toISOString(),
      level: success ? 'info' : 'warn',
      type: 'auth_attempt',
      method: req.method,
      path: req.nextUrl.pathname,
      ip: getClientIp(req),
      success,
      ...context
    };
    console.log(JSON.stringify(logData));
  },

  logRateLimit: (req, context) => {
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      type: 'rate_limit',
      method: req.method,
      path: req.nextUrl.pathname,
      ip: getClientIp(req),
      ...context
    };
    console.warn(JSON.stringify(logData));
  },

  logBannedUserAttempt: (req, user, context) => {
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'alert',
      type: 'banned_user_attempt',
      method: req.method,
      path: req.nextUrl.pathname,
      ip: getClientIp(req),
      userId: user.id,
      banReason: user.banReason,
      ...context
    };
    console.error(JSON.stringify(logData));
  }
};

/**
 * Security headers configuration
 */
const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-xss-protection': '1; mode=block',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'geolocation=(), microphone=()',
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload'
};

/**
 * Cache control policies
 */
const CACHE_CONTROL = {
  public: 'public, max-age=3600, stale-while-revalidate=300',
  private: 'private, no-cache, no-store, must-revalidate',
  noStore: 'no-store, no-cache, must-revalidate'
};

/**
 * Rate limiting configuration
 */
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
};

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const correlationId = crypto.randomUUID();
  const context: LogContext = { correlationId };

  try {
    // Apply rate limiting
    const rateLimitResponse = await handleRateLimit(request, context);
    if (rateLimitResponse) return rateLimitResponse;

    // Skip middleware for static files and public routes
    if (isStaticFile(request) || isPublicRoute(request)) {
      return applySecurityHeaders(NextResponse.next(), correlationId);
    }

    // Route configuration
    const routeConfig = getRouteConfig(request);

    // Handle protected routes
    if (routeConfig.isProtected) {
      const authResponse = await handleProtectedRoute(request, context);
      if (authResponse) return authResponse;
    }

    // Prepare and return the appropriate response
    return prepareFinalResponse(request, context, routeConfig);

  } catch (error) {
    logger.logError(request, error as Error, context);
    return handleErrorResponse(request, context, error as Error);
  } finally {
    logRequestCompletion(request, context, start);
  }
}

/**
 * Helper Functions
 */

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0].trim() || realIp || '127.0.0.1';
  return /^[0-9a-f.:]+$/i.test(ip) ? ip : 'invalid-ip';
}

async function handleRateLimit(request: NextRequest, context: LogContext): Promise<NextResponse | null> {
  if (process.env.NODE_ENV !== 'production') return null;

  const ip = getClientIp(request);
  const currentTime = Date.now();
  
  // In production, replace this with Redis-based rate limiting
  const rateLimitCache = new Map<string, { count: number, lastReset: number }>();
  let record = rateLimitCache.get(ip);

  if (!record || currentTime - record.lastReset > RATE_LIMIT_CONFIG.windowMs) {
    record = { count: 0, lastReset: currentTime };
    rateLimitCache.set(ip, record);
  }

  record.count++;
  if (record.count > RATE_LIMIT_CONFIG.max) {
    const retryAfter = Math.ceil(
      (RATE_LIMIT_CONFIG.windowMs - (currentTime - record.lastReset)) / 1000
    );
    
    logger.logRateLimit(request, {
      ...context,
      status: 429,
      retryAfter,
      count: record.count
    });

    return new NextResponse(
      JSON.stringify({ 
        error: RATE_LIMIT_CONFIG.message,
        retryAfter,
        correlationId: context.correlationId
      }), 
      {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'x-correlation-id': context.correlationId,
          'Cache-Control': CACHE_CONTROL.noStore
        }
      }
    );
  }

  return null;
}

function isStaticFile(request: NextRequest): boolean {
  return [
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
    '/public/',
    '/static/',
    '/assets/'
  ].some(path => request.nextUrl.pathname.startsWith(path));
}

function isPublicRoute(request: NextRequest): boolean {
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/api/auth',
    '/api/public',
    '/healthcheck',
    '/forbidden',
    '/error'
  ];
  return publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
}

function getRouteConfig(request: NextRequest) {
  const protectedPaths = ['/dashboard', '/account', '/settings', '/admin'];
  const apiPaths = ['/api/'];
  
  return {
    isProtected: protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)),
    isApi: apiPaths.some(path => request.nextUrl.pathname.startsWith(path)),
    cacheControl: request.nextUrl.pathname.startsWith('/api/') 
      ? CACHE_CONTROL.noStore 
      : protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
        ? CACHE_CONTROL.private 
        : CACHE_CONTROL.public
  };
}

async function handleProtectedRoute(request: NextRequest, context: LogContext): Promise<NextResponse | null> {
  const cookie = getSessionCookie(request);
  if (!cookie) {
    logger.logAuthAttempt(request, false, {
      ...context,
      status: 302,
      reason: 'Missing session cookie'
    });
    return NextResponse.redirect(
      new URL(`/login?returnUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url)
    );
  }

  try {
    const session = await auth.api.getSession({
      query: { disableCookieCache: true },
      headers: new Headers(request.headers)
    });

    if (!session?.user) {
      logger.logAuthAttempt(request, false, {
        ...context,
        status: 403,
        reason: 'Invalid session'
      });
      return NextResponse.redirect(new URL('/login', request.url));
    }

// Update the validation function
// Update the validation function
function isUserRole(role: unknown): role is UserRole {
  return role === "admin" || role === "user" || role === "super_admin";
}

// In your middleware
const validatedUser: User = {
  id: session.user.id,
  name: session.user.name ?? '',
  email: session.user.email,
  emailVerified: session.user.emailVerified ?? false,
  createdAt: new Date(session.user.createdAt ?? Date.now()),
  updatedAt: new Date(session.user.updatedAt ?? Date.now()),
  image: session.user.image ?? undefined,
  twoFactorEnabled: session.user.twoFactorEnabled ?? null,
  role: isUserRole(session.user.role) ? session.user.role : undefined,
  banned: session.user.banned ?? false,
  banReason: session.user.banReason ?? null,
  stripeCustomerId: session.user.stripeCustomerId ?? null
};

session.user = validatedUser;

if (session.user.banned) {
  logger.logBannedUserAttempt(request, session.user, context);
  return NextResponse.redirect(
    new URL(`/banned?reason=${encodeURIComponent(session.user.banReason || '')}`, request.url)
  );
}

    // Check user roles
    if (!hasRequiredRoles(request.nextUrl.pathname, session.user.role)) {
      logger.logAuthAttempt(request, false, {
        ...context,
        status: 403,
        reason: 'Insufficient permissions',
        userId: session.user.id,
        tenantId: session.user.tenantId,
        userRoles: [session.user.role]
      });
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }

    // Successful authentication
    logger.logAuthAttempt(request, true, {
      ...context,
      userId: session.user.id,
      tenantId: session.user.tenantId,
      userRoles: [session.user.role]
    });

    // Add user context to headers
    const response = NextResponse.next();
    response.headers.set('x-user-id', session.user.id);
    response.headers.set('x-user-role', session.user.role);
    if (session.user.tenantId) {
      response.headers.set('x-tenant-id', session.user.tenantId);
    }

    return response;

  } catch (error) {
    logger.logError(request, error as Error, context);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

function hasRequiredRoles(path: string, userRole: UserRole): boolean {
  const roleConfig: Record<string, UserRole[]> = {
    '/admin': ['admin'],
    '/settings': ['user', 'admin'],
    '/dashboard': ['user', 'admin'],
    '/api/admin': ['admin']
  };

  for (const [route, roles] of Object.entries(roleConfig)) {
    if (path.startsWith(route)) {
      return roles.includes(userRole);
    }
  }
  return true; // No specific role required
}

function applySecurityHeaders(response: NextResponse, correlationId: string): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set('x-correlation-id', correlationId);
  return response;
}

function prepareFinalResponse(
  request: NextRequest,
  context: LogContext,
  routeConfig: ReturnType<typeof getRouteConfig>
): NextResponse {
  const response = routeConfig.isApi 
    ? handleApiResponse(request, context) 
    : NextResponse.next();

  applySecurityHeaders(response, context.correlationId);
  response.headers.set('Cache-Control', routeConfig.cacheControl);
  return response;
}

function handleApiResponse(request: NextRequest, context: LogContext): NextResponse {
  if (request.nextUrl.pathname.startsWith('/api/stream')) {
    const response = NextResponse.next();
    response.headers.set('Content-Type', 'text/event-stream');
    return response;
  }
  return NextResponse.next();
}

function handleErrorResponse(request: NextRequest, context: LogContext, error: Error): NextResponse {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        correlationId: context.correlationId,
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: { 
          'x-correlation-id': context.correlationId,
          'Content-Type': 'application/json',
          'Cache-Control': CACHE_CONTROL.noStore
        } 
      }
    );
  }
  return NextResponse.redirect(
    new URL(`/error?correlationId=${context.correlationId}`, request.url)
  );
}

function logRequestCompletion(request: NextRequest, context: LogContext, startTime: number) {
  const duration = Date.now() - startTime;
  logger.logRequest(request, {
    ...context,
    duration,
    status: context.status || 200
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|healthcheck|api/auth|banned).*)',
  ],
};


