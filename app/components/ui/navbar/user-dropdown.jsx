"use client"

import * as React from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { LogIn, LogOut, Settings, User, CreditCard, HelpCircle, User2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export const UserDropdown = () => {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = React.useState(false)
  const isLoggedIn = status === "authenticated"
  const isLoading = status === "loading"
  const user = session?.user

  const firstName = user?.firstname || ""
  const lastName = user?.lastname || ""
  const initials = firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : "U"
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : "User"
  const userType = user?.userType || "User"

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut({ callbackUrl: "/dashboard/auth" })
  }

  const handleSignIn = () => {
    setIsOpen(false)
    signIn()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative rounded-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground ${isLoggedIn ? "h-10 w-10" : " "
            }`}
          aria-label={isLoggedIn ? `${displayName} menu` : "User menu"}
        >
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : isLoggedIn ? (
            <Avatar className="h-10 w-10 transition-transform duration-300 hover:scale-105">
              <AvatarImage src={user?.image || ""} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
          ) : (
            <User2 className="h-10 w-10 text-primary border border-primary p-2 rounded-full transition-transform duration-300 hover:scale-105" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount sideOffset={8}>
        {isLoggedIn ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userType}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center p-2 cursor-pointer transition-colors duration-200 hover:bg-accent rounded-md">
              <HelpCircle className="mr-3 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center p-2 cursor-pointer transition-colors duration-200 hover:bg-destructive hover:text-destructive-foreground rounded-md"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={handleSignIn}
            className="flex items-center p-2 cursor-pointer transition-colors duration-200 hover:bg-accent rounded-md"
          >
            <LogIn className="mr-3 h-4 w-4" />
            <span>Sign in</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
