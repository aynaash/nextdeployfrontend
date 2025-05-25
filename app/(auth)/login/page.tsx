"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import Link from "next/link";
import { client } from "@/lib/auth-client";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof SignInSchema>;

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);

    try {
      await client.signIn.email({
        ...data,
        fetchOptions: {
          onResponse: () => {
            setIsLoading(false);
          },
          onRequest: () => {
            setIsLoading(true);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: async () => {
            router.replace("/");
          },
        },
      });
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="max-w-md mx-auto w-full p-6 border rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            register={register}
            errors={errors}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
          />

          <Button
            type="submit"
            variant="default"
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <div className="flex items-center gap-1 text-[.8rem] mt-2">
          <p>need to create an account?</p>
          <Link href="/auth/register" className="text-blue-400">
            Sign up.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
