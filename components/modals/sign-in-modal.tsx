"use client"

import { signIn } from "next-auth/react"
import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Github, LucideLoader, Code, Server, Cloud } from "lucide-react"
import Logo from "../../components/logo.tsx"

const Icons = {
  google: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
      <path
        fill="currentColor"
        d="M12 11v2h2.2c-.2.5-.8 1.6-2.2 1.6-1.3 0-2.4-1.1-2.4-2.4s1.1-2.4 2.4-2.4c.8 0 1.2.3 1.5.6l1.7-1.6c-1-1-2.3-1.5-3.2-1.5-2.6 0-4.8 2.1-4.8 4.9s2.2 4.9 4.8 4.9c2.8 0 4.6-2 4.6-4.7 0-.4 0-.7-.1-1h-4.5z"
      />
    </svg>
  ),
  gitHub: (props: any) => <Github {...props} />,
  spinner: (props: any) => <LucideLoader className="animate-spin" {...props} />,
}

export function AuthModal({
  showModal,
  setShowModal,
  isSignUp = false,
  setIsSignUp,
}: {
  showModal: boolean
  setShowModal: (show: boolean) => void
  isSignUp?: boolean
  setIsSignUp: (isSignUp: boolean) => void
}) {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null)

  const handleGoogleAuth = async () => {
    console.log('Initiating Google auth flow...')
    console.log(`Current mode: ${isSignUp ? 'Sign Up' : 'Sign In'}`)
    
    setLoadingProvider("google")
    try {
      const callbackUrl = isSignUp ? "/onboarding/google" : "/dashboard"
      console.log(`Using callback URL: ${callbackUrl}`)
      
      const response = await signIn("google", { 
        redirect: false, 
        callbackUrl 
      })
      
      console.log('Google auth response:', response)
      
      if (response?.error) {
        console.error('Google auth error:', response.error)
        throw new Error(response.error)
      }
      
      console.log('Google auth successful, closing modal')
      setShowModal(false)
    } catch (error) {
      console.error('Google authentication failed:', error)
      // Here you could set an error state to show to the user
    } finally {
      console.log('Google auth flow completed')
      setLoadingProvider(null)
    }
  }

  const handleGitHubAuth = async () => {
    console.log('Initiating GitHub auth flow...')
    console.log(`Current mode: ${isSignUp ? 'Sign Up' : 'Sign In'}`)
    
    setLoadingProvider("github")
    try {
      const callbackUrl = isSignUp ? "/onboarding/github" : "/dashboard"
      console.log(`Using callback URL: ${callbackUrl}`)
      
      const response = await signIn("github", { 
        redirect: false, 
        callbackUrl 
      })
      
      console.log('GitHub auth response:', response)
      
      if (response?.error) {
        console.error('GitHub auth error:', response.error)
        throw new Error(response.error)
      }
      
      console.log('GitHub auth successful, closing modal')
      setShowModal(false)
    } catch (error) {
      console.error('GitHub authentication failed:', error)
      // Here you could set an error state to show to the user
    } finally {
      console.log('GitHub auth flow completed')
      setLoadingProvider(null)
    }
  }

  const toggleAuthMode = () => {
    console.log(`Toggling auth mode from ${isSignUp ? 'Sign Up' : 'Sign In'} to ${!isSignUp ? 'Sign Up' : 'Sign In'}`)
    setIsSignUp(!isSignUp)
  }

  // Animation variants
  const headerVariants = {
    signin: { x: 0, opacity: 1 },
    signout: { x: -50, opacity: 0 },
    signup: { x: 0, opacity: 1 },
    signupout: { x: 50, opacity: 0 },
  }

  const buttonTextVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  }

  const footerVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: -20 },
  }

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-xl dark:bg-slate-900"
      >
        <Logo />

        <div className="mb-8 relative h-20">
          <AnimatePresence mode="wait">
            {!isSignUp ? (
              <motion.div
                key="signin"
                initial="signupout"
                animate="signin"
                exit="signout"
                variants={headerVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-full"
              >
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome back</h3>
                <p className="text-slate-500 dark:text-slate-400">Sign in to continue managing your deployments</p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial="signout"
                animate="signup"
                exit="signupout"
                variants={headerVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-full"
              >
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Join NextDeploy</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Create an account to start deploying your applications
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleAuth}
            disabled={!!loadingProvider}
            className="w-full bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 h-11"
          >
            {loadingProvider === "google" ? (
              <Icons.spinner className="mr-2 h-4 w-4" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            <div className="flex-1 text-center relative h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                {isSignUp ? (
                  <motion.span
                    key="google-signup"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={buttonTextVariants}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="absolute w-full left-0"
                  >
                    Sign up with Google
                  </motion.span>
                ) : (
                  <motion.span
                    key="google-signin"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={buttonTextVariants}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="absolute w-full left-0"
                  >
                    Sign in with Google
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={handleGitHubAuth}
            disabled={!!loadingProvider}
            className="w-full h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {loadingProvider === "github" ? (
              <Icons.spinner className="mr-2 h-4 w-4" />
            ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
            )}
            <div className="flex-1 text-center relative h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                {isSignUp ? (
                  <motion.span
                    key="github-signup"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={buttonTextVariants}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="absolute w-full left-0"
                  >
                    Sign up with GitHub
                  </motion.span>
                ) : (
                  <motion.span
                    key="github-signin"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={buttonTextVariants}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="absolute w-full left-0"
                  >
                    Sign in with GitHub
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">DevOps Tools</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex flex-col items-center"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 mb-2">
                <Code className="size-5 text-emerald-500" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">CI/CD</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex flex-col items-center"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 mb-2">
                <Server className="size-5 text-emerald-500" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Servers</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex flex-col items-center"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 mb-2">
                <Cloud className="size-5 text-emerald-500" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Cloud</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-6 text-center relative h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.div
                key="footer-signup"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={footerVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-full"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Already have an account?{" "}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAuthMode}
                    className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 hover:underline"
                  >
                    Sign in
                  </motion.button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="footer-signin"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={footerVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-full"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{" "}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAuthMode}
                    className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 hover:underline"
                  >
                    Sign up
                  </motion.button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Modal>
  )
}

export function useAuthModal() {
  const [showModal, setShowModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const AuthModalComponent = useCallback(() => {
    return <AuthModal showModal={showModal} setShowModal={setShowModal} isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
  }, [showModal, isSignUp])

  return useMemo(
    () => ({
      showModal,
      setShowModal,
      isSignUp,
      setIsSignUp,
      AuthModal: AuthModalComponent,
    }),
    [showModal, isSignUp, AuthModalComponent],
  )
}
