"use client";
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "../../auth-client"
import { docsConfig } from "@/config/docs"
import { marketingConfig } from "@/config/marketing"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { DocsSidebarNav } from "@/components/docs/sidebar-nav"
import { Icons } from "@/components/shared/icons"
import { NavItem } from "../../types/index"
import { ModeToggle } from "./mode-toggle"

 
type ConfigMap = {
  docs: NavItem[]
  // Add other layout segments here if needed
}
export function NavMobile() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const selectedLayout = useSelectedLayoutSegment()
  const isDocsLayout = selectedLayout === "docs"

  const configMap: ConfigMap = {
    docs: docsConfig.mainNav,
  }

  const getNavLinks = (): NavItem[] => {
    if (!selectedLayout) return marketingConfig.mainNav
    if (selectedLayout in configMap) {
      return configMap[selectedLayout as keyof ConfigMap]
    }
    return marketingConfig.mainNav
  }

  const links = getNavLinks()

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

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

  const renderAuthLinks = () => {
    if (session) {
      return (
        <>
          {session.user.role === "ADMIN" && (
            <motion.li className="py-3" variants={itemVariants}>
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full font-medium capitalize"
                >
                  Admin
                </Link>
              </motion.div>
            </motion.li>
          )}
          <motion.li className="py-3" variants={itemVariants}>
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex w-full font-medium capitalize"
              >
                Dashboard
              </Link>
            </motion.div>
          </motion.li>
        </>
      )
    }
    return (
      <>
        <motion.li className="py-3" variants={itemVariants}>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
            <Link href="/login" onClick={() => setIsOpen(false)} className="flex w-full font-medium capitalize">
              Login
            </Link>
          </motion.div>
        </motion.li>
        <motion.li className="py-3" variants={itemVariants}>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="flex w-full font-medium capitalize"
            >
              Sign up
            </Link>
          </motion.div>
        </motion.li>
      </>
    )
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-2 top-2.5 z-50 rounded-full p-2 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted md:hidden",
          isOpen && "hover:bg-muted active:bg-muted",
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
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
        {isOpen && (
          <motion.nav
            className="fixed inset-0 z-20 w-full overflow-auto bg-background px-5 py-16 lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <motion.ul className="grid divide-y divide-muted" variants={itemVariants}>
             {links.map(({ title, href }, index) => (
  href && ( // Only render if href exists
    (<motion.li key={href} className="py-3" variants={itemVariants} custom={index}>
      <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
        <Link
          href={href}
          onClick={() => setIsOpen(false)}
          className="flex w-full font-medium capitalize"
          legacyBehavior>
          {title}
        </Link>
      </motion.div>
    </motion.li>)
  )
))}
              {renderAuthLinks()}
            </motion.ul>

            {isDocsLayout && (
              <motion.div className="mt-8 block md:hidden" variants={itemVariants}>
                <DocsSidebarNav setOpen={setIsOpen} />
              </motion.div>
            )}

            <motion.div className="mt-5 flex items-center justify-end space-x-4" variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  legacyBehavior>
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
  );
}
