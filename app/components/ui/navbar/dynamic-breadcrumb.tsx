"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, HomeIcon, FileText, Globe } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { navigationItems, resourceItems } from "@/components/sidebar/sidebar"

interface BadgeProps {
  text: string
  variant?: "outline" | "default" | "secondary" | "destructive"
}

interface NavigationItem {
  id: string
  title: string
  path?: string
  icon: typeof HomeIcon
  keywords: string[]
  badge?: string | BadgeProps
  children?: NavigationChildItem[]
  external?: boolean
}

interface NavigationChildItem {
  id: string
  title: string
  path?: string
  keywords: string[]
  badge?: string | BadgeProps
}

interface DynamicBreadcrumbProps {
  showVersion?: boolean
  version?: string
}

export function DynamicBreadcrumb({
  showVersion = false,
  version = "v2.0",
}: DynamicBreadcrumbProps) {
  const pathname = usePathname()

  // Helper function to check if a path matches the current pathname
  const isPathMatch = (path: string) => {
    if (!path) return false
    
    // Handle exact matches
    if (path === pathname) return true

    // Handle dynamic segments in grants paths
    if (path.includes("/grants/") && pathname.includes("/grants/")) {
      const pathParts = path.split("/")
      const pathnameParts = pathname.split("/")
      
      // Match base structure (grants/type/home)
      if (pathParts.length >= 4 && pathnameParts.length >= 4) {
        return pathParts[1] === pathnameParts[1] && // grants
               pathParts[2] === pathnameParts[2] && // type (sbrts, cash-transfers)
               pathParts[3] === pathnameParts[3]    // home
      }
    }

    // Handle other nested routes
    return pathname.startsWith(path)
  }

  // Find the current section and subsection based on pathname
  const findCurrentSection = (): { section: NavigationItem | null, item: NavigationChildItem | null, subItem: null, matchLength: number } => {
    interface BestMatch {
      section: NavigationItem | null
      item: NavigationChildItem | null
      subItem: null
      matchLength: number
    }
    
    let bestMatch: BestMatch = { section: null, item: null, subItem: null, matchLength: 0 }

    // First check navigation items
    for (const section of navigationItems as NavigationItem[]) {
      // Check direct path match or if pathname starts with section path
      if (section.path && isPathMatch(section.path)) {
        const matchLength = section.path.split('/').length
        if (matchLength > bestMatch.matchLength) {
          bestMatch = { section, item: null, subItem: null, matchLength }
        }
      }

      // Check children if they exist
      if (section.children) {
        for (const item of section.children) {
          if (item.path && isPathMatch(item.path)) {
            const matchLength = item.path.split('/').length
            if (matchLength > bestMatch.matchLength) {
              bestMatch = { section, item, subItem: null, matchLength }
            }
          }
        }
      }
    }

    // Then check resource items
    for (const resource of resourceItems as NavigationItem[]) {
      if (resource.path && isPathMatch(resource.path)) {
        const matchLength = resource.path.split('/').length
        if (matchLength > bestMatch.matchLength) {
          bestMatch = { section: resource, item: null, subItem: null, matchLength }
        }
      }
    }

    return bestMatch
  }

  const { section, item } = findCurrentSection()
  if (!section) return null

  const SectionIcon = section?.icon || HomeIcon
  const currentTitle = item?.title || section?.title
  const isExternal = 'external' in section && section?.external

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <Breadcrumb className="flex">
        <BreadcrumbList>
          {/* Home icon */}
          <BreadcrumbItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <BreadcrumbLink
                    href="/dashboard"
                    className="flex items-center p-1 rounded-md hover:bg-muted transition-colors"
                  >
                    <HomeIcon className="h-4 w-4" />
                  </BreadcrumbLink>
                </TooltipTrigger>
                <TooltipContent>Home</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </BreadcrumbItem>

          {section && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                {section.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <BreadcrumbLink className="flex items-center gap-1 group px-2 py-1 rounded-md hover:bg-muted transition-colors">
                        <SectionIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <span className="font-medium">{section?.title}</span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-all duration-200 group-data-[state=open]:rotate-180" />
                      </BreadcrumbLink>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-72">
                      {section?.children?.map((child: NavigationChildItem) => (
                        <DropdownMenuItem key={child.id} asChild>
                          <Link href={child.path || "#"} className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className={cn("font-medium", isPathMatch(child.path || "") && "text-primary")}>
                              {child.title}
                            </span>
                            {child.badge && (
                              <Badge
                                variant={typeof child.badge === 'string' ? 'outline' : child.badge.variant || 'outline'}
                                className="ml-2"
                              >
                                {typeof child.badge === 'string' ? child.badge : child.badge.text}
                              </Badge>
                            )}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <BreadcrumbLink
                    {...(isExternal ? {
                      as: 'a',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    } : {
                      href: section?.path || "#"
                    })}
                    className="flex items-center px-2 py-1 rounded-md hover:bg-muted transition-colors"
                  >
                    <SectionIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span className="font-medium">{section?.title}</span>
                    {isExternal && <Globe className="h-3 w-3 ml-1 text-muted-foreground" />}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          )}

          {/* Current page/item */}
          {item && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center px-2 py-1">
                  <span className="font-medium">{currentTitle}</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
