"use client"

import { useEffect, useState, useCallback } from "react"
import { BookOpen, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Loading() {
  // State management for loading progress and status
  const [progress, setProgress] = useState(0)
  const [loadingState, setLoadingState] = useState<"loading" | "slow" | "error">("loading")
  const [isVisible, setIsVisible] = useState(true)

  // Simulate analytics tracking for production environments
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.info("EMIS-Analytics: Loading screen displayed")
    }

    // Log version information
    console.info("EMIS Loader v1.2.0")

    return () => {
      if (process.env.NODE_ENV === "production") {
        console.info("EMIS-Analytics: Loading screen hidden")
      }
    }
  }, [])

  // Simulate realistic loading progress
  const simulateProgress = useCallback(() => {
    // Initial fast progress up to 70%
    const fastPhase = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 70) {
          clearInterval(fastPhase)
          return prev
        }
        return prev + Math.random() * 3 + 1
      })
    }, 200)

    // Slower progress from 70% to 90%
    setTimeout(() => {
      clearInterval(fastPhase)
      const slowPhase = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(slowPhase)
            return prev
          }
          return prev + Math.random() * 0.8
        })
      }, 300)

      // Final phase - very slow progress
      setTimeout(() => {
        clearInterval(slowPhase)
        const finalPhase = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 99) {
              clearInterval(finalPhase)
              return 99
            }
            return prev + Math.random() * 0.3
          })
        }, 500)
      }, 3000)
    }, 2000)

    // Handle slow loading detection
    const slowTimeout = setTimeout(() => {
      setLoadingState("slow")
    }, 8000)

    // Handle potential error state after extended loading
    const errorTimeout = setTimeout(() => {
      // 10% chance of showing error state in development for testing
      if (process.env.NODE_ENV === "development" && Math.random() < 0.1) {
        setLoadingState("error")
        setProgress(95) // Stuck progress
      }
    }, 15000)

    return () => {
      clearInterval(fastPhase)
      clearTimeout(slowTimeout)
      clearTimeout(errorTimeout)
    }
  }, [])

  // Initialize loading simulation
  useEffect(() => {
    simulateProgress()
  }, [simulateProgress])

  // Handle visibility for screen readers
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Handle retry functionality
  const handleRetry = useCallback(() => {
    setLoadingState("loading")
    setProgress(30) // Reset to partial progress
    simulateProgress()
  }, [simulateProgress])

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      role="alert"
      aria-live="polite"
      aria-busy={loadingState === "loading"}
    >
      {/* Top banner with EMIS branding */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ss-black via-ss-blue to-ss-green" />

      {/* Official branding */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <BookOpen className="w-6 h-6 mr-2 text-ss-blue" />
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white font-heading">EMIS</h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Ministry of General Education and Instruction
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500">Republic of South Sudan</p>
      </div>

      {/* Main loader container */}
      <div className="relative flex flex-col items-center max-w-md w-full px-4">
        {/* Logo and spinner */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-100 dark:border-gray-700">
            {/* EMIS logo */}
            <svg
              className="w-12 h-12 text-ss-blue dark:text-ss-blue/90"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Animated spinner */}
          <div className="absolute -inset-1">
            <div className="w-full h-full rounded-full border-2 border-transparent border-t-ss-blue border-r-ss-green animate-spin-slow will-change-transform opacity-70" />
          </div>
        </div>

        {/* Status message */}
        <div className="text-center mb-6 space-y-1">
          {loadingState === "error" ? (
            <>
              <div className="flex items-center justify-center text-amber-500 mb-2">
                <AlertCircle className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold font-heading">Connection Issue</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We're having trouble connecting to the EMIS server.
              </p>
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-ss-blue hover:bg-ss-blue/90 text-white rounded-md text-sm transition-colors"
              >
                Retry Connection
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-heading">
                {loadingState === "slow" ? "Still Working..." : "Loading EMIS"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {loadingState === "slow"
                  ? "This is taking longer than expected. Please wait..."
                  : "Preparing your Education Management Information System"}
              </p>
            </>
          )}
        </div>

        {/* Progress tracking */}
        <div className="w-full max-w-xs">
          <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
            <div
              className={cn(
                "h-full transition-all ease-out duration-300",
                loadingState === "error"
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-ss-blue via-ss-green to-ss-blue bg-size-200",
              )}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Progress details */}
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>{Math.round(progress)}% Complete</span>
            <span className="text-right">
              {loadingState === "loading" && progress > 70 ? "Finalizing..." : "Loading data..."}
            </span>
          </div>
        </div>

        {/* System status indicators */}
        <div className="mt-8 w-full max-w-xs">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div className="w-2 h-2 rounded-full bg-green-500 mb-1" />
              <span className="text-gray-600 dark:text-gray-400">Database</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div className="w-2 h-2 rounded-full bg-green-500 mb-1" />
              <span className="text-gray-600 dark:text-gray-400">API</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div
                className={cn("w-2 h-2 rounded-full mb-1", loadingState === "error" ? "bg-amber-500" : "bg-green-500")}
              />
              <span className="text-gray-600 dark:text-gray-400">Server</span>
            </div>
          </div>
        </div>

        {/* Skeleton UI for content preview */}
        <div className="mt-12 w-full max-w-md opacity-20">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse-subtle" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse-subtle" />
              <div className="h-2.5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse-subtle" />
            </div>
          </div>

          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-1/3 mb-4 animate-pulse-subtle" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse-subtle"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>

          <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-md mb-4 animate-pulse-subtle" />

          <div className="flex justify-between items-center mb-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse-subtle" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse-subtle" />
          </div>

          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse-subtle" />
        </div>

        {/* Footer with version info */}
        <div className="absolute bottom-4 text-[10px] text-gray-400 dark:text-gray-600">
          EMIS v2.5.0 • {new Date().getFullYear()} © Ministry of Education
        </div>
      </div>

      {/* Screen reader text */}
      <div className="sr-only" aria-live="polite">
        {loadingState === "error"
          ? "Error loading the Education Management Information System. Please retry connection."
          : `Loading Education Management Information System. Current progress: ${Math.round(progress)} percent.`}
      </div>
    </div>
  )
}

