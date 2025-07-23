// import { db } from '@/lib/db';
// import { deployments, projects, teamMembers } from '@/lib/schema';
// import { eq, and } from 'drizzle-orm';
// import { NextResponse } from 'next/server';
// import { ApiError, handleApiError, successResponse, createdResponse } from '@/lib/api-utils';
// import { requireAuth } from '@/lib/auth';
//
// export async function GET(
//   request: Request,
//   { params }: { params: { projectId: string } }
// ) {
//   try {
//     const user = await requireAuth();
//
//     // Verify user has access to the project
//     const [project] = await db.select()
//       .from(projects)
//       .leftJoin(
//         teamMembers,
//         and(
//           eq(teamMembers.teamId, projects.teamId),
//           eq(teamMembers.userId, user.id)
//         )
//       )
//       .where(
//         and(
//           eq(projects.id, params.projectId),
//           or(
//             eq(projects.ownerId, user.id),
//             eq(teamMembers.status, 'active')
//           )
//         )
//       )
//       .limit(1);
//
//     if (!project) {
//       throw new ApiError('Project not found or access denied', 404);
//     }
//
//     const deploymentsList = await db.select()
//       .from(deployments)
//       .where(eq(deployments.projectId, params.projectId))
//       .orderBy(deployments.createdAt);
//
//     return successResponse(deploymentsList);
//
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
//
// export async function POST(
//   request: Request,
//   { params }: { params: { projectId: string } }
// ) {
//   try {
//     const user = await requireAuth();
//     const { imageUrl, environmentId } = await request.json();
//
//     // Verify user has access to the project
//     const [project] = await db.select()
//       .from(projects)
//       .leftJoin(
//         teamMembers,
//         and(
//           eq(teamMembers.teamId, projects.teamId),
//           eq(teamMembers.userId, user.id)
//         )
//       )
//       .where(
//         and(
//           eq(projects.id, params.projectId),
//           or(
//             eq(projects.ownerId, user.id),
//             eq(teamMembers.status, 'active')
//           )
//         )
//       )
//       .limit(1);
//
//     if (!project) {
//       throw new ApiError('Project not found or access denied', 404);
//     }
//
//     // Verify environment exists and belongs to project
//     if (environmentId) {
//       const [environment] = await db.select()
//         .from(projectEnvironments)
//         .where(
//           and(
//             eq(projectEnvironments.id, environmentId),
//             eq(projectEnvironments.projectId, params.projectId)
//           )
//         )
//         .limit(1);
//
//       if (!environment) {
//         throw new ApiError('Environment not found', 404);
//       }
//     }
//
//     const [newDeployment] = await db.insert(deployments)
//       .values({
//         projectId: params.projectId,
//         environmentId,
//         imageUrl,
//         status: 'pending',
//         tenantId: project.tenant_id,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       })
//       .returning();
//
//     // In a real app, you would trigger the deployment process here
//
//     return createdResponse(newDeployment);
//
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
