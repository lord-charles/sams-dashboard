"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Laptop,
  School,
  GraduationCap,
  Calendar,
  BarChart3,
  Globe,
  Info,
  Search,
  BanknoteIcon,
  ChevronDown,
  Menu,
  BookOpen,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { SearchResults } from "@/components/sidebar/search-results"
import { UserBanner } from "./UserBanner"

interface SidebarWrapperProps {
  children?: React.ReactNode
}

interface SearchResult extends NavigationItem {
  parentTitle?: string
  type: 'item' | 'subitem'
}

interface NavigationChildItem {
  id: string
  title: string
  path?: string
  icon?: any
  keywords: string[]
  badge?: any
}

interface NavigationItem {
  id: string
  title: string
  path?: string
  icon?: any
  keywords: string[]
  badge?: any
  children?: NavigationChildItem[]
}

interface ResourceItem {
  id: string
  title: string
  path: string
  icon: any
  external?: boolean
  keywords: string[]
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1)
  const [schoolsCount, setSchoolsCount] = useState("0")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedTotalSchools = localStorage.getItem('totalSchools')
    if (storedTotalSchools) {
      setSchoolsCount(storedTotalSchools)
    }
  }, [])

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/dashboard",
      icon: Laptop,
      keywords: ["home", "overview", "stats", "analytics"],
    },
    {
      id: "schools",
      title: "Schools",
      path: "/dashboard/schools",
      icon: School,
      badge: schoolsCount,
      keywords: ["institutions", "education", "centers", "academies"],
    },
    {
      id: "enrollment",
      title: "Enrollment",
      icon: GraduationCap,
      keywords: ["students", "registration", "admission", "learners"],
      children: [
        {
          id: "learners",
          title: "Learners",
          path: "/dashboard/learners",
          keywords: ["students", "pupils"],
        },
        {
          id: "live-enrollment",
          title: "Enrollment",
          path: "/dashboard/live-enrollment",
          badge: { text: "Live", variant: "success" },
          keywords: ["real-time", "current", "active"],
        },
        {
          id: "teachers",
          title: "Teachers",
          path: "/dashboard/teachers",
          keywords: ["instructors", "educators", "staff"],
        },
      ],
    },
    {
      id: "attendance",
      title: "Attendance",
      path: "/dashboard/attendance",
      icon: Calendar,
      keywords: ["presence", "absence", "tracking", "monitoring"],
    },
    {
      id: "grants",
      title: "Grants",
      icon: BanknoteIcon,
      keywords: ["funding", "finance", "money", "support", "aid"],
      children: [
        {
          id: "cash-transfers",
          title: "Cash Transfers",
          path: `/dashboard/grants/cash-transfers/home/${new Date().getFullYear()}`,
          keywords: ["payments", "disbursements", "funds"],
        },
        {
          id: "capitation-grants",
          title: "Capitation Grants",
          path: `/dashboard/grants/sbrts/home/${new Date().getFullYear()}`,
          keywords: ["per-student", "allocation", "funding"],
        },
      ],
    },
    {
      id: "reports",
      title: "Reports",
      path: "/dashboard/reports",
      icon: BarChart3,
      keywords: ["statistics", "data", "analysis", "metrics"],
    },
  ]

  const resourceItems: ResourceItem[] = [
    {
      id: "gess-website",
      title: "GESS Website",
      path: "https://girlseducationsouthsudan.org/",
      icon: Globe,
      external: true,
      keywords: ["official", "information", "resources"],
    },
    {
      id: "mogei-website",
      title: "MoGEI Website",
      path: "https://mogei.gov.ss/",
      icon: Globe,
      external: true,
      keywords: ["ministry", "government", "education"],
    },
    {
      id: "about",
      title: "About",
      path: "/dashboard/about-us",
      icon: Info,
      external: false,
      keywords: ["information", "details", "description"],
    },
    {
      id: "lms",
      title: "LMS",
      path: "/dashboard/lms",
      icon: BookOpen,
      external: false,
      keywords: ["learning", "courses", "training", "education"],
    },
  ]

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim().length > 0) {
      setIsSearching(true)
      const results: SearchResult[] = []
      
      // Search through navigation and resource items
      navigationItems.forEach(item => searchItem(item, results))
      resourceItems.forEach(item => {
        const { external, ...rest } = item
        searchItem({ ...rest, children: undefined }, results)
      })
      
      setSearchResults(results)
      setSelectedResultIndex(-1)
    } else {
      setIsSearching(false)
      setSearchResults([])
    }
  }

  // Helper function to search an item
  const searchItem = (item: NavigationItem, results: SearchResult[], parentTitle?: string) => {
    const normalizedQuery = searchQuery.toLowerCase().trim()
    const matchesTitle = item.title.toLowerCase().includes(normalizedQuery)
    const matchesKeywords = item.keywords?.some((keyword: string) => 
      keyword.toLowerCase().includes(normalizedQuery)
    )

    if (matchesTitle || matchesKeywords) {
      results.push({
        ...item,
        parentTitle,
        type: parentTitle ? "subitem" : "item"
      })
    }

    // Check if item has children
    if (item.children) {
      item.children.forEach((child: NavigationChildItem) => {
        searchItem({ ...child, icon: undefined, children: undefined }, results, item.title)
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearching) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedResultIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case "Enter":
        e.preventDefault()
        if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
          const selectedItem = searchResults[selectedResultIndex]
          handleResultClick(selectedItem)
        }
        break
      case "Escape":
        e.preventDefault()
        setIsSearching(false)
        setSearchQuery("")
        break
    }
  }

  const handleResultClick = (item: any) => {
    setIsSearching(false)
    setSearchQuery("")
    // Navigate to the item's path
    if (item.path) {
      if (item.external) {
        window.open(item.path, "_blank")
      } else {
        window.location.href = item.path
      }
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Add keyboard shortcut for search focus (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <SidebarProvider>
      <Sidebar className="bg-gradient-to-b from-primary/20 to-background border-r border-border/40 shadow-sm">
        <SidebarHeader className="pb-0">
          <div className="flex items-center justify-between px-4 pb-2">
            <div className="flex items-center gap-3">
              <Image priority width={80} height={80} src="/img/mogei.png" className="object-contain" alt="Mogei logo" />
              <div className="font-bold text-xl xxxs:ml-4 md:text-3xl mt-5"> <Badge variant="default" className="px-4 py-2 text-lg font-semibold mb-4 bg-primary-500">
              SAMS
            </Badge></div>
            </div>
            <SidebarTrigger className="md:hidden">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
          </div>
          <div className="py-3 px-2 relative">
            <div className="relative">
              <Input
                ref={searchInputRef}
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 h-10 bg-muted/40 focus-visible:bg-background rounded-md pr-8 transition-all duration-200 border-muted-foreground/20 focus-visible:border-primary/30"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            {/* Search Results Dropdown */}
            {isSearching && (
              <div
                ref={searchResultsRef}
                className="absolute left-4 right-4 top-[calc(100%-8px)] z-50 mt-2 overflow-hidden rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95"
              >
                <SearchResults
                  results={searchResults}
                  selectedIndex={selectedResultIndex}
                  onResultClick={handleResultClick}
                />
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-foreground/70 px-2 py-1.5">
              Main Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    {!item.children ? (
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.path}
                        className="h-12 font-medium transition-all hover:bg-primary/10 data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-semibold rounded-md group"
                      >
                          
                        <Link href={item.path || "#"} >
                        {pathname === item.path && (
                            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-primary rounded-l-full" />
                          )}
                          <div
                            className={cn(
                              "flex items-center justify-center h-6 w-6 rounded-md mr-2 transition-colors",
                              pathname === item.path
                                ? "bg-primary/20 text-primary"
                                : "text-muted-foreground group-hover:text-foreground",
                            )}
                          >
                            <item.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-md">{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="ml-auto text-xs py-0 h-5 bg-primary/10">
                              {item?.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <>
                        <SidebarMenuButton
                          className="relative h-11 font-medium transition-all hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold rounded-md group"
                          isActive={item.children.some((child) => pathname === child.path)}
                        >
                          {item.children.some((child) => pathname === child.path) && (
                            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-primary rounded-l-full" />
                          )}
                          <div
                            className={cn(
                              "flex items-center justify-center h-6 w-6 rounded-md mr-2 transition-colors",
                              item.children.some((child) => pathname === child.path)
                                ? "bg-primary/20 text-primary"
                                : "text-muted-foreground group-hover:text-foreground",
                            )}
                          >
                         
                            <item.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="truncate text-md">{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                        <SidebarMenuSub className="space-y-1 mt-1">
                          {item.children.map((child, idx) => (
                            <SidebarMenuSubItem
                              key={child.id}
                              className="animate-in fade-in-50 slide-in-from-left-3 duration-300"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === child.path}
                                className="hover:bg-primary/20 bg-primary/10 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium pl-9 relative"
                              >
                                <Link href={child.path || "#"}>
                                  {pathname === child.path && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-primary rounded-l-full" />
                                  )}
                                  {child.title}
                                  {child.badge && (
                                    <Badge
                                      variant={child.badge.variant === "success" ? "secondary" : "outline"}
                                      className={cn(
                                        "ml-auto text-xs py-0 h-5",
                                        child.badge.variant === "success" && "bg-green-500/10 text-green-600",
                                      )}
                                    >
                                      {child.badge.text}
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Resources */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-foreground/70 px-2 py-1.5">
              Resources
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {resourceItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={!item.external && pathname === item.path}
                      className="h-11 font-medium transition-all hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold rounded-md group"
                    >
                      {item.external ? (
                        <a href={item.path} target="_blank" rel="noopener noreferrer">
                          <div
                            className={cn(
                              "flex items-center justify-center h-6 w-6 rounded-md mr-2 transition-colors",
                              "text-muted-foreground group-hover:text-foreground",
                            )}
                          >
                            <item.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span>{item.title}</span>
                        </a>
                      ) : (
                        <Link href={item.path}>
                          <div
                            className={cn(
                              "flex items-center justify-center h-6 w-6 rounded-md mr-2 transition-colors",
                              pathname === item.path
                                ? "bg-primary/20 text-primary"
                                : "text-muted-foreground group-hover:text-foreground",
                            )}
                          >
                            <item.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/40 mt-auto">
        <UserBanner />

        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {children}
    </SidebarProvider>
  )
}


export const navigationItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: Laptop,
    keywords: ["home", "overview", "stats", "analytics"],
  },
  {
    id: "schools",
    title: "Schools",
    path: "/dashboard/schools",
    icon: School,
    badge: 9000,
    keywords: ["institutions", "education", "centers", "academies"],
  },
  {
    id: "enrollment",
    title: "Enrollment",
    icon: GraduationCap,
    keywords: ["students", "registration", "admission", "learners"],
    children: [
      {
        id: "learners",
        title: "Learners",
        path: "/dashboard/learners",
        keywords: ["students", "pupils"],
      },
      {
        id: "live-enrollment",
        title: "Enrollment",
        path: "/dashboard/live-enrollment",
        badge: { text: "Live", variant: "success" },
        keywords: ["real-time", "current", "active"],
      },
      {
        id: "teachers",
        title: "Teachers",
        path: "/dashboard/teachers",
        keywords: ["instructors", "educators", "staff"],
      },
    ],
  },
  {
    id: "attendance",
    title: "Attendance",
    path: "/dashboard/attendance",
    icon: Calendar,
    keywords: ["presence", "absence", "tracking", "monitoring"],
  },
  {
    id: "grants",
    title: "Grants",
    icon: BanknoteIcon,
    keywords: ["funding", "finance", "money", "support", "aid"],
    children: [
      {
        id: "cash-transfers",
        title: "Cash Transfers",
        path: `/dashboard/grants/cash-transfers/home/${new Date().getFullYear()}`,
        keywords: ["payments", "disbursements", "funds"],
      },
      {
        id: "capitation-grants",
        title: "Capitation Grants",
        path: `/dashboard/grants/sbrts/home/${new Date().getFullYear()}`,
        keywords: ["per-student", "allocation", "funding"],
      },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    path: "/dashboard/reports",
    icon: BarChart3,
    keywords: ["statistics", "data", "analysis", "metrics"],
  },
]

export const resourceItems = [
  {
    id: "gess-website",
    title: "GESS Website",
    path: "https://girlseducationsouthsudan.org/",
    icon: Globe,
    external: true,
    keywords: ["official", "information", "resources"],
  },
  {
    id: "mogei-website",
    title: "MoGEI Website",
    path: "https://mogei.gov.ss/",
    icon: Globe,
    external: true,
    keywords: ["ministry", "government", "education"],
  },
  {
    id: "about",
    title: "About",
    path: "/dashboard/about-us",
    icon: Info,
    external: false,
    keywords: ["information", "details", "description"],
  },
  {
    id: "lms",
    title: "LMS",
    path: "/dashboard/lms",
    icon: BookOpen,
    external: false,
    keywords: ["learning", "courses", "training", "education"],
  },
]