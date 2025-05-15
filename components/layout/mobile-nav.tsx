"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"

import { docsConfig } from "@/config/docs"
import { marketingConfig } from "@/config/marketing"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { DocsSidebarNav } from "@/components/docs/sidebar-nav"
import { Icons } from "@/components/shared/icons"

import { ModeToggle } from "./mode-toggle"

export function NavMobile() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const selectedLayout = useSelectedLayoutSegment()
  const documentation = selectedLayout === "docs"

  const configMap = {
    docs: docsConfig.mainNav,
  }

  const links = (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav

  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [open])

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  }

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-2 top-2.5 z-50 rounded-full p-2 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted md:hidden",
          open && "hover:bg-muted active:bg-muted",
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial="closed"
        animate={open ? "open" : "closed"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <X className="size-5 text-muted-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Menu className="size-5 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 z-20 w-full overflow-auto bg-background px-5 py-16 lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <motion.ul className="grid divide-y divide-muted" variants={itemVariants}>
              {links &&
                links.length > 0 &&
                links.map(({ title, href }, index) => (
                  <motion.li key={href} className="py-3" variants={itemVariants} custom={index}>
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                      <Link href={href} onClick={() => setOpen(false)} className="flex w-full font-medium capitalize">
                        {title}
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}

              {session ? (
                <>
                  {session.user.role === "ADMIN" ? (
                    <motion.li className="py-3" variants={itemVariants}>
                      <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/admin"
                          onClick={() => setOpen(false)}
                          className="flex w-full font-medium capitalize"
                        >
                          Admin
                        </Link>
                      </motion.div>
                    </motion.li>
                  ) : null}

                  <motion.li className="py-3" variants={itemVariants}>
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex w-full font-medium capitalize"
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                  </motion.li>
                </>
              ) : (
                <>
                  <motion.li className="py-3" variants={itemVariants}>
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/login" onClick={() => setOpen(false)} className="flex w-full font-medium capitalize">
                        Login
                      </Link>
                    </motion.div>
                  </motion.li>

                  <motion.li className="py-3" variants={itemVariants}>
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/register"
                        onClick={() => setOpen(false)}
                        className="flex w-full font-medium capitalize"
                      >
                        Sign up
                      </Link>
                    </motion.div>
                  </motion.li>
                </>
              )}
            </motion.ul>

            {documentation ? (
              <motion.div className="mt-8 block md:hidden" variants={itemVariants}>
                <DocsSidebarNav setOpen={setOpen} />
              </motion.div>
            ) : null}

            <motion.div className="mt-5 flex items-center justify-end space-x-4" variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                  <Icons.gitHub className="size-6" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </motion.div>
              <ModeToggle />
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
