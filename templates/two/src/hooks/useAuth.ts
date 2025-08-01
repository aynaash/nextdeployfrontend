'use client';

import { useEffect, useState } from 'react';

export type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export type Session = {
  user: User | null;
};

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error('Failed to fetch session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return {
    data: session,
    loading,
  };
};

export const signOut = async () => {
  try {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/sign-in";
  } catch (error) {
    console.error("Failed to sign out:", error);
  }
}; 