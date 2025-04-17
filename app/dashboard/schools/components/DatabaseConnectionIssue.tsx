"use client"

import { useState } from "react"
import { AlertCircle, RefreshCw, ExternalLink, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DatabaseConnectionIssueProps {
  onRetry?: () => Promise<void>
  errorDetails?: string
  supportEmail?: string
  statusPageUrl?: string
}

export default function DatabaseConnectionIssue({
  onRetry = async () => window.location.reload(),
  errorDetails = "Connection timeout",
  supportEmail = "support@example.com",
  statusPageUrl = "https://status.example.com",
}: DatabaseConnectionIssueProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
    } catch (error) {
      console.error("Retry failed:", error)
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-[400px]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-2">
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>We're having trouble connecting to our database.</AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <div className="text-sm font-medium">Error Details</div>
            <div className="mt-1 text-sm text-muted-foreground">{errorDetails}</div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">This could be due to:</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Temporary network issues</li>
              <li>Server maintenance</li>
              <li>Configuration problems</li>
            </ul>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-col gap-4 pt-4">
          <Button onClick={handleRetry} className="w-full" disabled={isRetrying}>
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Connection
              </>
            )}
          </Button>

          <div className="flex justify-between w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${supportEmail}`} target="_blank" rel="noopener noreferrer">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Contact Support</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Email our support team</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" asChild>
                    <a href={statusPageUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>System Status</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Check our system status page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
