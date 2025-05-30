// import { db } from '@/lib/db';
// import { teams, teamMembers } from '@/lib/schema';
// import { eq, and } from 'drizzle-orm';
// import { NextResponse } from 'next/server';
// import { ApiError, handleApiError, successResponse, noContentResponse } from '@/lib/api-utils';
// import { requireAuth } from '@/lib/auth';
//
// export async function GET(
//   request: Request,
//   { params }: { params: { teamId: string } }
// ) {
//   try {
//     const user = await requireAuth();
//     
//     // Check if user is a member of the team
//     const [membership] = await db.select()
//       .from(teamMembers)
//       .where(
//         and(
//           eq(teamMembers.teamId, params.teamId),
//           eq(teamMembers.userId, user.id)
//         )
//       .limit(1);
//     
//     if (!membership) {
//       throw new ApiError('Forbidden', 403);
//     }
//     
//     const team = await db.query.teams.findFirst({
//       where: eq(teams.id, params.teamId),
//       with: {
//         owner: {
//           columns: {
//             id: true,
//             name: true,
//             email: true
//           }
//         },
//         members: {
//           with: {
//             user: {
//               columns: {
//                 id: true,
//                 name: true,
//                 email: true
//               }
//             }
//           }
//         }
//       }
//     });
//     
//     if (!team) {
//       throw new ApiError('Team not found', 404);
//     }
//     
//     return successResponse(team);
//     
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
//
// export async function PUT(
//   request: Request,
//   { params }: { params: { teamId: string } }
// ) {
//   try {
//     const user = await requireAuth();
//     const body = await request.json();
//     
//     // Only team owners can update the team
//     const [team] = await db.select()
//       .from(teams)
//       .where(
//         and(
//           eq(teams.id, params.teamId),
//           eq(teams.ownerId, user.id)
//         )
//       )
//       .limit(1);
//     
//     if (!team) {
//       throw new ApiError('Team not found or you are not the owner', 404);
//     }
//     
//     const [updatedTeam] = await db.update(teams)
//       .set({
//         name: body.name,
//         isDeleted: body.isDeleted
//       })
//       .where(eq(teams.id, params.teamId))
//       .returning();
//     
//     return successResponse(updatedTeam);
//     
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
//
// export async function DELETE(
//   request: Request,
//   { params }: { params: { teamId: string } }
// ) {
//   try {
//     const user = await requireAuth();
//     
//     // Only team owners can delete the team
//     const [team] = await db.select()
//       .from(teams)
//       .where(
//         and(
//           eq(teams.id, params.teamId),
//           eq(teams.ownerId, user.id)
//         )
//       )
//       .limit(1);
//     
//     if (!team) {
//       throw new ApiError('Team not found or you are not the owner', 404);
//     }
//     
//     // Soft delete
//     await db.update(teams)
//       .set({ isDeleted: true })
//       .where(eq(teams.id, params.teamId));
//     
//     return noContentResponse();
//     
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
