// import { db } from "../drizzle/index.ts";
// import { users } from "../drizzle/schema.ts";
// import { eq } from "drizzle-orm";
//
// export const getUserByEmail = async (email: string) => {
//   try {
//     const user = await db.query.users.findFirst({
//       where: eq(users.email, email),
//       columns: {
//         name: true,
//         emailVerified: true,
//       },
//     });
//     return user;
//   } catch {
//     return null;
//   }
// };
//
// export const getUserById = async (id: string) => {
//   try {
//     const user = await db.query.users.findFirst({
//       where: eq(users.id, id),
//     });
//     return user;
//   } catch {
//     return null;
//   }
// };
