"use server";

import { redirect } from "next/navigation";
import { hash, compare } from "bcrypt";
import { auth } from "./auth";
import { db } from "@/lib/db";
import { userAuthSchema } from "@/lib/validations/auth";
import { APIError } from "better-auth/api";
import type { z } from "zod";

type FormData = z.infer<typeof userAuthSchema>;

interface AuthResult {
  success?: boolean;
  error?: string;
  errorMessage?: string;
  fieldErrors?: Record<string, string>;
}

export async function signIn(data: FormData): Promise<AuthResult> {
  console.log("Attempting sign in for email:", data.email);
  const { email, password } = data;
  
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      }
    });

    console.log("Sign in successful for user:", email);
    return { success: true };
  } catch (error) {
    console.error("Sign in failed for email:", email, "Error:", error);

    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return { errorMessage: "Invalid credentials. Please check your email and password." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid email format." };
        default:
          return { errorMessage: "An unexpected error occurred during sign in." };
      }
    }

    console.error("Unexpected error during sign in:", error);
    return { errorMessage: "An unexpected error occurred. Please try again later." };
  }
}

export async function signUp(data: FormData): Promise<AuthResult> {
  console.log("Starting sign up process for data:", JSON.stringify(data, null, 2));
  const validated = userAuthSchema.safeParse(data);
  
  if (!validated.success) {
    console.log("Validation failed for sign up data:", validated.error);
    const fieldErrors: Record<string, string> = {};
    validated.error.errors.forEach(err => {
      if (err.path[0]) {
        fieldErrors[err.path[0].toString()] = err.message;
      }
    });
    return { error: "Validation failed", fieldErrors };
  }

  const { email, password, firstname, lastname } = validated.data;
  console.log("Creating account for:", `${firstname} ${lastname}`, email);

  try {
    await auth.api.signUpEmail({
      body: {
        name: `${firstname} ${lastname}`,
        email,
        password,
      },
    });

    console.log("Account created successfully for:", email);
    redirect("/dashboard");
  } catch (error) {
    console.error("Sign up failed for email:", email, "Error:", error);

    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "An account with this email already exists." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid email format." };
        default:
          return { errorMessage: "An unexpected error occurred during sign up." };
      }
    }

    console.error("Unexpected error during sign up:", error);
    return { errorMessage: "An unexpected error occurred. Please try again later." };
  }
}

export async function verifyPassword(userId: string, password: string): Promise<boolean> {
  console.log("Verifying password for user ID:", userId);
  
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      console.error("User not found for ID:", userId);
      return false;
    }

    if (!user.password) {
      console.error("No password set for user ID:", userId);
      return false;
    }

    const isMatch = await compare(password, user.password);
    console.log("Password verification result for user ID:", userId, "Match:", isMatch);
    return isMatch;
  } catch (err) {
    console.error("Password verification error for user ID:", userId, "Error:", err);
    return false;
  }
}
