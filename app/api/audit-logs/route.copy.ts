// import { db } from '@/lib/db';
// import { auditLogs } from "../../../drizzle/schema/schema.ts";
// import { eq, and, or, like, gte, lte } from 'drizzle-orm';
// import { NextResponse } from 'next/server';
// import { ApiError, handleApiError, successResponse } from ;
// import { requireAdmin } from '@/lib/auth';
//
// export async function GET(request: Request) {
//   try {
//     await requireAdmin();
//     
//     const { searchParams } = new URL(request.url);
//     const action = searchParams.get('action');
//     const entityType = searchParams.get('entityType');
//     const userId = searchParams.get('userId');
//     const teamId = searchParams.get('teamId');
//     const projectId = searchParams.get('projectId');
//     const from = searchParams.get('from');
//     const to = searchParams.get('to');
//     const limit = parseInt(searchParams.get('limit') || '100');
//     const offset = parseInt(searchParams.get('offset') || '0');
//     
//     let whereClause = [];
//      e
//     if (action) {
//       whereClause.push(like(auditLogs.action, `%${action}%`));
//     }
//     
//     if (entityType) {
//       whereClause.push(eq(auditLogs.entityType, entityType));
//     }
//     
//     if (userId) {
//       whereClause.push(eq(auditLogs.userId, userId));
//     }
//     
//     if (teamId) {
//       whereClause.push(eq(auditLogs.teamId, teamId));
//     }
//     
//     if (projectId) {
//       whereClause.push(eq(auditLogs.projectId, projectId));
//     }
//     
//     if (from) {
//       whereClause.push(gte(auditLogs.createdAt, new Date(from)));
//     }
//     
//     if (to) {
//       whereClause.push(lte(auditLogs.createdAt, new Date(to)));
//     }
//     
//     const logs = await db.select()
//       .from(auditLogs)
//       .where(whereClause.length ? and(...whereClause) : undefined)
//       .orderBy(auditLogs.createdAt)
//       .limit(limit)
//       .offset(offset);
//     
//     const total = await db.select({ count: count() })
//       .from(auditLogs)
//       .where(whereClause.length ? and(...whereClause) : undefined)
//       .then(res => res[0]?.count || 0);
//     
//     return successResponse({
//       data: logs,
//       total,
//       limit,
//       offset
//     });
//     
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
