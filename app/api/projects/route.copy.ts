// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { projects } from '@/lib/schema';
// import { eq } from 'drizzle-orm';
//
// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const ownerId = searchParams.get('ownerId');
//     const tenantId = searchParams.get('tenantId');
//
//     let query = db.select().from(projects);
//
//     if (ownerId) {
//       query = query.where(eq(projects.ownerId, ownerId));
//     }
//
//     if (tenantId) {
//       query = query.where(eq(projects.tenantId, tenantId));
//     }
//
//     const allProjects = await query;
//     return NextResponse.json(allProjects);
//
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
//
// export async function POST(request: Request) {
//   try {
//     const projectData = await request.json();
//
//     const [newProject] = await db.insert(projects)
//       .values({
//         ...projectData,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//       .returning();
//
//     return NextResponse.json(newProject, { status: 201 });
//
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
