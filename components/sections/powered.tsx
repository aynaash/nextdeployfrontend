import Link from "next/link";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const logos = [
  {
    title: "Go",
    href: "https://go.dev/",
    icon: "Go",
  },
  {
    title: "Docker",
    href: "https://www.docker.com/",
    icon: "Docker",
  },
  {
    title: "Nginx",
    href: "https://www.nginx.com/",
    icon: "Nginx",
  },
  {
    title:"Caddy",
    href: "https://caddyserver.com/",
    icon: "Caddy",

  },
  {
    title: "Next.js",
    href: "https://nextjs.org/",
    icon: "Next.js",
  },
  {
   title:"ssh",
    href: "https://www.openssh.com/",
    icon: "SSH",
  },
    ];

export default function Powered() {
  return (
    <section className="py-12">
      <MaxWidthWrapper className="px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Built with modern technologies
          </h2>
          
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
            {logos.map((logo) => (
              <Link
                key={logo.title}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border bg-background p-4 text-center text-sm font-medium transition-colors hover:bg-muted/50"
              >
                {logo.icon}
              </Link>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
