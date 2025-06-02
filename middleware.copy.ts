
// import { generateUUID } from 'jose/util/generate_uuid';
// import { NextResponse, type NextRequest } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";
// import { auth } from "./auth";
// import type { User, UserRole } from "./lib/types";
//
// /**
//  * Enhanced Log Context with standardized fields
//  */
// interface LogContext {
//   correlationId: string;
//   userId?: string;
//   tenantId?: string;
//   userRoles?: UserRole[];
//   status?: number;
//   duration?: number;
//   [key: string]: any;
// }
//
// /**
//  * Comprehensive RequestLogger with multiple log levels
//  */
// interface RequestLogger {
//   debug: (message: string, context?: LogContext) => void;
//   info: (message: string, context?: LogContext) => void;
//   warn: (message: string, context?: LogContext) => void;
//   error: (message: string, error?: Error, context?: LogContext) => void;
//   audit: (event: string, context: LogContext) => void;
// }
//
// /**
//  * Production-ready logger implementation with structured logging
//  */
// const logger: RequestLogger = {
//   debug: (message, context = {}) => logMessage('debug', message, context),
//   info: (message, context = {}) => logMessage('info', message, context),
//   warn: (message, context = {}) => logMessage('warn', message, context),
//   error: (message, error, context = {}) => {
//     const errorContext = error ? {
//       error: {
//         name: error.name,
//         message: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       }
//     } : {};
//     logMessage('error', message, { ...context, ...errorContext });
//   },
//   audit: (event, context) => {
//     logMessage('audit', event, {
//       ...context,
//       auditEvent: event,
//       timestamp: new Date().toISOString()
//     });
//   }
// };
//
// function logMessage(level: string, message: string, context: LogContext) {
//   const logData = {
//     timestamp: new Date().toISOString(),
//     level,
//     message,
//     ...context
//   };
//   
//   // In production, you'd send this to a logging service
//   console[level === 'audit' ? 'info' : level](JSON.stringify(logData));
// }
//
// /**
//  * Security headers configuration with CSP
//  */
// const SECURITY_HEADERS = {
//   'x-content-type-options': 'nosniff',
//   'x-frame-options': 'DENY',
//   'x-xss-protection': '1; mode=block',
//   'referrer-policy': 'strict-origin-when-cross-origin',
//   'permissions-policy': 'geolocation=(), microphone=()',
//   'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
//   'content-security-policy': `
//     default-src 'self';
//     script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ""};
//     style-src 'self' 'unsafe-inline';
//     img-src 'self' data: blob:;
//     font-src 'self';
//     connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL ?? ''};
//     media-src 'self';
//     object-src 'none';
//     frame-src 'none';
//     base-uri 'self';
//     form-action 'self';
//   `.replace(/\s+/g, ' ').trim()
// };
//
// /**
//  * Cache control policies
//  */
// const CACHE_CONTROL = {
//   public: 'public, max-age=3600, stale-while-revalidate=300',
//   private: 'private, no-cache, no-store, must-revalidate',
//   noStore: 'no-store, no-cache, must-revalidate'
// };
//
// /**
//  * Rate limiting configuration with Redis (optional)
//  */
// interface RateLimitConfig {
//   windowMs: number;
//   max: number;
//   message: string;
//   redisUrl?: string;
// }
//
// const RATE_LIMIT_CONFIG: RateLimitConfig = {
//   windowMs: 60 * 1000, // 1 minute
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests, please try again later',
//   redisUrl: process.env.REDIS_URL
// };
//
// export async function middleware(request: NextRequest) {
//   const start = Date.now();
//   const correlationId = generateUUID(); // Using jose's UUID generator
//   const context: LogContext = { correlationId };
//
//   try {
//     // Initialize request logging
//     logger.info(`Incoming request: ${request.method} ${request.nextUrl.pathname}`, {
//       ...context,
//       method: request.method,
//       path: request.nextUrl.pathname,
//       ip: getClientIp(request),
//       userAgent: request.headers.get('user-agent') || 'unknown'
//     });
//
//     // Apply rate limiting
//     const rateLimitResponse = await handleRateLimit(request, context);
//     if (rateLimitResponse) return rateLimitResponse;
//
//     // Skip middleware for static files and public routes
//     if (isStaticFile(request) || isPublicRoute(request)) {
//       logger.debug('Skipping middleware for static/public route', context);
//       return applySecurityHeaders(NextResponse.next(), correlationId);
//     }
//
//     // Route configuration
//     const routeConfig = getRouteConfig(request);
//
//     // Handle protected routes
//     if (routeConfig.isProtected) {
//       const authResponse = await handleProtectedRoute(request, context);
//       if (authResponse) return authResponse;
//     }
//
//     // Prepare and return the appropriate response
//     return prepareFinalResponse(request, context, routeConfig);
//
//   } catch (error) {
//     logger.error('Middleware processing error', error as Error, context);
//     return handleErrorResponse(request, context, error as Error);
//   } finally {
//     const duration = Date.now() - start;
//     logger.info(`Request completed`, {
//       ...context,
//       duration,
//       status: context.status || 200
//     });
//   }
// }
//
// /**
//  * Enhanced Helper Functions
//  */
//
// function getClientIp(req: NextRequest): string {
//   const forwardedFor = req.headers.get('x-forwarded-for');
//   const realIp = req.headers.get('x-real-ip');
//   const ip = forwardedFor?.split(',')[0].trim() || realIp || '127.0.0.1';
//   return /^[0-9a-f.:]+$/i.test(ip) ? ip : 'invalid-ip';
// }
//
// async function handleRateLimit(request: NextRequest, context: LogContext): Promise<NextResponse | null> {
//   if (process.env.NODE_ENV !== 'production') return null;
//
//   const ip = getClientIp(request);
//   const currentTime = Date.now();
//   
//   // Implementation with Redis (if configured)
//   if (RATE_LIMIT_CONFIG.redisUrl) {
//     try {
//       // This would be replaced with actual Redis client implementation
//       const redisClient = {}; // Mock for example
//       const key = `rate_limit:${ip}`;
//       
//       // const current = await redisClient.get(key);
//       // const record = current ? JSON.parse(current) : { count: 0, lastReset: currentTime };
//       
//       // Mock implementation:
//       const record = { count: 0, lastReset: currentTime };
//       
//       if (currentTime - record.lastReset > RATE_LIMIT_CONFIG.windowMs) {
//         record.count = 0;
//         record.lastReset = currentTime;
//       }
//
//       record.count++;
//       
//       // await redisClient.set(key, JSON.stringify(record), 'PX', RATE_LIMIT_CONFIG.windowMs);
//       
//       if (record.count > RATE_LIMIT_CONFIG.max) {
//         const retryAfter = Math.ceil(
//           (RATE_LIMIT_CONFIG.windowMs - (currentTime - record.lastReset)) / 1000
//         );
//         
//         logger.warn('Rate limit exceeded', {
//           ...context,
//           status: 429,
//           retryAfter,
//           count: record.count,
//           ip
//         });
//
//         return new NextResponse(
//           JSON.stringify({ 
//             error: RATE_LIMIT_CONFIG.message,
//             retryAfter,
//             correlationId: context.correlationId
//           }), 
//           {
//             status: 429,
//             headers: { 
//               'Content-Type': 'application/json',
//               'Retry-After': String(retryAfter),
//               'x-correlation-id': context.correlationId,
//               'Cache-Control': CACHE_CONTROL.noStore
//             }
//           }
//         );
//       }
//     } catch (err) {
//       logger.error('Redis rate limit error', err as Error, context);
//       // Fail open - don't block requests if Redis fails
//     }
//   } else {
//     // Fallback to in-memory rate limiting
//     const rateLimitCache = new Map<string, { count: number, lastReset: number }>();
//     let record = rateLimitCache.get(ip);
//
//     if (!record || currentTime - record.lastReset > RATE_LIMIT_CONFIG.windowMs) {
//       record = { count: 0, lastReset: currentTime };
//       rateLimitCache.set(ip, record);
//     }
//
//     record.count++;
//     if (record.count > RATE_LIMIT_CONFIG.max) {
//       const retryAfter = Math.ceil(
//         (RATE_LIMIT_CONFIG.windowMs - (currentTime - record.lastReset)) / 1000
//       );
//       
//       logger.warn('Rate limit exceeded (in-memory)', {
//         ...context,
//         status: 429,
//         retryAfter,
//         count: record.count,
//         ip
//       });
//
//       return new NextResponse(
//         JSON.stringify({ 
//           error: RATE_LIMIT_CONFIG.message,
//           retryAfter,
//           correlationId: context.correlationId
//         }), 
//         {
//           status: 429,
//           headers: { 
//             'Content-Type': 'application/json',
//             'Retry-After': String(retryAfter),
//             'x-correlation-id': context.correlationId,
//             'Cache-Control': CACHE_CONTROL.noStore
//           }
//         }
//       );
//     }
//   }
//
//   return null;
// }
//
// function isStaticFile(request: NextRequest): boolean {
//   return [
//     '/_next/static',
//     '/_next/image',
//     '/favicon.ico',
//     '/public/',
//     '/static/',
//     '/assets/'
//   ].some(path => request.nextUrl.pathname.startsWith(path));
// }
//
// function isPublicRoute(request: NextRequest): boolean {
//   const publicPaths = [
//     '/',
//     '/login',
//     '/signup',
//     '/api/auth',
//     '/api/public',
//     '/healthcheck',
//     '/forbidden',
//     '/error'
//   ];
//   return publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
// }
//
// function getRouteConfig(request: NextRequest) {
//   const protectedPaths = ['/dashboard', '/account', '/settings', '/admin'];
//   const apiPaths = ['/api/'];
//   const adminPaths = ['/admin', '/api/admin'];
//   
//   return {
//     isProtected: protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)),
//     isApi: apiPaths.some(path => request.nextUrl.pathname.startsWith(path)),
//     isAdmin: adminPaths.some(path => request.nextUrl.pathname.startsWith(path)),
//     cacheControl: request.nextUrl.pathname.startsWith('/api/') 
//       ? CACHE_CONTROL.noStore 
//       : protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
//         ? CACHE_CONTROL.private 
//         : CACHE_CONTROL.public
//   };
// }
//
// async function handleProtectedRoute(request: NextRequest, context: LogContext): Promise<NextResponse | null> {
//   const cookie = getSessionCookie(request);
//   if (!cookie) {
//     logger.audit('Authentication attempt failed - missing session cookie', {
//       ...context,
//       status: 302,
//       reason: 'Missing session cookie'
//     });
//     return NextResponse.redirect(
//       new URL(`/login?returnUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url)
//     );
//   }
//
//   try {
//     const session = await auth.api.getSession({
//       query: { disableCookieCache: true },
//       headers: new Headers(request.headers)
//     });
//
//     if (!session?.user) {
//       logger.audit('Authentication attempt failed - invalid session', {
//         ...context,
//         status: 403,
//         reason: 'Invalid session'
//       });
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//
//     // Type-safe user validation
//     const validatedUser: User = {
//       id: session.user.id,
//       name: session.user.name ?? '',
//       email: session.user.email,
//       emailVerified: session.user.emailVerified ?? false,
//       createdAt: new Date(session.user.createdAt ?? Date.now()),
//       updatedAt: new Date(session.user.updatedAt ?? Date.now()),
//       image: session.user.image ?? undefined,
//       twoFactorEnabled: session.user.twoFactorEnabled ?? null,
//       role: isUserRole(session.user.role) ? session.user.role : undefined,
//       banned: session.user.banned ?? false,
//       banReason: session.user.banReason ?? null,
//       stripeCustomerId: session.user.stripeCustomerId ?? null
//     };
//
//     session.user = validatedUser;
//
//     if (session.user.banned) {
//       logger.audit('Banned user attempt', {
//         ...context,
//         userId: session.user.id,
//         banReason: session.user.banReason
//       });
//       return NextResponse.redirect(
//         new URL(`/banned?reason=${encodeURIComponent(session.user.banReason || '')}`, request.url)
//       );
//     }
//
//     // Check user roles
//     if (!hasRequiredRoles(request.nextUrl.pathname, session.user.role)) {
//       logger.audit('Authorization failed - insufficient permissions', {
//         ...context,
//         status: 403,
//         reason: 'Insufficient permissions',
//         userId: session.user.id,
//         tenantId: session.user.tenantId,
//         userRoles: [session.user.role]
//       });
//       return NextResponse.redirect(new URL('/forbidden', request.url));
//     }
//
//     // Successful authentication
//     logger.audit('Authentication successful', {
//       ...context,
//       userId: session.user.id,
//       tenantId: session.user.tenantId,
//       userRoles: [session.user.role]
//     });
//
//     // Add user context to headers
//     const response = NextResponse.next();
//     response.headers.set('x-user-id', session.user.id);
//     response.headers.set('x-user-role', session.user.role);
//     if (session.user.tenantId) {
//       response.headers.set('x-tenant-id', session.user.tenantId);
//     }
//
//     return response;
//
//   } catch (error) {
//     logger.error('Authentication processing error', error as Error, context);
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
// }
//
// function isUserRole(role: unknown): role is UserRole {
//   return role === "admin" || role === "user" || role === "super_admin";
// }
//
// function hasRequiredRoles(path: string, userRole: UserRole): boolean {
//   const roleConfig: Record<string, UserRole[]> = {
//     '/admin': ['admin', 'super_admin'],
//     '/settings': ['user', 'admin', 'super_admin'],
//     '/dashboard': ['user', 'admin', 'super_admin'],
//     '/api/admin': ['admin', 'super_admin']
//   };
//
//   for (const [route, roles] of Object.entries(roleConfig)) {
//     if (path.startsWith(route)) {
//       return roles.includes(userRole);
//     }
//   }
//   return true; // No specific role required
// }
//
// function applySecurityHeaders(response: NextResponse, correlationId: string): NextResponse {
//   Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
//     response.headers.set(key, value);
//   });
//   response.headers.set('x-correlation-id', correlationId);
//   response.headers.set('x-request-id', correlationId);
//   return response;
// }
//
// function prepareFinalResponse(
//   request: NextRequest,
//   context: LogContext,
//   routeConfig: ReturnType<typeof getRouteConfig>
// ): NextResponse {
//   const response = routeConfig.isApi 
//     ? handleApiResponse(request, context) 
//     : NextResponse.next();
//
//   applySecurityHeaders(response, context.correlationId);
//   response.headers.set('Cache-Control', routeConfig.cacheControl);
//   
//   // Add performance headers
//   response.headers.set('x-response-time', `${context.duration}ms`);
//   
//   return response;
// }
//
// function handleApiResponse(request: NextRequest, context: LogContext): NextResponse {
//   if (request.nextUrl.pathname.startsWith('/api/stream')) {
//     const response = NextResponse.next();
//     response.headers.set('Content-Type', 'text/event-stream');
//     return response;
//   }
//   return NextResponse.next();
// }
//
// function handleErrorResponse(request: NextRequest, context: LogContext, error: Error): NextResponse {
//   if (request.nextUrl.pathname.startsWith('/api')) {
//     return NextResponse.json(
//       { 
//         error: 'Internal Server Error',
//         correlationId: context.correlationId,
//         timestamp: new Date().toISOString()
//       },
//       { 
//         status: 500,
//         headers: { 
//           'x-correlation-id': context.correlationId,
//           'Content-Type': 'application/json',
//           'Cache-Control': CACHE_CONTROL.noStore
//         } 
//       }
//     );
//   }
//   return NextResponse.redirect(
//     new URL(`/error?correlationId=${context.correlationId}`, request.url)
//   );
// }
//
// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|public|healthcheck|api/auth|banned).*)',
//   ],
// };
