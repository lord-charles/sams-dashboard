import { Input, Link, Navbar, NavbarContent } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { BurguerButton } from "./burguer-button";
import { UserDropdown } from "./user-dropdown";
import { PlaceholdersAndVanishInput } from "./vanish-inputs";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "./dynamic-breadcrumb";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BanknoteIcon, BarChart3, BookOpen, Calendar, ChevronDown, Globe, GraduationCap, HelpCircle, Info, Layers2, LayoutDashboard, LogOut, Menu, School, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from 'next/image';

interface NavigationChildItem {
  id: string;
  title: string;
  path?: string;
  keywords: string[];
  badge?: {
    text: string;
    variant: string;
  };
}

interface NavigationItem {
  id: string;
  title: string;
  path?: string;
  icon?: any;
  keywords: string[];
  badge?: string | number;
  children?: NavigationChildItem[];
}

interface ResourceItem {
  id: string;
  title: string;
  path: string;
  icon: any;
  external?: boolean;
  keywords: string[];
}

export const NavbarWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()?.split("/")[2]?.toUpperCase();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)
  const isMobileDevice = useMediaQuery("(max-width: 640px)")
  const [schoolsCount, setSchoolsCount] = useState("0")
  useEffect(() => {
     const storedTotalSchools = localStorage.getItem('totalSchools')
     if (storedTotalSchools) {
       setSchoolsCount(storedTotalSchools)
     }
   }, [])

  const placeholders = [
    "Search schools",
    "Search enrollment",
    "Search attendance",
    "Search grants",
    "Search reports",
    "Search learners",

  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitted");
  };

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
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
  ];

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
  ];

  const [navigationState, setNavigationState] = useState<Record<string, boolean>>({});

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden ">
      <div className="bg-primary/50 ">
        <Navbar
          isBordered
          className="w-full"
          classNames={{
            wrapper: "w-full max-w-full",
          }}
        >
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center gap-2 px-2 sm:px-4">
              {isMobileDevice ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="-ml-1 relative overflow-hidden group"
                  onClick={() => setShowMobileMenu(true)}
                >
                  <Menu className="h-5 w-5 transition-transform group-hover:scale-110 duration-200" />
                  <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="sr-only">Menu</span>
                </Button>
              ) : (
                <SidebarTrigger className="-ml-1" />
              )}

              <Separator orientation="vertical" className="mx-2 h-4 hidden sm:block" />

              <DynamicBreadcrumb showVersion={true} version='v1.0' />
            </div>

            <div className="hidden lg:flex w-[400px]">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>
            <UserDropdown />
          </div>
          {/* Mobile Menu */}
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetContent side="left" className="w-[80%] max-w-sm p-0">
              <SheetHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Image priority width={40} height={40} src="/img/mogei.png" className="object-contain" alt="Mogei logo" />
                  <Badge variant="default" className="px-2 py-1 text-sm font-semibold bg-primary-500">
                    SAMS
                  </Badge>
                </div>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="py-2">
                  {/* Main Navigation */}
                  <div className="px-2 py-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Main Navigation</p>
                    <div className="space-y-1">
                      {navigationItems.map((item) => (
                        <div key={item.id}>
                          {!item?.children ? (
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-left relative"
                              onClick={() => setShowMobileMenu(false)}
                              asChild
                            >
                              <Link href={item.path || "#"}>
                                {pathname === item.path && (
                                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-full" />
                                )}
                                <item.icon className="mr-2 h-4 w-4 text-primary" />
                                {item.title}
                                {item?.badge && (
                                  <Badge variant="outline" className="ml-auto text-xs py-0 h-5 bg-primary/10">
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            </Button>
                          ) : (
                            <div className="space-y-1">
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-left relative group"
                                onClick={() => setNavigationState(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                              >
                                {item.children.some((child) => pathname === child.path) && (
                                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-full" />
                                )}
                                <item.icon className="mr-2 h-4 w-4 text-primary" />
                                {item.title}
                                <ChevronDown
                                  className={`ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 ${navigationState[item.id] ? "rotate-180" : ""}`}
                                />
                              </Button>
                              {navigationState[item.id] && (
                                <div className="pl-6 space-y-1">
                                  {item.children.map((child) => (
                                    <Button
                                      key={child.id}
                                      variant="ghost"
                                      className="w-full justify-start text-left relative"
                                      onClick={() => setShowMobileMenu(false)}
                                      asChild
                                    >
                                      <Link href={child.path || "#"}>
                                        {pathname === child.path && (
                                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-full" />
                                        )}
                                        {child.title}
                                        {child.badge && (
                                          <Badge
                                            variant={child.badge.variant === "success" ? "secondary" : "outline"}
                                            className={`ml-auto text-xs py-0 h-5 ${child.badge.variant === "success" && "bg-green-500/10 text-green-600"}`}
                                          >
                                            {child.badge.text}
                                          </Badge>
                                        )}
                                      </Link>
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-2" />

                  {/* Resources */}
                  <div className="px-2 py-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Resources</p>
                    <div className="space-y-1">
                      {resourceItems.map((item) => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start text-left relative"
                          onClick={() => setShowMobileMenu(false)}
                          asChild
                        >
                          {item.external ? (
                            <a href={item.path} target="_blank" rel="noopener noreferrer">
                              <item.icon className="mr-2 h-4 w-4 text-primary" />
                              {item.title}
                            </a>
                          ) : (
                            <Link href={item.path}>
                              <item.icon className="mr-2 h-4 w-4 text-primary" />
                              {item.title}
                            </Link>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </Navbar>
      </div>
      {children}
    </div>
  );
};
