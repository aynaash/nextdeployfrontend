// "use server";
//
// import { auth } from "../auth.ts";
// import { db } from "../lib/db.ts";
// import { userNameSchema } from "@/lib/validations/user";
// import { revalidatePath } from "next/cache";
// import { user } from "../drizzle/schema/schema.ts";
// import { eq } from "drizzle-orm";
//
// export type FormData = {
//   name: string;
// };
//
// export async function updateUserName(userId: string, data: FormData) {
//   try {
//     const session = await auth.api.getSession();
//
//     if (!session?.user || session?.user.id !== userId) {
//       throw new Error("Unauthorized");
//     }
//
//     const { name } = userNameSchema.parse(data);
//
//     // Update the user name using Drizzle
//     await db.update(users)
//       .set({ name })
//       .where(eq(users.id, userId))
//       .execute();
//
//     revalidatePath('/dashboard/settings');
//     return { status: "success" };
//   } catch (error) {
//     console.error("Error updating user name:", error);
//     return { status: "error" };
//   }
// }
