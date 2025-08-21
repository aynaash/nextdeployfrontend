"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function AuthCard({
  title,
  description,
  mode = "sign-in",
}: {
  title: string;
  description: string;
  mode?: "sign-in" | "sign-up";
}) {
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);

  return (
    <Card className="max-w-md w-full rounded-none border-dashed">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        <CardDescription className="text-xs md:text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className={cn(
            "w-full gap-2 flex items-center",
            "justify-between flex-col"
          )}>
            <SignInButton
              title="Sign in with Github"
              provider="github"
              loading={githubLoading}
              setLoading={setGithubLoading}
              callbackURL="/dashboard"
              icon={<Icons.Github />}
            />
            <SignInButton
              title="Sign in with Google"
              provider="google"
              loading={googleLoading}
              setLoading={setGoogleLoading}
              callbackURL="/dashboard"
              icon={<Icons.Google />}
            />
            <SignInButton
              title="Sign in with Discord"
              provider="discord"
              loading={discordLoading}
              setLoading={setDiscordLoading}
              callbackURL="/dashboard"
              icon={<Icons.Discord />}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-dashed pt-4">
        <p className="text-sm text-muted-foreground">
          {mode === "sign-in" ? (
            <>
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}

const SignInButton = ({
  title,
  provider,
  loading,
  setLoading,
  callbackURL,
  icon,
}: {
  title: string;
  provider: "github" | "google" | "discord";
  loading: boolean;
  setLoading: (loading: boolean) => void;
  callbackURL: string;
  icon: React.ReactNode;
}) => {
  return (
    <Button
      variant="outline"
      size="lg"
      className={cn("w-full gap-2 border-dashed")}
      disabled={loading}
      onClick={async () => {
        await signIn.social(
          {
            provider: provider,
            callbackURL: callbackURL
          },
          {
            onRequest: (ctx) => {
              setLoading(true);
            },
          },
        );
      }}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {title}
    </Button>
  )
}
