"use client";

import { authClient } from "@/lib/auth-client";

export default function SignoutButton() {
  return (
    <button
      className="bg-neutral-700 text-white p-2 rounded-md hover:bg-neutral-600 cursor-pointer"
      onClick={() => authClient.signOut()}
    >
      Signout
    </button>
  );
}
