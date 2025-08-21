"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export const TopBar = ({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <header className="bg-[#2a2a2a]  h-16 px-6 flex items-center justify-between border-b border-[#424242] sticky top-0 w-full z-10 shadow-sm">
      <div className="flex items-center flex-1 max-w-xl gap-4">
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <button
          className="p-1 block lg:hidden text-[#7a7a7a]"
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Open Mobile Menu"
        >
          ☰
        </button>
        <button
          className="p-1 hidden lg:block text-[#7a7a7a]"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
        <div className="relative flex-1 ml-4 lg:ml-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a7a7a] w-5 h-5" />
          <input
            type="text"
            placeholder="Search anything here..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#424242] focus:outline-none focus:ring-2 focus:ring-[#7a7a7a] focus:border-transparent text-[#a3adc2]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 px-2 py-1 hover:bg-[#424242] cursor-pointer bg-[#242424] border border-[#424242] rounded-lg focus:outline-none">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-[#424242] animate-pulse" />
            ) : (
              <Image
                src={session?.user?.image || "/placeholder.png"}
                alt={session?.user?.name || "Username"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm font-medium text-[#7a7a7a]">
              {isPending ? "Loading..." : session?.user?.name || "Guest"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#242424] border border-[#424242] text-[#7a7a7a]"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#424242]" />
            <DropdownMenuItem className="hover:bg-[#424242]" onClick={() => router.push("/dashboard/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#424242]">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#424242]">
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#424242]" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
