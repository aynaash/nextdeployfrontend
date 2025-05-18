"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export function AuthErrorToast() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    if (error) {
      toast.error("Authentication Error", {
        description: getErrorMessage(error),
      });
    }
  }, [error]);

  return null;
}

function getErrorMessage(error: string) {
  switch (error) {
    case "OAuthAccountNotLinked":
      return "This email is already associated with another account";
    case "EmailSignin":
      return "Failed to send verification email";
    case "CredentialsSignin":
      return "Invalid credentials";
    case "SessionRequired":
      return "Please sign in to access this page";
    case "OAuthCallback":
      return "Error during OAuth callback";
    case "OAuthCreateAccount":
      return "Could not create OAuth account";
    case "EmailCreateAccount":
      return "Could not create email account";
    case "Callback":
      return "Error during authentication callback";
    case "OAuthSignin":
      return "Error during OAuth sign in";
    case "Default":
    default:
      return "An unexpected error occurred during authentication";
  }
}
