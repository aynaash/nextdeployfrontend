// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { user } from "@/drizzle/schema/schema";
// import { eq } from 'drizzle-orm';
//
// export async function GET(request: Request) {
//   console.log('Incoming request to /api/users');
//   
//   try {
//     const { searchParams } = new URL(request.url);
//     const email = searchParams.get('email');
//     console.log('Request parameters:', { email });
//
//     console.log('Building query...');
//     let query = db.select().from(user);
//     
//     if (email) {
//       console.log('Adding email filter to query');
//       query = query.where(eq(user.email, email));
//     }
//
//     console.log('Executing query...');
//     const queryStart = Date.now();
//     
//     try {
//       const allUsers = await query;
//       console.log(`Query completed in ${Date.now() - queryStart}ms`);
//       console.log('Query results count:', allUsers.length);
//       
//       return NextResponse.json(allUsers);
//     } catch (queryError) {
//       console.error('Query execution failed:', {
//         error: queryError instanceof Error ? queryError.message : 'Unknown error',
//         stack: queryError instanceof Error ? queryError.stack : undefined,
//         timestamp: new Date().toISOString()
//       });
//       
//       return NextResponse.json(
//         { 
//           error: 'Query execution failed',
//           details: queryError instanceof Error ? queryError.message : 'Unknown error'
//         },
//         { status: 500 }
//       );
//     }
//     
//   } catch (error) {
//     console.error('Request handling failed:', {
//       error: error instanceof Error ? error.message : 'Unknown error',
//       stack: error instanceof Error ? error.stack : undefined,
//       timestamp: new Date().toISOString()
//     });
//     
//     return NextResponse.json(
//       { 
//         error: 'Internal server error',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }
