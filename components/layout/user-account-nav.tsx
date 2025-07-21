"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Lock, LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "../../auth-client.ts";
import { Drawer } from "vaul";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";

export function UserAccountNav() {
  const { data: session } = useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const { isMobile } = useMediaQuery();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect after sign out if needed
      window.location.href = `${window.location.origin}/`;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return <div className="size-8 animate-pulse rounded-full border bg-muted" />;
  }

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <button>
            <UserAvatar
              user={{ 
                name: user.name, 
               image: typeof user.image === "string" ? user.image : null,
              }}
              className="size-9 border"
            />
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background px-3 text-sm">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>

            <div className="flex items-center justify-start gap-2 p-2">
              <UserAvatar
                user={{ 
                  name: user.name,
                  image: typeof user.image === "string" ? user.image : null,
                }}
                className="size-10 border"
              />
              <div className="flex flex-col">
                {user.name && <p className="font-medium">{user.name}</p>}
                {user.email && (
                  <p className="w-[200px] truncate text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <ul className="mb-14 mt-1 w-full space-y-1 text-muted-foreground">
              {user.role === "ADMIN" && (
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-foreground hover:bg-muted"
                    legacyBehavior>
                    <Lock className="size-4" />
                    <p className="text-sm">Admin</p>
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-foreground hover:bg-muted"
                  legacyBehavior>
                  <LayoutDashboard className="size-4" />
                  <p className="text-sm">Dashboard</p>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-foreground hover:bg-muted"
                  legacyBehavior>
                  <Settings className="size-4" />
                  <p className="text-sm">Settings</p>
                </Link>
              </li>

              <li>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-foreground hover:bg-muted"
                >
                  <LogOut className="size-4" />
                  <p className="text-sm">Log out</p>
                </button>
              </li>
            </ul>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button>
          <UserAvatar
            user={{ 
              name: user.name,
              image: typeof user.image === "string" ? user.image : null,
            }}
            className="size-8 border"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <UserAvatar
            user={{ 
              name: user.name,
              image: typeof user.image === "string" ? user.image : null,
            }}
            className="size-8 border"
          />
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        {user.role === "ADMIN" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2" legacyBehavior>
                <Lock className="size-4" />
                <span>Admin</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-2" legacyBehavior>
            <LayoutDashboard className="size-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2"
            legacyBehavior>
            <Settings className="size-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
          onSelect={handleSignOut}
        >
          <div className="flex items-center gap-2">
            <LogOut className="size-4" />
            <span>Log out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
