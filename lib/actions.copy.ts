
"use server";
import { redirect } from "next/navigation";
import { compare } from "bcrypt";
import { z } from "zod";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { auth } from "./auth";
import { user } from "../drizzle/schema.ts";
import { userAuthSchema } from "@/lib/validations/auth";
import { APIError } from "better-auth/api";

type FormData = z.infer<typeof userAuthSchema>;

interface AuthResult {
  success?: boolean;
  error?: string;
  errorMessage?: string;
  fieldErrors?: Record<string, string>;
}

// 🛠 Format Zod validation errors into a flat object
function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  error.errors.forEach(err => {
    if (err.path[0]) {
      fieldErrors[err.path[0].toString()] = err.message;
    }
  });
  return fieldErrors;
}

// 🧼 Safely serialize user fields for BetterAuth metadata
function serializeUserMetadata(data: Partial<typeof user._.columns>) {
  return {
    ...data,
    createdAt: data.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    emailVerified: data.emailVerified?.toISOString?.() ?? null,
    stripeCurrentPeriodEnd: data.stripeCurrentPeriodEnd?.toISOString?.() ?? null,
  };
}

// 🧠 Sign In
export async function signIn(data: FormData): Promise<AuthResult> {
  console.log("[SignIn] Email attempt:", data.email);

  const validated = userAuthSchema.safeParse(data);
  if (!validated.success) {
    return {
      error: "Validation failed",
      fieldErrors: formatValidationErrors(validated.error),
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    console.log("[SignIn] Success:", data.email);
    return { success: true };
  } catch (err) {
    console.error("[SignIn] Error:", err);

    if (err instanceof APIError) {
      const message = {
        UNAUTHORIZED: "Invalid credentials.",
        BAD_REQUEST: "Invalid email format.",
      }[err.status] || "Unexpected error during sign-in.";

      return { errorMessage: message };
    }

    return { errorMessage: "Sign-in failed due to an unknown error." };
  }
}


// Type definitions
type AuthResult = {
  success?: boolean;
  error?: string;
  errorMessage?: string;
  fieldErrors?: Record<string, string[]>;
  apiError?: unknown;
};

type FormDataLike = {
  entries?: () => IterableIterator<[string, unknown]>;
  keys?: () => IterableIterator<string>;
  get?: (key: string) => unknown;
};

// Enhanced user schema with better error messages
const userAuthSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password too long"),
  firstname: z.string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastname: z.string()
    .min(1, "Last name is required")
    .max(50, "Last name too long")
});

