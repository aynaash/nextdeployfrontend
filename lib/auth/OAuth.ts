// import { signIn, signUp } from "../../auth-client.ts";
//
// export const githubSignIn = async ({
//   setLoading,
//   setSuccess,
//   setError,
//   setPush,
// }: {
//   setLoading: (val: boolean) => void;
//   setSuccess: (val: string) => void;
//   setError: (val: string) => void;
//   setPush?: (val: boolean) => void; // Optional, since GitHub may not redirect in same way
// }) => {
//   console.log("[githubSignIn] Initiating GitHub sign-in process...");
//
//   try {
//     await signIn.social(
//       {
//         provider: "github",
//         callbackURL: "/",
//       },
//       {
//         onRequest: () => {
//           console.log("[githubSignIn] onRequest: Starting sign-in request");
//           setLoading(true);
//           setSuccess("");
//           setError("");
//         },
//         onResponse: () => {
//           console.log("[githubSignIn] onResponse: Received response");
//           setLoading(false);
//         },
//         onSuccess: () => {
//           console.log("[githubSignIn] onSuccess: Sign-in successful");
//           setSuccess("You are logged in successfully via GitHub");
//           setPush?.(true); // Optional chaining for push behavior
//         },
//         onError: (ctx) => {
//           console.error("[githubSignIn] onError: Sign-in failed", ctx?.error);
//           setError(ctx?.error?.message ?? "Unknown sign-in error");
//         },
//       }
//     );
//   } catch (err: unknown) {
//     console.error("[githubSignIn] catch block: Unexpected error", err);
//     setError("Something went wrong during GitHub sign-in");
//     setLoading(false);
//   }
// };
//
// export const githubSignUp = async ({
//   setLoading,
//   setSuccess,
//   setError,
//   setPush,
// }: {
//   setLoading: (val: boolean) => void;
//   setSuccess: (val: string) => void;
//   setError: (val: string) => void;
//   setPush?: (val: boolean) => void;
// }) => {
//   console.log("[githubSignUp] Initiating GitHub signup...");
//
//   try {
//     await signUp.social(
//       {
//         provider: "github",
//         callbackURL: "/",
//       },
//       {
//         onRequest: () => {
//           console.log("[githubSignUp] onRequest: Starting signup");
//           setLoading(true);
//           setSuccess("");
//           setError("");
//         },
//         onResponse: () => {
//           console.log("[githubSignUp] onResponse: Received response");
//           setLoading(false);
//         },
//         onSuccess: () => {
//           console.log("[githubSignUp] onSuccess: Signup successful");
//           setSuccess("Account created successfully with GitHub");
//           setPush?.(true);
//         },
//         onError: (ctx) => {
//           console.error("[githubSignUp] onError:", ctx?.error);
//           setError(ctx?.error?.message ?? "Signup failed");
//         },
//       }
//     );
//   } catch (error: unknown) {
//     console.error("[githubSignUp] Unexpected error:", error);
//     setError("Something went wrong during GitHub signup");
//     setLoading(false);
//   }
// };
//
//
// export const googleSignin = async ({
//   setLoading,
//   setSuccess,
//   setError,
//   setPush,
// }: {
//   setLoading: (val: boolean) => void;
//   setSuccess: (val: string) => void;
//   setError: (val: string) => void;
//   setPush: (val: boolean) => void;
// }) => {
//   console.log("[googleSignin] Attempting Google Sign-in...");
//
//   try {
//     await signIn.social(
//       { provider: "google" },
//       {
//         onRequest: () => {
//           console.log("[googleSignin] onRequest: Sign-in started");
//           setLoading(true);
//           setSuccess("");
//           setError("");
//         },
//         onResponse: () => {
//           console.log("[googleSignin] onResponse: Received response");
//           setLoading(false);
//         },
//         onSuccess: () => {
//           console.log("[googleSignin] onSuccess: Sign-in successful");
//           setSuccess("You are logged in successfully");
//           setPush(true);
//         },
//         onError: (ctx) => {
//           console.error("[googleSignin] onError: Sign-in failed", ctx.error);
//           setError(ctx?.error?.message ?? "An unknown error occurred");
//         },
//       }
//     );
//   } catch (err: unknown) {
//     console.error("[googleSignin] catch block: Unexpected error", err);
//     setError(err instanceof Error ? err.message : "Unknown error");
//     setLoading(false);
//   }
// };
// export const googleSignUp = async ({
//   setLoading,
//   setSuccess,
//   setError,
//   setPush,
// }: {
//   setLoading: (val: boolean) => void;
//   setSuccess: (val: string) => void;
//   setError: (val: string) => void;
//   setPush?: (val: boolean) => void;
// }) => {
//   console.log("[googleSignUp] Initiating Google signup...");
//
//   try {
//     await signUp.Email(
//       {
//         provider: "google",
//         callbackURL: "/",
//       },
//       {
//         onRequest: () => {
//           console.log("[googleSignUp] onRequest: Starting signup");
//           setLoading(true);
//           setSuccess("");
//           setError("");
//         },
//         onResponse: () => {
//           console.log("[googleSignUp] onResponse: Signup response received");
//           setLoading(false);
//         },
//         onSuccess: () => {
//           console.log("[googleSignUp] onSuccess: Signup successful");
//           setSuccess("Account created successfully with Google");
//           setPush?.(true);
//         },
//         onError: (ctx) => {
//           console.error("[googleSignUp] onError:", ctx?.error);
//           setError(ctx?.error?.message ?? "Signup failed");
//         },
//       }
//     );
//   } catch (error: unknown) {
//     console.log("The singup function object is:", signUp);
//     console.log("The signin function object is:", signIn)
//     console.error("[googleSignUp] Unexpected error:", error);
//     setError("Something went wrong during Google signup");
//     setLoading(false);
//   }
// };
//
//
/uth/;
