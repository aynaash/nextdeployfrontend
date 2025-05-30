// import { db } from '@/lib/db';
// import { teams } from '@/lib/schema';
// import { eq, and, or, like } from 'drizzle-orm';
// import { NextResponse } from 'next/server';
// import { ApiError, handleApiError, successResponse } from '@/lib/api-utils';
// import { requireAuth } from '@/lib/auth';
//
// export async function GET(request: Request) {
//   try {
//     const user = await requireAuth();
//     
//     const { searchParams } = new URL(request.url);
//     const query = searchParams.get('query');
//     const limit = parseInt(searchParams.get('limit') || '100');
//     const offset = parseInt(searchParams.get('offset') || '0');
//     
//     let whereClause = [];
//     
//     if (query) {
//       whereClause.push(like(teams.name, `%${query}%`));
//     }
//     
//     // Users can see teams they own or are members of
//     const teamsList = await db.query.teams.findMany({
//       where: whereClause.length ? and(...whereClause) : undefined,
//       with: {
//         owner: {
//           columns: {
//             id: true,
//             name: true,
//             email: true
//           }
//         }
//       },
//       limit,
//       offset
//     });
//     
//     const total = await db.select({ count: count() })
//       .from(teams)
//       .where(whereClause.length ? and(...whereClause) : undefined)
//       .then(res => res[0]?.count || 0);
//     
//     return successResponse({
//       data: teamsList,
//       total,
//       limit,
//       offset
//     });
//     
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
//
// export async function POST(request: Request) {
//   try {
//     const user = await requireAuth();
//     const body = await request.json();
//     
//     const [newTeam] = await db.insert(teams)
//       .values({
//         name: body.name,
//         ownerId: user.id,
//         createdAt: new Date()
//       })
//       .returning();
//     
//     // Add the creator as the first team member
//     await db.insert(teamMembers)
//       .values({
//         userId: user.id,
//         teamId: newTeam.id,
//         role: 'owner',
//         status: 'active',
//         joinedAt: new Date()
//       });
//     
//     return successResponse(newTeam, 201);
//     
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
