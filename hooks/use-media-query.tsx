"use client"

import * as React from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Create event listener for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add event listener
    mediaQuery.addEventListener("change", handler)

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [query])

  return matches
}

