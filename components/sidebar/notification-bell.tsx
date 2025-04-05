"use client"

import React from "react"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = React.useState(3)

  const markAllAsRead = () => {
    setUnreadCount(0)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel className="font-normal">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto text-xs px-2 py-1" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="font-medium text-sm">New school registered</span>
              <span className="ml-auto text-xs text-muted-foreground">2h ago</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Juba Primary School has been registered in the system.</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="font-medium text-sm">Grant disbursement completed</span>
              <span className="ml-auto text-xs text-muted-foreground">5h ago</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cash transfer to 25 schools has been completed successfully.
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="font-medium text-sm">System maintenance</span>
              <span className="ml-auto text-xs text-muted-foreground">Yesterday</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              The system will undergo maintenance on Sunday, 10 PM to 2 AM.
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
            <div className="flex items-center gap-2 w-full">
              <span className="font-medium text-sm">Report generated</span>
              <span className="ml-auto text-xs text-muted-foreground">2 days ago</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Q2 Enrollment Report is now available for download.</p>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-sm text-primary justify-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

