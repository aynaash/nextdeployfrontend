import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from '@/components/layout/navbar';
import { SiteFooter } from '@/components/layout/site-footer';
import { NavMobile } from '@/components/layout/mobile-nav';

export const metadata: Metadata = {
  title: "NextDeploy - CLI-First DevOps for Next.js",
  description: "Deploy Next.js apps and containers to your own infrastructure with zero vendor lock-in",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className='flex min-h-screen flex-col'>
            <NavMobile />
            <NavBar scroll={true} />
            <main className='flex-1'>{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
  );
}
