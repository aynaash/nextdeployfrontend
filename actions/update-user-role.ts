"use server";

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../auth.ts";
import { db } from "@/lib/db";
import { userRoleSchema } from "@/lib/validations/user";
import { user } from "@/drizzle/schema/schema";
import { eq } from "drizzle-orm";
import { UserRole } from "@/drizzle/schema/enums";

export type FormData = {
  role: UserRole;
};

export async function updateUserRole(userId: string, data: FormData) {
  try {
    const session = await auth.api.getSession();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { role } = userRoleSchema.parse(data);

    // Update the user role using Drizzle
    await db.update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .execute();

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { status: "error" };
  }
}
