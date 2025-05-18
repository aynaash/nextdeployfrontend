
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/shared/icons"
import { passwordResetSchema } from "@/lib/validations/auth"

type FormData = z.infer<typeof passwordResetSchema>

export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(passwordResetSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      // Here you would call your API to send a password reset email
      // For now, we'll just simulate a successful request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Password reset email sent", {
        description: "Check your email for a link to reset your password",
      })

      reset()
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("Failed to send reset email", {
        description: "Please try again later",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Icons.spinner className="mr-2 size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </form>
  )
}
