import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;
export const siteConfig: SiteConfig = {
  name: "NextDeploy",
  description:
    "NextDeploy is the developer-first platform to securely deploy any Dockerized app in seconds. Powered by Go, SSH, and automation-first workflows, it gives you full control of your DevOps pipeline across any VPS.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/nextdeployhq",
    github: "https://github.com/nextdeploy/nextdeploy",
  },
  mailSupport: "support@nextdeploy.io",
};
export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Partners", href: "/partners" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Platform",
    items: [
      { title: "Security", href: "/features/security" },
      { title: "Rollback", href: "/features/rollback" },
      { title: "Monitoring", href: "/features/monitoring" },
      { title: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Getting Started", href: "/docs" },
      { title: "CLI Reference", href: "/docs/cli" },
      { title: "Config Reference", href: "/docs/nextdeploy-yml" },
      { title: "Custom Daemons", href: "/docs/daemons" },
    ],
  },
];
