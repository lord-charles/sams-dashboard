"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  LogIn,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserBanner() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  if (!isLoggedIn) {
    return (
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Link href="/dashboard/auth">
            <Button variant="secondary" className="w-full group">
              <span className="mr-2 group-hover:translate-x-1 transition-transform">
                Sign In
              </span>
              <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const user = session?.user;
  const fullName = user ? `${user.firstname} ${user.lastname}` : "";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full bg-primary/50 rounded-md">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex w-full items-center gap-4 p-2 cursor-pointer hover:bg-accent rounded-lg transition-colors">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{fullName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.userType || "User"}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{fullName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.userType || "User"}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/dashboard/auth" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
