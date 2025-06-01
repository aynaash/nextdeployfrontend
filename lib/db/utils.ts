// import { db } from "../db.ts";
// import { user} from "../../drizzle/schema/schema";
// import { eq } from "drizzle-orm";
//
// export async function getUserById(id: string) {
//   return db.query.users.findFirst({
//     where: eq(users.id, id),
//   });
// }
//
// export async function getUserByEmail(email: string) {
//   return db.query.user.findFirst({
//     where: eq(users.email, email),
//   });
// }
//
// export async function updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
//   const [updatedUser] = await db
//     .update(user)
//     .set(data)
//     .where(eq(users.id, id))
//     .returning();
//   return updatedUser;
// }
