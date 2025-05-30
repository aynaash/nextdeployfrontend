// "use client"
//
// import * as React from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useSearchParams } from "next/navigation"
// import { signIn } from "next-auth/react"
// import Link from "next/link"
// import type { z } from "zod"
// import { cn } from "@/lib/utils"
// import { userAuthSchema } from "@/lib/validations/auth"
// import { signUp } from "../../lib/actions"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Icons } from "@/components/shared/icons"
// import { toast } from "sonner"
// import { Checkbox } from "@/components/ui/checkbox"
// import { PasswordStrengthIndicator } from "../../components/ui/password-strength-indicator.tsx"
// import {useRouter} from "next/navigation";
// type FormData = z.infer<typeof userAuthSchema>
//
// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
//   type?: "login" | "register"
// }
//
// export function UserAuthForm({ className, type = "login", ...props }: UserAuthFormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setError,
//     reset,
//     watch,
//   } = useForm<FormData>({
//     resolver: zodResolver(userAuthSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       ...(type === "register" && {
//         firstname: "",
//         lastname: "",
//       }),
//     },
//   })
//
//   const [isSocialLoading, setIsSocialLoading] = React.useState<"google" | "github" | null>(null)
//   const router = useRouter();
//   const searchParams = useSearchParams()
//   const callbackUrl = searchParams?.get("from") || "/dashboard"
//
//   const handleSocialSignIn = async (provider: "google" | "github") => {
//     try {
//       setIsSocialLoading(provider)
//       const result = await signIn(provider, { callbackUrl, redirect: false })
//
//       if (!result?.ok) {
//         throw new Error(result?.error || "Authentication failed")
//       }
//
//       // If we get here without redirect, manually redirect
//       window.location.href = result.url || callbackUrl
//     } catch (error) {
//       console.error(`${provider} authentication error:`, error)
//       toast.error(`${provider} sign in failed`, {
//         description: "There was an error signing in. Please try again.",
//       })
//     } finally {
//       setIsSocialLoading(null)
//     }
//   }
//
//   const handleSignUp = async (data: FormData) => {
//     try {
//       const result = await signUp(data)
//
//       if (result?.error) {
//         // Handle field-specific errors
//         if (result.fieldErrors) {
//           Object.entries(result.fieldErrors).forEach(([field, message]) => {
//             setError(field as keyof FormData, { message })
//           })
//         }
//
//         toast.error(result.error, {
//           description: "Please correct the errors and try again.",
//         })
//         return
//       }
//
//       // Successful registration
//       toast.success("Account created successfully!", {
//         description: "You can now sign in to your account.",
//       })
//       reset()
//
//       // Auto sign-in after registration
//       await signIn("credentials", {
//         email: data.email.toLowerCase(),
//         password: data.password,
//         redirect: true,
//         callbackUrl,
//       })
//     } catch (error) {
//       console.error("Registration error:", error)
//       toast.error("Registration failed", {
//         description: "An unexpected error occurred. Please try again later.",
//       })
//     }
//   }
//
//   const handleEmailSignIn = async (data: FormData) => {
//     try {
//       const result = await signIn("resend", {
//         email: data.email.toLowerCase(),
//         redirect: false,
//         callbackUrl,
//       })
//
//       if (!result?.ok) {
//         throw new Error("Sign in failed")
//       }
//
//       toast.success("Check your email", {
//         description: "We've sent you a magic login link.",
//       })
//     } catch (error) {
//       toast.error("Sign in failed", {
//         description: "Could not sign in. Please check your email and try again.",
//       })
//     }
//   }
//
//   const onSubmit = async (data: FormData) => {
//     if (type === "register") {
//       const singup = await handleSignUp(data);
//       if(signup.success){
//         router.push("/dashboard")
//       }
//     } else {
//       await handleEmailSignIn(data)
//     }
//   }
//
//   return (
//     <div className={cn("grid gap-6", className)} {...props}>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//         {type === "register" && (
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1">
//               <Label htmlFor="firstname">First Name</Label>
//               <Input
//                 id="firstname"
//                 {...register("firstname")}
//                 disabled={isSubmitting}
//                 aria-invalid={!!errors.firstname}
//                 aria-describedby="firstname-error"
//               />
//               {errors.firstname && (
//                 <p id="firstname-error" className="text-xs text-red-600">
//                   {errors.firstname.message}
//                 </p>
//               )}
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="lastname">Last Name</Label>
//               <Input
//                 id="lastname"
//                 {...register("lastname")}
//                 disabled={isSubmitting}
//                 aria-invalid={!!errors.lastname}
//                 aria-describedby="lastname-error"
//               />
//               {errors.lastname && (
//                 <p id="lastname-error" className="text-xs text-red-600">
//                   {errors.lastname.message}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//
//         <div className="space-y-1">
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="you@nextdeploy.one"
//             autoComplete="email"
//             {...register("email")}
//             disabled={isSubmitting}
//             aria-invalid={!!errors.email}
//             aria-describedby="email-error"
//           />
//           {errors.email && (
//             <p id="email-error" className="text-xs text-red-600">
//               {errors.email.message}
//             </p>
//           )}
//         </div>
//
//         {type === "register" && (
//           <div className="space-y-1">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               {...register("password")}
//               disabled={isSubmitting}
//               aria-invalid={!!errors.password}
//               aria-describedby="password-error password-strength"
//             />
//             {/* Add password strength indicator */}
//             <PasswordStrengthIndicator password={watch("password")} id="password-strength" />
//             <div className="text-xs text-muted-foreground mt-1">Must be at least 8 characters with one number</div>
//             {errors.password && (
//               <p id="password-error" className="text-xs text-red-600">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>
//         )}
//
//         {type === "login" && (
//           <div className="flex items-center space-x-2 mt-2">
//             <Checkbox id="remember" {...register("remember")} />
//             <Label htmlFor="remember" className="text-sm">
//               Remember me
//             </Label>
//           </div>
//         )}
//
//         <Button type="submit" className="w-full" disabled={isSubmitting} aria-live="polite" aria-busy={isSubmitting}>
//           {isSubmitting && <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden="true" />}
//           {type === "register" ? "Sign Up with Email" : "Sign In with Email"}
//         </Button>
//       </form>
//
//       <div className="relative my-4">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//         </div>
//       </div>
//
//       <div className="grid grid-cols-2 gap-2">
//         <Button
//           type="button"
//           variant="outline"
//           disabled={!!isSocialLoading}
//           onClick={() => handleSocialSignIn("google")}
//           aria-label="Sign in with Google"
//         >
//           {isSocialLoading === "google" ? (
//             <Icons.spinner className="mr-2 size-4 animate-spin" />
//           ) : (
//             <Icons.google className="mr-2 size-4" />
//           )}
//           Google
//         </Button>
//
//         <Button
//           type="button"
//           variant="outline"
//           disabled={!!isSocialLoading}
//           onClick={() => handleSocialSignIn("github")}
//           aria-label="Sign in with GitHub"
//         >
//           {isSocialLoading === "github" ? (
//             <Icons.spinner className="mr-2 size-4 animate-spin" />
//           ) : (
//             <Icons.gitHub className="mr-2 size-4" />
//           )}
//           GitHub
//         </Button>
//       </div>
//
//       <p className="text-center text-sm text-muted-foreground">
//         {type === "register" ? (
//           <>
//             Already have an account?{" "}
//             <Link
//               href="/login"
//               className="underline underline-offset-4 hover:text-primary"
//               aria-label="Sign in instead"
//             >
//               Sign in
//             </Link>
//           </>
//         ) : (
//           <>
//             Don't have an account?{" "}
//             <Link
//               href="/register"
//               className="underline underline-offset-4 hover:text-primary"
//               aria-label="Sign up instead"
//             >
//               Sign up
//             </Link>
//           </>
//         )}
//       </p>
//     </div>
//   )
// }
