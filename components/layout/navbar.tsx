"use client";
import Link from "next/link";
import { useSelectedLayoutSegment, useRouter } from "next/navigation";
import { authClient } from "../../auth-client.ts";
import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DocsSearch } from "@/components/docs/search";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import Logo from "../../components/logo.tsx";

interface NavBarProps {
  scroll?: boolean;
}

interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const selectedLayout = useSelectedLayoutSegment();

  const isDocsLayout = selectedLayout === "docs";
  
  // Define all possible layout configurations
  const layoutConfigs = {
    docs: docsConfig.mainNav,
    // Add other layout configurations here as needed
  } as const;

  // Safely get the appropriate nav items
  const getNavItems = () => {
    if (!selectedLayout) return marketingConfig.mainNav;
    
    const config = layoutConfigs[selectedLayout as keyof typeof layoutConfigs];
    return config || marketingConfig.mainNav;
  };

  const navItems = getNavItems();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all",
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      )}
    >
      <MaxWidthWrapper
        className="flex h-14 items-center justify-between py-4"
        large={isDocsLayout}
      >
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-1.5">
            <Logo />
          </Link>

          {navItems.length > 0 && (
            <nav className="hidden gap-6 md:flex">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${selectedLayout}`)
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {isDocsLayout && (
            <div className="hidden flex-1 items-center space-x-4 sm:justify-end lg:flex">
              <div className="hidden lg:flex lg:grow-0">
                <DocsSearch />
              </div>
              <div className="flex lg:hidden">
                <Icons.search className="size-6 text-muted-foreground" />
              </div>
              <div className="flex space-x-4">
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="size-7" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
          )}

          {!session ? (
            <Button
              className="hidden gap-2 px-5 md:flex"
              variant="default"
              size="sm"
              rounded="full"
              onClick={() => router.push("/login")}
            >
              <span>Sign In</span>
              <Icons.arrowRight className="size-4" />
            </Button>
          ) : (
            <Link
              href={session.user.role === "admin" ? "/admin" : "/dashboard"}
              className="hidden md:block"
            >
              <Button
                className="gap-2 px-5"
                variant="default"
                size="sm"
                rounded="full"
              >
                <span>Dashboard</span>
              </Button>
            </Link>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
