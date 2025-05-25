"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { authClient as client } from "../../../auth-client.ts";
import { Label } from "@/components/ui/label";

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      console.log("Submitting registration data:", data);

      const signResponse = await client.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
         role:"USER",
        },
        {
          fetchOptions: {
            // Adjust depending on client SDK: is this right here?
            // This should NOT be inside the data payload.
            // Confirm with your SDK docs.
          },
        }
      );

      console.log("Signup response:", signResponse);

      if (signResponse.error) {
        toast.error(signResponse.error.message);
      } else {
        toast.success("Registered successfully!");
        router.replace("/");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="max-w-md w-full mx-auto p-6 border rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" disabled={isLoading}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Enter your name"
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" variant="default" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
        <div className="flex items-center gap-1 text-[.8rem] mt-2">
          <p>Already have an account?</p>
          <Link href="/auth/signin" className="text-blue-400">
            Sign in.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
