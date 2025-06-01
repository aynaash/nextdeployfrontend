import { db } from './db';
// import { errors } from './schema';
// import { headers } from 'next/headers';
//
// export async function trackError(
//   error: unknown,
//   context: Record<string, any> = {}
// ) {
//   try {
//     const errorObj = error instanceof Error ? error : new Error(String(error));
//     const userAgent = headers().get('user-agent');
//     const ipAddress = headers().get('x-forwarded-for');
//     
//     await db.insert(errors).values({
//       message: errorObj.message,
//       stack: errorObj.stack,
//       name: errorObj.name,
//       context: {
//         ...context,
//         userAgent,
//         ipAddress,
//       },
//     });
//     
//     // Also log to console
//     console.error(errorObj);
//   } catch (loggingError) {
//     console.error('Failed to track error:', loggingError);
//   }
// }
//
// export function withErrorTracking(
//   handler: (request: Request) => Promise<NextResponse>
// ) {
//   return async (request: Request) => {
//     try {
//       return await handler(request);
//     } catch (error) {
//       await trackError(error, {
//         path: request.url,
//         method: request.method,
//       });
//       return handleApiError(error);
//     }
//   };
// }
