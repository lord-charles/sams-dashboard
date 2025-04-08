"\"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AlertCircle, RefreshCw, ExternalLink, Mail, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * FetchErrorDisplay - A production-grade component for displaying data fetching errors
 *
 * Usage:
 * <FetchErrorDisplay /> - Uses default error message
 * <FetchErrorDisplay error="Custom error message" /> - Uses custom error message
 * <FetchErrorDisplay retry={() => refetch()} /> - Custom retry function
 */
export function FetchErrorDisplay({
  // Core error properties
  error = "Failed to fetch data. Please check your connection and try again.",
  errorId,
  errorCode,
  category,
  severity,
  troubleshootingUrl,

  // Retry behavior
  retry,
  maxRetries = 3,
  autoRetry = true,
  autoRetryDelay = 5,

  // Support options (optional)
  supportEmail,
  onErrorLog,
}: {
  error?: string
  errorId?: string
  errorCode?: string
  category?: string
  severity?: string
  troubleshootingUrl?: string
  retry?: () => void
  maxRetries?: number
  autoRetry?: boolean
  autoRetryDelay?: number
  supportEmail?: string
  onErrorLog?: (data: any) => void
}) {
  // Generate a stable error ID and storage key
  const errorIdRef = useRef(errorId || `fetch-error-${Math.random().toString(36).substring(2, 10)}`).current
  const errorStorageKey = useRef(`error-retry-${errorIdRef}-${category}`).current

  // State management
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(autoRetryDelay)
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(autoRetry)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize retry count from localStorage
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem(errorStorageKey)
      if (storedCount) {
        setRetryCount(Number.parseInt(storedCount, 10))
      }
    } catch (e) {
      // Ignore localStorage errors
    }

    // Clean up on unmount if successful
    return () => {
      if (!isRetrying) {
        try {
          localStorage.removeItem(errorStorageKey)
        } catch (e) {
          // Ignore localStorage errors
        }
      }
    }
  }, [errorStorageKey, isRetrying, category])

  // Update localStorage when retry count changes
  useEffect(() => {
    try {
      localStorage.setItem(errorStorageKey, retryCount.toString())
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [retryCount, errorStorageKey])

  // Handle manual retry
  const handleRetry = useCallback(() => {
    setIsRetrying(true)
    setRetryCount((prev) => prev + 1)

    if (retry) {
      retry()
    } else {
      // Default fallback is to reload the page
      window.location.reload()
    }

    // Reset state after a short delay
    setTimeout(() => setIsRetrying(false), 2000)
  }, [retry])

  // Cancel auto-retry
  const cancelAutoRetry = useCallback(() => {
    setAutoRetryEnabled(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  // Reset retry count
  const resetRetryCount = useCallback(() => {
    try {
      localStorage.removeItem(errorStorageKey)
      setRetryCount(0)
      setAutoRetryEnabled(true)
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [errorStorageKey])

  // Contact support
  const contactSupport = useCallback(() => {
    if (supportEmail) {
      window.location.href = `mailto:${supportEmail}?subject=Data%20Fetch%20Error&body=Error%20details:%20${encodeURIComponent(error)}%0A%0AError%20ID:%20${errorIdRef}%0AError%20Code:%20${errorCode}%0ACategory:%20${category}%0ATimestamp:%20${new Date().toISOString()}`
    }
  }, [supportEmail, error, errorIdRef, errorCode, category])

  // Auto-retry timer
  useEffect(() => {
    // Don't auto-retry if disabled or we've reached max retries
    if (!autoRetryEnabled || retryCount >= maxRetries) return

    // Initialize timer
    setTimeLeft(autoRetryDelay)

    // Set up interval
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Clear interval when time is up
          if (timerRef.current) clearInterval(timerRef.current)

          // Increment retry count
          setRetryCount((prev) => prev + 1)

          // Trigger retry
          if (retry) {
            retry()
          } else {
            // Default fallback is to reload the page
            window.location.reload()
          }

          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    // Cleanup
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoRetryDelay, autoRetryEnabled, retryCount, maxRetries, retry])

  // Log error for analytics
  useEffect(() => {
    if (onErrorLog) {
      onErrorLog({
        error,
        errorCode,
        category,
        retryCount,
        timestamp: new Date().toISOString(),
      })
    }

    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error captured:", {
        error,
        errorCode,
        category,
        retryCount,
      })
    }
  }, [error, errorCode, category, retryCount, onErrorLog])

  // Determine if we've reached max retries
  const hasReachedMaxRetries = retryCount >= maxRetries

  return (
    <motion.div
      className="relative overflow-hidden bg-background border border-muted rounded-lg shadow-md w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Status indicator bar at top */}
      <div className={`h-1 ${hasReachedMaxRetries ? "bg-red-600" : "bg-destructive/10"}`}></div>

      <div className="p-6">
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Error Icon */}
          <motion.div
            className="rounded-full bg-destructive/10 p-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <AlertCircle size={32} className="text-destructive" aria-hidden="true" />
          </motion.div>

          {/* Error Content */}
          <div className="space-y-2 w-full">
            <h2 className="text-xl font-semibold tracking-tight">
              {hasReachedMaxRetries ? "Unable to load data" : "Failed to fetch data"}
            </h2>

            <p className="text-muted-foreground text-sm">
              {hasReachedMaxRetries
                ? "We've tried several times but couldn't retrieve the data. Please try again later."
                : "We're having trouble loading your data. The page will automatically retry."}
            </p>

            <div className="mt-3 p-3 bg-muted rounded-md text-sm font-medium break-words text-left" role="alert">
              <span className="text-foreground">{error}</span>
            </div>
          </div>

          {/* Retry Counter */}
          {!hasReachedMaxRetries && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Attempt</span>
              <div className="flex gap-1">
                {[...Array(maxRetries)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i < retryCount ? "bg-destructive/10" : "bg-muted"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span>
                {retryCount} of {maxRetries}
              </span>
            </div>
          )}

          {/* Auto-retry Timer */}
          <AnimatePresence>
            {autoRetryEnabled && !hasReachedMaxRetries && (
              <motion.div
                className="w-full space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Retrying in <span className="font-medium">{timeLeft}</span> seconds
                  </span>
                  <button
                    onClick={cancelAutoRetry}
                    className="h-7 px-2 text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 rounded-md hover:bg-muted transition-colors"
                  >
                    <XCircle size={14} />
                    Cancel
                  </button>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(timeLeft / autoRetryDelay) * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="w-full space-y-4">
            {hasReachedMaxRetries ? (
              <>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={resetRetryCount}
                    className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <RefreshCw size={16} />
                    Try Again
                  </button>

                  {supportEmail && (
                    <button
                      onClick={contactSupport}
                      className="w-full border border-input bg-background rounded-md py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                    >
                      <Mail size={16} />
                      Contact Support
                    </button>
                  )}
                </div>

                {troubleshootingUrl && (
                  <button
                    onClick={() => window.open(troubleshootingUrl, "_blank")}
                    className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} />
                    Troubleshooting
                  </button>
                )}
              </>
            ) : (
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
                  {isRetrying ? "Retrying..." : "Retry Now"}
                </button>

                {!autoRetryEnabled && (
                  <button
                    onClick={() => setAutoRetryEnabled(true)}
                    className="w-full border border-input bg-background rounded-md py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                  >
                    Resume Auto-retry
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error ID and timestamp */}
          <div className="w-full pt-2">
            <div className="border-t border-border pt-2"></div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Error ID: {errorIdRef.substring(0, 8)}</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function updateErrorTimestamp(errorId: string): void {
  try {
    const timestamps = JSON.parse(localStorage.getItem("fetch-error-timestamps") || "{}")
    timestamps[errorId] = Date.now()
    localStorage.setItem("fetch-error-timestamps", JSON.stringify(timestamps))
  } catch (e) {
    // Ignore localStorage errors
  }
}