export async function signUp(formInput: unknown): Promise<AuthResult> {
  // =============================================
  // PHASE 1: INPUT VALIDATION AND CONVERSION
  // =============================================
  
  // Debug initial input
  console.debug("[SignUp] Raw input received:", {
    type: typeof formInput,
    constructorName: formInput?.constructor?.name,
    isFormData: formInput instanceof FormData,
    prototypeMethods: getMethodNames(formInput)
  });

  // Check if input exists
  if (!formInput) {
    console.error("[SignUp] No input data provided");
    return { 
      success: false,
      errorMessage: "No form data submitted" }; 
  }

  // Convert to FormData-like object
  const formData = tryConvertToFormData(formInput);
  if (!formData) {
    console.error("[SignUp] Unsupported input type:", formInput);
    return { 
success: false,
      errorMessage: "Invalid form submission format" };
  }

  // Extract form data with multiple fallback methods
  const formValues = extractFormValues(formData);
  if (!formValues) {
    console.error("[SignUp] Failed to extract form values");
    return { errorMessage: "Could not process form data" };
  }

  console.debug("[SignUp] Extracted form values:", {
    ...formValues,
    password: "***" // Never log actual passwords
  });

  // =============================================
  // PHASE 2: DATA VALIDATION
  // =============================================

  const validationResult = userAuthSchema.safeParse(formValues);
  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    console.error("[SignUp] Validation failed:", fieldErrors);
    return {
      success: false,
      error: "Validation failed",
      fieldErrors,
      errorMessage: "Please correct the highlighted fields"
    };
  }

  // =============================================
  // PHASE 3: USER CREATION
  // =============================================

  const { email, password, firstname, lastname } = validationResult.data;
  const userData = {
    id: randomUUID(),
    email,
    password,
    firstName: firstname,
    lastName: lastname,
    name: `${firstname} ${lastname}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    console.debug("[SignUp] Attempting user creation");
    
    // In a real app, you would call your auth provider here
    // await authProvider.createUser(userData);
     
    
    // Simulate successful creation
    console.info("[SignUp] User created successfully:", {
      email: userData.email,
      userId: userData.id
    });
    
    //redirect("/");
    return { success: true };
    
  } catch (error) {
    console.error("[SignUp] Creation failed:", serializeError(error));
    
    return handleCreationError(error);
  }
}

// =============================================
// HELPER FUNCTIONS
// =============================================

function tryConvertToFormData(input: unknown): FormDataLike | null {
  // Already FormData or compatible
  if (typeof input === 'object' && input !== null) {
    if (input instanceof FormData) return input;
    if ('entries' in input || 'get' in input) return input as FormDataLike;
  }
  
  // Handle plain objects
  if (typeof input === 'object' && input !== null) {
    return {
      entries: function*() {
        for (const [key, value] of Object.entries(input)) {
          yield [key, value];
        }
      },
      get: (key: string) => (input as Record<string, unknown>)[key]
    };
  }
  
  return null;
}

function extractFormValues(formData: FormDataLike): Record<string, string> | null {
  const result: Record<string, string> = {};
  let success = false;
  
  // Method 1: entries()
  if (typeof formData.entries === 'function') {
    try {
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          result[key] = value;
          success = true;
        }
      }
    } catch (error) {
      console.warn("[SignUp] entries() method failed:", error);
    }
  }
  
  // Method 2: keys() + get()
  if (!success && typeof formData.keys === 'function' && typeof formData.get === 'function') {
    try {
      for (const key of formData.keys()) {
        const value = formData.get(key);
        if (typeof value === 'string') {
          result[key] = value;
          success = true;
        }
      }
    } catch (error) {
      console.warn("[SignUp] keys()+get() method failed:", error);
    }
  }
  
  // Method 3: Direct get()
  if (!success && typeof formData.get === 'function') {
    try {
      const requiredFields = ['email', 'password', 'firstname', 'lastname'];
      for (const field of requiredFields) {
        const value = formData.get(field);
        if (typeof value === 'string') {
          result[field] = value;
          success = true;
        }
      }
    } catch (error) {
      console.warn("[SignUp] get() method failed:", error);
    }
  }
  
  return success ? result : null;
}

function handleCreationError(error: unknown): AuthResult {
  // Handle specific API errors
  if (isAPIError(error)) {
    return {
      errorMessage: error.status === 'UNPROCESSABLE_ENTITY'
        ? "This email is already registered"
        : "Registration failed due to server error",
      apiError: process.env.NODE_ENV === 'development' ? error : undefined
    };
  }
  
  // Generic error handling
  return {
    errorMessage: "An unexpected error occurred during registration",
    error: process.env.NODE_ENV === 'development' ? serializeError(error) : undefined
  };
}

// Utility functions
function getMethodNames(obj: unknown): string[] {
  if (typeof obj !== 'object' || obj === null) return [];
  return Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
}

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  return { unknownError: error };
}

function isAPIError(error: unknown): error is { status: string; body: unknown } {
  return typeof error === 'object' && error !== null && 'status' in error;
}
export async function verifyPassword(userId: string, password: string): Promise<boolean> {
  console.log("[VerifyPassword] User ID:", userId);

  try {
    const found = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });

    if (!found?.password) {
      console.warn("[VerifyPassword] Password not set or user not found.");
      return false;
    }

    const match = await compare(password, found.password);
    return match;
  } catch (err) {
    console.error("[VerifyPassword] Error:", err);
    return false;
  }
}
