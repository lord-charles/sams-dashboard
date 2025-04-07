"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface ErrorDisplayProps {
  error: string
  retry?: () => void
}

export function FetchErrorDisplay({ error, retry }: ErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = () => {
    setIsRetrying(true)

    if (retry) {
      retry()
    } else {
      // Default fallback is to reload the page
      window.location.reload()
    }

    // Reset state after a short delay (in case retry doesn't trigger a navigation)
    setTimeout(() => setIsRetrying(false), 2000)
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-[400px] bg-background/95 text-center p-6 rounded-lg border border-muted"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6 max-w-md">
        <motion.div
          className="mx-auto text-destructive"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AlertCircle size={48} aria-hidden="true" className="text-destructive"/>
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">Something went wrong</h2>
          <p className="text-destructive font-medium text-sm" role="alert">
            {error}
          </p>
          <p className="text-muted-foreground text-sm">Please try again or contact support if the problem persists.</p>
        </div>

        <motion.button
          onClick={handleRetry}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2 font-medium"
          whileTap={{ scale: 0.97 }}
          disabled={isRetrying}
          aria-label="Retry operation"
        >
          <RefreshCw size={16} className={`${isRetrying ? "animate-spin" : ""}`} />
          {isRetrying ? "Retrying..." : "Retry"}
        </motion.button>
      </div>
    </motion.div>
  )
}

