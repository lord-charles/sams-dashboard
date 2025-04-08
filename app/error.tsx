"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AlertCircle, RefreshCw, XCircle, AlertTriangle, ExternalLink, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Error severity levels
type ErrorSeverity = "warning" | "error" | "critical"

interface ErrorDisplayProps {
  error: string | Error
  errorCode?: string
  severity?: ErrorSeverity
  title?: string
  description?: string
  autoReloadTime?: number // in seconds
  retry?: () => void
  maxRetries?: number
  supportEmail?: string
  supportUrl?: string
  onErrorLog?: (data: {
    error: string | Error
    retryCount: number
    timestamp: string
    errorCode?: string
  }) => void
}

const ERROR_RETRY_KEY = "error-retry-count"

export default function ErrorDisplay({
  error="500",
  errorCode="500",
  severity = "error",
  title = "Something went wrong",
  description = "We're having trouble loading this content. The page will automatically reload to try again.",
  autoReloadTime = 5, // default 5 seconds
  retry,
  maxRetries = 3,
  supportEmail = "support@example.com",
  supportUrl="https://example.com",
  onErrorLog,
}: ErrorDisplayProps) {
  // State management
  const [isRetrying, setIsRetrying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(autoReloadTime)
  const [autoReloadEnabled, setAutoReloadEnabled] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const errorMessage = error instanceof Error ? error.message : error

  // Initialize retry count from localStorage
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem(ERROR_RETRY_KEY)
      if (storedCount) {
        setRetryCount(Number.parseInt(storedCount, 10))
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [])

  // Log error for analytics
  useEffect(() => {
    if (onErrorLog) {
      onErrorLog({
        error,
        retryCount,
        timestamp: new Date().toISOString(),
        errorCode,
      })
    }

    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error captured:", {
        error,
        retryCount,
        errorCode,
      })
    }
  }, [error, retryCount, errorCode, onErrorLog])

  // Update localStorage when retry count changes
  useEffect(() => {
    try {
      localStorage.setItem(ERROR_RETRY_KEY, retryCount.toString())
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [retryCount])

  // Handle manual retry
  const handleRetry = useCallback(() => {
    setIsRetrying(true)

    // Increment retry count
    setRetryCount((prev) => prev + 1)

    if (retry) {
      retry()
    } else {
      // Default fallback is to reload the page
      window.location.reload()
    }

    // Reset state after a short delay (in case retry doesn't trigger a navigation)
    setTimeout(() => setIsRetrying(false), 2000)
  }, [retry])

  // Cancel auto-reload
  const cancelAutoReload = useCallback(() => {
    setAutoReloadEnabled(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  // Reset retry count
  const resetRetryCount = useCallback(() => {
    try {
      localStorage.removeItem(ERROR_RETRY_KEY)
      setRetryCount(0)
      setAutoReloadEnabled(true)
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [])

  // Contact support
  const contactSupport = useCallback(() => {
    if (supportEmail) {
      window.location.href = `mailto:${supportEmail}?subject=Error%20Report%20${errorCode ? `(${errorCode})` : ""}&body=Error%20details:%20${encodeURIComponent(errorMessage)}`
    }
  }, [supportEmail, errorCode, errorMessage])

  // Auto-reload timer
  useEffect(() => {
    // Don't auto-reload if we've reached max retries
    if (!autoReloadEnabled || retryCount >= maxRetries) return

    // Initialize timer
    setTimeLeft(autoReloadTime)

    // Set up interval
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Clear interval when time is up
          if (timerRef.current) clearInterval(timerRef.current)

          // Increment retry count
          setRetryCount((prev) => prev + 1)

          // Reload the page
          window.location.reload()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    // Cleanup
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoReloadTime, autoReloadEnabled, retryCount, maxRetries])

  // Get icon based on severity
  const SeverityIcon = severity === "warning" ? AlertTriangle : AlertCircle
  const severityColor =
    severity === "warning" ? "text-yellow-500" : severity === "critical" ? "text-red-600" : "text-destructive"

  const severityBgColor =
    severity === "warning" ? "bg-yellow-500/10" : severity === "critical" ? "bg-red-600/10" : "bg-destructive/10"

  // Determine if we've reached max retries
  const hasReachedMaxRetries = retryCount >= maxRetries

  return (
    <Card className="max-w-md w-full mx-auto shadow-lg border-muted/30 overflow-hidden">
      {/* Status indicator bar at top */}
      <div className={`h-1 ${hasReachedMaxRetries ? "bg-red-600" : severityBgColor}`}></div>

      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Error Icon */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className={`rounded-full ${severityBgColor} p-3`}>
                <SeverityIcon size={32} className={severityColor} aria-hidden="true" />
              </div>
            </motion.div>
          </div>

          {/* Error Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">
                {hasReachedMaxRetries ? "Still experiencing issues" : title}
              </h2>
              {errorCode && (
                <Badge variant="outline" className="text-xs font-mono">
                  {errorCode}
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground text-sm">
              {hasReachedMaxRetries
                ? "We've tried several times but couldn't resolve the issue. Please try again later or contact support."
                : description}
            </p>

            <div className="mt-2 p-3 bg-muted rounded-md text-sm font-medium break-words" role="alert">
              <span className="text-muted-foreground font-normal">Error: </span>
              <span className={severity === "critical" ? "text-red-600" : "text-foreground"}>{errorMessage}</span>
            </div>
          </div>

          {/* Retry Counter */}
          {!hasReachedMaxRetries && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Attempt</span>
              <div className="flex gap-1">
                {[...Array(maxRetries)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < retryCount ? severityBgColor : "bg-muted"}`} />
                ))}
              </div>
              <span>
                {retryCount} of {maxRetries}
              </span>
            </div>
          )}

          {/* Auto-reload Timer */}
          <AnimatePresence>
            {autoReloadEnabled && !hasReachedMaxRetries && (
              <motion.div
                className="w-full space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Reloading in <span className="font-medium">{timeLeft}</span> seconds
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelAutoReload}
                    className="h-7 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <XCircle size={14} className="mr-1" />
                    Cancel
                  </Button>
                </div>
                <Progress value={(timeLeft / autoReloadTime) * 100} className="h-1.5" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="w-full space-y-4">
            {hasReachedMaxRetries ? (
              <>
                <div className="flex gap-3 w-full">
                  <Button variant="default" className="w-full" onClick={resetRetryCount}>
                    <RefreshCw size={16} className="mr-2" />
                    Try Again
                  </Button>

                  <Button variant="outline" className="w-full" onClick={contactSupport}>
                    <Mail size={16} className="mr-2" />
                    Contact Support
                  </Button>
                </div>

                {supportUrl && (
                  <Button variant="ghost" className="w-full text-sm" onClick={() => window.open(supportUrl, "_blank")}>
                    <ExternalLink size={14} className="mr-2" />
                    View Troubleshooting Guide
                  </Button>
                )}
              </>
            ) : (
              <div className="flex gap-3 w-full">
                <Button variant="default" className="w-full" onClick={handleRetry} disabled={isRetrying}>
                  <RefreshCw size={16} className={`mr-2 ${isRetrying ? "animate-spin" : ""}`} />
                  {isRetrying ? "Reloading..." : "Reload Now"}
                </Button>

                {!autoReloadEnabled && (
                  <Button variant="outline" className="w-full" onClick={() => setAutoReloadEnabled(true)}>
                    Resume Auto-reload
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Timestamp and session info - enterprise touch */}
          <div className="w-full pt-2">
            <Separator className="mb-2" />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Session ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Card>
  )
}
