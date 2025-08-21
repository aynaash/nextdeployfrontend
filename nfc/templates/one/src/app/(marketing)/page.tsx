"use client";

import { useState } from "react";
import ThemeToggler from "@/components/theme/toggler";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/user-profile";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import { PanelsTopLeft, Shield, Database, Server, Component, Code, ArrowRight, Sparkle, Github, Copy, Check, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const { data: session, isPending } = useSession();

  const handleCopy = () => {
    navigator.clipboard.writeText(`git clone ${siteConfig.socials.github}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="w-full h-auto md:h-screen overflow-y-auto md:overflow-hidden flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto border border-dashed flex flex-col my-2">
        <div className="w-full flex justify-between divide-x">
          <div className="relative hidden md:flex w-1/3 aspect-square bg-black items-center justify-center group/titan border-dashed">
            <Goku />
            <div className="absolute top-0 left-0 size-4 border-t-2 border-l-2 border-foreground opacity-0 group-hover/titan:opacity-100 transition-all duration-200"></div>
            <div className="absolute top-0 right-0 size-4 border-t-2 border-r-2 border-foreground opacity-0 group-hover/titan:opacity-100 transition-all duration-200"></div>
            <div className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-foreground opacity-0 group-hover/titan:opacity-100 transition-all duration-200"></div>
            <div className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-foreground opacity-0 group-hover/titan:opacity-100 transition-all duration-200"></div>
          </div>
          <div className="flex-1 flex flex-col">
            <div id="nav" className="w-full flex items-center justify-end border-b border-dashed divide-x">
              <div id="brand" className="font-mono text-sm flex-1 flex items-center h-full px-3 border-dashed">
                <Link href="/" className="hover:underline">{siteConfig.origin.replace("https://", "")}</Link>
              </div>
              {!isPending && (session ? (
                <Button className="h-full border-dashed" size="lg" variant="ghost" asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 group/nav">
                    <span>Dashboard</span>
                    <div className="relative z-10 size-4 overflow-hidden flex items-center justify-center">
                      <ArrowUpRight className="-z-10 absolute opacity-100 scale-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover/nav:-translate-y-5 group-hover/nav:translate-x-5 group-hover/nav:opacity-0 group-hover/nav:scale-0 transition-all duration-200" />
                      <ArrowUpRight className="absolute -z-10 -bottom-4 -left-4 opacity-0 scale-0 group-hover/nav:-translate-y-[15px] group-hover/nav:translate-x-4 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-200" />
                    </div>
                  </Link>
                </Button>
              ) : (
                <Button className="h-full border-dashed" size="lg" variant="ghost" asChild>
                  <Link href="/sign-in" className="flex items-center gap-2 group/nav">
                    <span>Sign In</span>
                    <div className="relative z-10 size-4 overflow-hidden flex items-center justify-center">
                      <ArrowUpRight className="-z-10 absolute opacity-100 scale-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover/nav:-translate-y-5 group-hover/nav:translate-x-5 group-hover/nav:opacity-0 group-hover/nav:scale-0 transition-all duration-200" />
                      <ArrowUpRight className="absolute -z-10 -bottom-4 -left-4 opacity-0 scale-0 group-hover/nav:-translate-y-[15px] group-hover/nav:translate-x-4 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-200" />
                    </div>
                  </Link>
                </Button>
              ))}
              <UserProfile className="border-dashed size-10 md:size-14" />
              <ThemeToggler className="border-dashed size-10 md:size-14" />
            </div>
            <div id="hero" className="flex flex-col p-4">
              <h1 className="head-text-md">Titan</h1>
              <p className="text-muted-foreground max-w-3xl">{siteConfig.description}</p>
            </div>
            <div id="code" className="flex flex-col p-4">
              <div className="p-2 border border-dashed hover:border-primary/50 bg-card text-xs md:text-sm flex items-center justify-between transition-all duration-200 delay-75">
                <pre className="font-mono bg-linear-to-r from-muted-foreground to-foreground bg-clip-text text-transparent">
                  git clone {siteConfig.socials.github}
                </pre>
                <Button variant="ghost" size="icon" className="size-5 cursor-pointer group/copy" onClick={handleCopy}>
                  {copied ? <Check className="size-3" /> : <Copy className="size-3 group-hover/copy:text-foreground" />}
                </Button>
              </div>
            </div>
            <div id="cta" className="flex items-center gap-4 p-4">
              <Button variant="outline" asChild className="relative border-dashed">
                <a href={siteConfig.socials.github} target="_blank" className="gap-2 group">
                  <div className="w-full h-[1px] bg-linear-to-r from-primary/0 via-primary to-primary/0 absolute top-0 -left-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <Github className="size-4" />
                  <span>GitHub</span>
                </a>
              </Button>
              <Button asChild>
                <Link href="/dashboard" className="gap-2 group">
                  <span>Get started</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-all duration-150" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div id="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-dashed">
          {techConfig.map((tech, index) => (
            <a
              key={index}
              href={tech.link}
              target="_blank"
              className={cn(
                "relative w-full p-6 hover:bg-muted/50 transition-all duration-150 group/item border-dashed",
                {
                  "border-b": index < techConfig.length - 1,
                  "md:border-b-0": index >= techConfig.length - 2,
                  "md:border-b": index < techConfig.length - 2,
                  "lg:border-b-0": index >= techConfig.length - 3,
                  "lg:border-b": index < techConfig.length - 3,
                },
                {
                  "md:border-r": index % 2 === 0 && index !== techConfig.length - 1,
                  "lg:border-r": index % 3 !== 2 && index !== techConfig.length - 1,
                }
              )}
            >
              {(index === 0 || index === techConfig.length - 1) && (
                <Sparkle className={cn("absolute w-4 h-4 z-10 fill-current hidden md:block", {
                  "-bottom-2 -right-2": index === 0,
                  "-top-2 -left-2": index === techConfig.length - 1,
                })} />
              )}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="group-hover/item:animate-pulse">{tech.icon}</span>
                  <h3 className="text-zinc-500 dark:text-zinc-400 text-base font-semibold">{tech.category}</h3>
                </div>
                <ArrowRight className="size-4 opacity-0 scale-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:-translate-x-0 group-hover/item:scale-100 transition-all duration-150" />
              </div>
              <h1 className="text-xl font-semibold font-heading tracking-tight mb-2">{tech.name}</h1>
              <p className="text-sm text-muted-foreground">
                {tech.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

const techConfig = [
  {
    icon: <PanelsTopLeft className="size-4" />,
    category: "Full-stack Framework",
    name: "Next.js 15",
    description: "Modern, full-stack React framework for building web applications.",
    link: "https://nextjs.org"
  },
  {
    icon: <Shield className="size-4" />,
    category: "Authentication",
    name: "Better-Auth",
    description: "Secure authentication solution with OAuth, email/password, magic links, and more",
    link: "https://better-auth.com"
  },
  {
    icon: <Database className="size-4" />,
    category: "ORM",
    name: "Drizzle ORM",
    description: "TypeScript ORM with a focus on type safety and developer experience.",
    link: "https://orm.drizzle.team/"
  },
  {
    icon: <Server className="size-4" />,
    category: "Database",
    name: "Postgres",
    description: "It's a Postgres database, what else do you need?",
    link: "https://neon.tech"
  },
  {
    icon: <Component className="size-4" />,
    category: "UI Components",
    name: "ShadCN/UI",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
    link: "https://ui.shadcn.com"
  },
  {
    icon: <Code className="size-4" />,
    category: "CSS Framework",
    name: "Tailwindcss v4",
    description: "Utility-first CSS framework for rapidly building custom user interfaces.",
    link: "https://tailwindcss.com"
  },
];

export const Goku = () => {
  return (
    <svg className="w-full h-full aspect-square" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="goku" clipPath="url(#clip0_1141_1601)">
        <path id="Vector" fillRule="evenodd" clipRule="evenodd" d="M0.0722656 0.204346H399.882V399.872H0.0722656V0.204346Z" fill="black" />
        <path id="Vector_2" fillRule="evenodd" clipRule="evenodd" d="M262.811 118.287C261.56 111.912 259.244 101.951 257.168 96.1805L256.208 95.7239C254.426 94.5574 257.031 97.434 255.647 95.2205C253.763 92.2074 253.673 83.745 251.518 80.051C249.507 84.017 251.778 84.2197 251.02 93.5286C249.241 115.395 238.663 133.793 227.446 151.765C225.825 154.36 215.936 170.505 214.701 171.524C212.887 170.507 212.827 169.389 211.859 167.275L205.418 153.069C198.008 135.881 193.141 117.837 192.189 98.8198C192 95.0707 192.81 88.8868 191.436 86.0036C189.351 87.6575 186.749 102.178 186.168 105.793C184.884 113.79 184.835 120.049 184.523 128.412C181.926 121.847 185.227 103.026 186.961 95.4133C187.478 93.1365 189.717 87.8602 188.009 85.8031C185.016 94.2942 180.024 102.41 176.157 110.458C172.233 118.626 166.285 127.16 166.52 136.884C166.706 144.55 172.119 182.755 173.822 192.436C174.117 194.114 174.086 198.797 175.573 199.58C176.547 197.724 169.254 152.491 168.346 146.611C165.803 130.152 170.499 123.765 176.818 110.741C178.038 108.227 179.845 101.889 182.506 100.853C181.992 107.277 179.861 114.559 179.073 121.547C178.141 129.843 178.846 135.24 180.06 142.879C181.047 149.097 185.543 179.883 187.206 182.472C188.886 181.9 188.629 181.789 189.949 180.921C190.581 174.524 184.528 159.754 184.209 152.365C186.636 153.813 192.615 168.498 194.422 172.433C195.54 174.865 195.983 177.881 199.367 177.823L199.67 176.967C199.989 175.174 198.848 173.028 198.291 171.36C195.094 161.78 185.425 133.287 188.793 126.028C189.594 128.533 189.825 136.812 190.439 140.352C191.58 146.941 198.761 175.068 202.541 177.063C203.438 175.17 199.687 166.507 199.103 164.678C198.381 162.415 195.19 154.163 195.666 152.915C196.642 154.07 200.867 166.649 201.803 169.294C202.625 171.622 203.521 175.495 205.326 176.888C206.868 178.078 211.193 180.161 213.116 180.529C214.969 178.91 221.781 166.768 223.604 163.759C230.432 152.481 237.454 141.304 242.735 128.883C244.051 125.789 248.438 112.574 250.129 110.043C252.045 112.803 247.892 130.099 246.796 133.69C242.604 147.415 231.443 167.061 223.89 179.921C222.083 182.998 219.605 185.669 219.244 189.379C221.952 188.117 223.97 185.259 225.817 183.403C229.473 179.728 229.34 181.009 234.199 181.228C234.811 179.822 242.095 167.729 243.031 167.216C243.801 173.674 238.182 180.493 238.154 185.017C238.133 188.34 240.754 188.922 241.072 193.398C241.334 197.102 240.397 200.491 240.666 203.902C244.014 202.648 248.395 196.701 251.751 195.495C250.293 199.997 241.311 202.4 239.666 207.843C237.593 214.704 237.427 222.226 238.109 229.906C240.112 230.882 240.117 229.771 241.432 231.745C242.158 232.835 242.253 234.105 242.925 235.195C242.258 235.962 241.278 236.527 240.711 237.349C239.571 239.003 240.641 238.749 239.009 240.464C238.188 241.328 234.416 244.265 233.58 244.581L234.46 239.766C230.98 240.829 225.199 244.599 223.838 248.072C220.835 255.738 214.681 249.29 213.21 255.143C214.693 254.951 216.017 254.473 217.347 254.086C218.112 253.861 218.898 253.599 219.545 253.595C222.761 253.575 220.038 254.703 231.093 254.632L232.392 257.572C225.684 258.128 223.632 260.438 218.917 263.212C213.117 266.623 211.762 259.224 206.326 259.601C205.185 262.29 205.441 264.407 205.418 267.969C205.365 275.76 204.582 272.308 207.624 274.838C207.566 275.457 207.679 276.631 207.676 276.659C207.491 279.035 206.31 278.072 206.897 281.181C208.073 281.873 207.928 281.593 208.967 282.003L211.153 283.296C210 285.465 207.548 285.851 205.821 287.524C206.003 289.591 206.525 289.899 207.636 291.258C212.078 291.5 213.945 289.126 216.827 287.013C223.958 281.781 232.731 276.626 235.603 267.724L244.536 238.023C246.137 231.993 244.129 231.479 242.576 227.796C244.023 225.256 247.488 223.835 248.253 219.353C249.291 213.263 246.529 212.213 245.652 208.767C250.876 205.978 253.419 202.793 257.494 198.689C260.097 196.065 265.673 189.232 268.731 188.013C267.354 191.375 257.539 199.911 253.721 203.893C250.178 207.589 247.388 208.037 249.038 213.488C251.602 221.964 247.781 221.338 247.514 225.628C252.374 224.885 275.759 196.964 278.222 193.005C282.052 186.85 286.521 178.631 288.965 172.023C290.485 167.916 294.646 150.579 295.291 146.115C293.371 147.047 293.398 147.691 292.276 149.459C291.615 150.501 291.087 151.304 290.313 152.57C289.945 151.986 289.268 153.826 290.351 151.168C291.122 149.279 292.423 148.371 293.004 146.328C287.494 148.808 260.031 171.618 252.952 176.877C258.83 174.871 272.302 161.286 277.605 160.074C276.281 163.012 252.876 186.143 247.66 186.951C247.796 182.716 252.264 169.988 253.769 164.925C257.634 151.934 265.371 131.315 262.811 118.287Z" fill="white" />
        <path id="Vector_3" fillRule="evenodd" clipRule="evenodd" d="M199.368 130.832C200.435 129.103 200.795 126.861 201.441 124.771C201.788 123.649 202.083 123.014 202.548 121.654C203.079 120.103 203.201 119.303 204.287 118.211C204.061 120.203 203.159 122.551 203.599 123.762C204.593 122.891 204.695 121.34 205.002 119.763C206.068 114.284 212.065 89.5086 213.075 87.7137C213.506 96.8133 205.968 116.148 205.301 123.577C207.927 118.876 211.408 103.549 212.635 96.8656L214.702 87.2273C216.236 89.8087 215.102 123.314 214.558 129.976C214.107 135.48 213.204 138.432 217.875 140.571C219.889 139.914 221.542 137.833 222.909 136.11C224.995 133.483 224.688 130.832 224.613 127.367L222.634 71.7009C223.892 72.1256 223.919 83.1369 223.973 85.0799C224.124 90.4658 224.432 95.3554 224.62 100.395C224.995 110.514 225.469 120.526 226.019 130.921C227.89 130.57 233.818 122.559 235.116 120.811C240.177 113.994 239.29 113.51 241.886 107.518C248.624 91.9743 246.281 91.8025 242.26 76.6924C237.002 56.9346 232.75 53.603 219.447 40.1651C216.96 37.6525 211.901 31.5303 208.675 30.4023C208.619 43.343 213.476 47.1625 211.07 59.1679C209.8 65.5088 204.827 76.2876 202.33 82.2066C196.034 97.1195 194.981 94.4489 199.301 105.766C201.542 111.64 203.583 119.112 200.72 125.493C199.928 127.257 198.067 129.121 199.368 130.832Z" fill="white" />
        <path id="Vector_4" fillRule="evenodd" clipRule="evenodd" d="M181.39 55.6558C180.849 54.5691 188.384 47.2793 189.382 44.7711C186.969 45.4018 182.354 49.3353 180.727 50.5745C163.439 63.7503 157.807 70.6182 151.236 92.4486C150.721 94.1571 144.112 112.32 145.434 114.002C148.33 105.004 153.733 88.2353 156.797 80.0791C158.999 74.2136 161.828 69.8455 165.547 66.0668C167.047 64.5428 175.26 55.4377 177.539 55.0004C177.262 56.5188 170.096 67.7675 167.865 72.5894C162.738 83.6745 159.593 103.389 157.136 116.818C156.426 120.698 155.415 124.482 154.753 128.103C154.066 131.867 155.354 136.958 158.528 137.909C158.71 135.233 158.58 131.459 159.711 129.695C160.66 131.518 157.381 144.226 165.68 147.6C165.807 134.707 164.013 127.934 167.875 112.345C169.2 106.996 171.216 102.774 172.285 97.6753C173.505 91.8648 173.931 86.9328 175.883 82.0955C175.925 87.2935 171 110.874 171.872 112.987C173.605 112.262 183.311 93.4482 185.065 90.3067C187.427 86.0714 187.849 86.6706 187.866 80.8557C187.918 62.6311 195.897 48.4992 196.19 40.7021C194.248 41.2364 182.216 54.3659 181.39 55.6558Z" fill="white" />
        <path id="Vector_5" fillRule="evenodd" clipRule="evenodd" d="M146.6 329.018C152.56 328.46 170.31 327.407 174.657 328.752C172.491 330.12 158.339 330.217 155.932 334.038C161.103 336.461 176.439 332.561 185.234 337.632C191.818 341.428 198.406 355.58 202.511 352.052C204.327 350.49 201.701 337.157 203.863 334.376C207.038 329.318 233.023 335.974 237.075 337.553C242.113 339.515 246.047 343.158 251.181 340.909C255.456 339.035 262.155 336.439 262.181 332.327L245.226 329.914L247.643 328.88C257.21 327.032 264.299 333.195 265.576 326.638C260.039 322.147 240.055 322.379 232.707 323.043C227.662 323.499 222.226 324.856 217.518 326.298C211.652 328.094 208.272 329.77 201.519 328.62C194.119 327.359 189.339 321.631 171.344 321.294C165.299 321.18 159.508 321.64 154.191 322.702C151.663 323.207 141.573 324.954 139.576 326.638C140.896 330.477 142.039 329.445 146.6 329.018Z" fill="white" />
        <path id="Vector_6" fillRule="evenodd" clipRule="evenodd" d="M253.229 173.936C255.448 173.179 259.044 170.237 261.221 168.568C266.167 164.778 265.625 158.62 267.688 149.097C268.152 146.951 268.958 140.608 270.231 138.859C270.013 143.784 265.625 162.164 266.456 164.276C267.401 162.166 268.148 156.788 268.721 153.875C269.119 151.853 270.124 145.164 271.278 143.889C271.779 145.365 268.829 158.813 268.458 162.036C271.393 161.594 273.635 159.791 275.241 157.755C278.68 153.394 279.072 136.842 278.743 131.064C278.518 127.091 278.062 125.335 277.461 122.4C276.946 119.884 276.957 115.613 276.854 113.049C276.713 109.541 277.037 95.6798 276.037 93.6733C273.475 94.8437 272.393 100.483 272.254 103.027C272.091 105.987 270.36 110.176 269.404 112.798C266.706 120.21 265.633 125.121 264.17 133.379C262.272 144.097 253.468 171.069 253.229 173.936Z" fill="white" />
        <path id="Vector_7" fillRule="evenodd" clipRule="evenodd" d="M199.977 188.152C203.49 185.939 208.863 185.899 212.218 183.395C211.333 181.627 208.551 179.445 206.554 178.954C199.734 177.282 190.869 180.915 186.107 187.038C183.236 190.73 180.695 194.865 178.218 198.717C176.344 201.631 176.809 213.788 178.216 215.681L180.685 212.516C180.741 212.302 180.919 212.306 181.177 212.236L179.679 225.243C181.063 223.695 181.966 218.834 184.349 214.332C191.026 201.715 198.846 198.872 210.733 194.801C210.041 193.182 210.507 195.043 209.865 192.986C215.567 192.5 214.389 193.384 218.445 194.071C218.25 184.034 212.393 184.795 205.236 187.068C203.627 187.58 201.232 188.908 199.977 188.152Z" fill="white" />
        <path id="Vector_8" fillRule="evenodd" clipRule="evenodd" d="M267.458 229.038C268.497 226.737 269.209 226.97 271.577 224.929C275.449 221.593 299.362 203.04 300.422 200.217C296.006 200.726 289.303 203.095 284.631 204.233C279.799 205.411 276.196 206.329 274.321 211.161C273.08 214.357 272.214 213.268 268.054 217.172C266.298 218.821 265.125 220.13 263.525 222.157C260.313 226.23 260.563 231.487 259.947 238.666C264.484 237.571 267.001 233.241 271.322 231.952C270.304 234.4 266.834 235.855 264.868 237.238C261.658 239.495 258.998 240.568 258.643 242.511C263.131 241.138 270.353 233.413 275.83 231.741C274.991 235.24 273.023 235.933 272.356 238.846C273.662 238.179 296.191 207.249 296.533 205.774C290.73 209.741 270.523 227.975 267.458 229.038Z" fill="white" />
        <path id="Vector_9" fillRule="evenodd" clipRule="evenodd" d="M199.896 228.164C202.008 227.401 200.237 227.21 202.489 226.231L202.482 235.195C202.474 239.738 203.114 242.475 200.544 242.493C200.316 242.494 199.37 242.4 199.22 242.377C196.242 241.933 195.808 241.344 194.242 239.282C192.798 237.382 190.752 234.571 188.6 233.476C188.818 236.412 191.309 242.393 192.388 245.305C192.962 246.86 193.742 249.145 194.523 250.569C195.648 252.618 196.851 252.734 197.928 254.598C198.691 254.211 199.993 253.402 199.869 252.571L200.794 255.975C203.302 255.118 201.908 254.875 203.249 255.252C204.829 255.694 202.904 256.113 205.506 256.096C206.925 251.388 205.098 247.395 207.821 242.648C215.138 229.886 220.197 236.872 217.903 222.401C217.193 217.927 215.471 215.019 212.586 212.502C208.86 212.365 203.554 215.078 201.955 217.189C200.175 219.538 197.515 225.054 199.896 228.164Z" fill="white" />
        <path id="Vector_10" fillRule="evenodd" clipRule="evenodd" d="M218.356 198.83C221.235 197.861 220.78 196.547 224.232 196.632C227.048 201.005 226.493 203.151 226.53 209.296C226.545 211.856 225.88 215.66 226.864 217.183C228.003 215.979 228.293 214.213 228.907 212.351C229.74 209.813 229.718 208.826 231.363 207.319C231.253 214.049 228.842 223.634 226.406 228.953C224.651 232.785 224.426 232.12 222.688 233.026C221.364 233.718 222.769 232.588 221.695 233.688C221.575 233.81 220.647 235.66 220.588 235.794C219.553 238.149 217.08 242.14 216.699 244.805C220.732 243.25 228.419 232.909 231.135 228.317C235.242 221.368 237.465 214.267 238.802 205.304C239.325 201.802 240.337 192.766 238.427 189.748L234.196 184.51C228.693 177.335 218.583 191.508 218.356 198.83Z" fill="white" />
        <path id="Vector_11" fillRule="evenodd" clipRule="evenodd" d="M160.681 144.884C151.213 132.42 143.283 119.769 136.823 105.803C136.031 104.09 134.56 98.7789 132.75 97.6719C132.76 109.084 142.107 130.835 146.328 139.663C150.141 147.633 162.086 170.749 168.623 172.751C169.121 167.543 165.859 164.9 163.538 161.592C159.64 156.032 146.633 135.518 145.616 131.258C148.293 135.808 164.431 161.979 167.695 163.416C166.743 151.966 166.289 152.265 160.681 144.884Z" fill="white" />
        <path id="Vector_12" fillRule="evenodd" clipRule="evenodd" d="M221.631 323.433C223.208 323.417 225.6 323.047 226.991 322.688C229.88 321.941 229.017 321.833 229.064 318.196C229.16 310.473 235.163 293.39 238.005 290.794L240.081 308.089C247.3 306.652 245.169 278.479 243.782 276.47C242.781 275.019 241.541 276.809 238.624 272.077C238.198 271.386 238.282 271.533 237.965 271.102L237.436 270.526C233.683 274.079 230.397 289.339 228.447 296.03C226.703 302.007 221.13 318.331 221.631 323.433Z" fill="white" />
        <path id="Vector_13" fillRule="evenodd" clipRule="evenodd" d="M151.906 169.008C157.721 178.952 155.546 175.089 157.505 174.011C158.516 175.93 158.308 175.565 159.372 176.235C158.634 171.738 153.467 160.176 151.627 155.585C145.727 140.868 139.533 131.567 135.099 116.031C133.88 111.762 131.295 95.7393 130.101 93.5198C128.693 95.6149 129.709 99.8392 130.79 105.909C134.85 128.698 140.233 149.045 151.906 169.008Z" fill="white" />
        <path id="Vector_14" fillRule="evenodd" clipRule="evenodd" d="M246.296 76.4975C247.249 74.3573 247.682 72.4764 249.203 71.2372L247.776 85.2733C249.682 84.2737 249.825 78.0909 251.186 75.9859C253.899 79.2386 261.739 111.35 263.875 112.21C264.9 109.376 265.822 108.196 266.011 106.72C266.303 104.431 265.542 102.004 265.06 99.924C263.976 95.2624 262.711 91.5966 261.097 87.3827C260.327 85.3702 252.641 66.9017 250.657 64.8264C249.662 66.4677 250.562 67.3401 248.819 69.5453C247.369 71.3766 245.995 75.3305 246.296 76.4975Z" fill="white" />
        <path id="Vector_15" fillRule="evenodd" clipRule="evenodd" d="M272.717 305.347C273.794 304.148 273.909 301.212 273.01 299.526C272.373 298.328 248.278 281.048 245.688 280.486C245.776 289.08 246.024 287.672 256.947 296.042C261.092 299.218 270.33 307.999 272.717 305.347Z" fill="white" />
        <path id="Vector_16" fillRule="evenodd" clipRule="evenodd" d="M110.418 143.482L114.423 149.895C115.793 151.918 116.742 153.518 118.186 155.638C120.838 159.529 123.683 164.042 125.926 167.459C127.732 170.208 139.204 188.037 142.413 189.888C141.066 184.393 128.578 164.915 123.737 159.107C121.746 156.718 117.505 152.686 116.86 149.954C120.346 150.436 123.43 154.046 127.063 154.986C126.516 152.702 125.602 152.769 123.483 151.417C120.388 149.441 112.771 144.024 110.418 143.482Z" fill="white" />
        <path id="Vector_17" fillRule="evenodd" clipRule="evenodd" d="M250.178 249.423C247.205 250.793 246.183 248.168 244.545 251.581L245.92 252.103C246.102 252.14 246.234 252.158 246.421 252.182C246.491 252.19 248.362 252.085 248.607 252.076C248.122 254.25 247.473 254.205 247.008 256.352C254.864 255.436 262.494 226.967 259.643 223.639C259.129 223.226 260.374 222.796 257.693 223.092C256.76 223.196 253.505 225.204 252.976 226.209C254.143 226.708 259.819 223.108 257.857 228.466C257.183 230.309 255.047 233.912 253.828 234.583C251.745 233.461 252.777 232.95 250.551 231.905C250.619 233.318 255.541 246.949 250.178 249.423Z" fill="white" />
        <path id="Vector_18" fillRule="evenodd" clipRule="evenodd" d="M174.545 289.08C174.382 295.267 175.926 302.81 177.357 308.493C178.047 311.233 178.931 314.11 179.879 317.014C181.326 321.45 181.906 321.439 187.096 321.753C186.679 318.755 176.157 290.24 174.545 289.08Z" fill="white" />
        <path id="Vector_19" fillRule="evenodd" clipRule="evenodd" d="M213.979 316.831C215.147 316.271 215.149 316.682 216.551 314.224C219.637 308.819 225.407 295.368 225.281 290.22C222.359 291.837 218.8 297.959 217.274 301.235C215.18 305.733 213.699 310.714 213.979 316.831Z" fill="white" />
        <path id="Vector_20" fillRule="evenodd" clipRule="evenodd" d="M208.781 255.386C211.457 254.607 220.106 247.525 223.657 245.203C228.342 242.14 234.337 239.188 238.912 235.724C238.713 233.881 238.262 232.795 236.91 231.773C233.867 233.237 232.165 235.4 229.365 237.693C226.368 240.146 225.282 241.063 222.407 243.432C220.136 245.303 217.816 247.138 215.444 249.139C213.248 250.992 210.019 252.997 208.781 255.386Z" fill="white" />
        <path id="Vector_21" fillRule="evenodd" clipRule="evenodd" d="M204.125 313.39C206.156 310.983 209.022 303.843 209.379 300.764C206.517 301.056 204.218 302.11 203.389 304.737C202.904 306.273 202.937 310.286 203.418 311.981C203.856 313.516 203.584 312.694 204.125 313.39Z" fill="white" />
        <path id="Vector_22" fillRule="evenodd" clipRule="evenodd" d="M179.518 252.413C182.529 252.849 192.204 255.741 193.874 254.752C190.328 250.804 187.812 254.792 185.328 251.894C182.842 248.993 185.3 246.749 180.097 245.612L179.518 252.413Z" fill="white" />
        <path id="Vector_23" fillRule="evenodd" clipRule="evenodd" d="M168.24 236.252C169.758 237.641 172.545 238.669 175.248 239.171C175.129 234.855 173.727 231.275 169.724 231.197L168.24 236.252Z" fill="white" />
        <path id="Vector_24" fillRule="evenodd" clipRule="evenodd" d="M255.494 250.524C258.103 251.519 266.57 252.34 268.906 250.524C267.448 249.007 261.18 248.006 257.74 248.661C255.311 249.124 255.734 248.671 255.494 250.524Z" fill="white" />
        <path id="Vector_25" fillRule="evenodd" clipRule="evenodd" d="M185.879 259.102C185.951 259.181 186.16 260.214 187.465 261.418C190.505 264.228 194.394 266.915 195.552 260.315L185.879 259.102Z" fill="white" />
        <path id="Vector_26" fillRule="evenodd" clipRule="evenodd" d="M239.684 270.114C239.625 276.08 248.275 277.072 247.391 268.58C245.709 268.531 244.093 268.787 242.786 269.274L242.844 273.286C240.797 272.562 240.876 271.819 239.684 270.114Z" fill="white" />
        <path id="Vector_27" fillRule="evenodd" clipRule="evenodd" d="M177.804 252.243C177.521 246.72 177.027 241.432 172.441 240.066C172.592 242.249 173.781 244.421 174.611 246.663C176.296 251.219 175.825 251.419 177.804 252.243Z" fill="white" />
        <path id="Vector_28" fillRule="evenodd" clipRule="evenodd" d="M187.924 247.161C185.907 245.558 183.412 242.472 180.791 241.927C181.059 245.435 184.16 246.439 186.749 248.328C189.138 250.071 191.542 252.011 194.172 253.157C193.263 251.477 189.577 248.475 187.924 247.161Z" fill="white" />
        <path id="Vector_29" fillRule="evenodd" clipRule="evenodd" d="M167.861 268.364C164.022 268.534 161.394 270.642 163.404 274.309C166.881 275.7 167.97 271.675 167.861 268.364Z" fill="white" />
        <path id="Vector_30" fillRule="evenodd" clipRule="evenodd" d="M243.744 261.124C246.737 260.491 247.413 255.711 244.177 255.476L243.744 261.124Z" fill="white" />
        <path id="Vector_31" fillRule="evenodd" clipRule="evenodd" d="M166.64 267.531C165.947 265.487 164.004 263.494 162.068 266.91C162.836 267.422 162.518 267.558 164.435 267.667C164.951 267.696 166.077 267.56 166.64 267.531Z" fill="white" />
        <path id="Vector_32" fillRule="evenodd" clipRule="evenodd" d="M164.015 258.524C163.008 255.172 164.543 257.255 162.354 256.823C161.386 259.043 162.402 260.456 164.335 260.962C164.299 260.088 164.231 259.242 164.015 258.524Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1141_1601">
          <rect width="400" height="400" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}