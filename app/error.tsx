"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-50 dark:bg-red-900/20">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-heading">
        Something went wrong
      </h1>

      <p className="mb-6 text-base text-gray-600 dark:text-gray-400 max-w-md">
        We apologize for the inconvenience. The system encountered an error while processing your request.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 text-sm font-medium text-white bg-ss-blue hover:bg-ss-blue/90 rounded-md transition-colors"
        >
          Try again
        </button>

        <a
          href="/"
          className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          Return to home
        </a>
      </div>

      <div className="mt-8 text-xs text-gray-500 dark:text-gray-500">Error reference: {error?.message || "Unknown"}</div>
    </div>
  )
}

