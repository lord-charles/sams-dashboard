import { Input, Link, Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";
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
import { HelpCircle, Layers2, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";

export const NavbarWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()?.split("/")[2]?.toUpperCase();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)
  const isMobileDevice = useMediaQuery("(max-width: 640px)")
  const formattedPathname =
    pathname?.charAt(0)?.toUpperCase() + pathname?.slice(1)?.toLowerCase();

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

          <DynamicBreadcrumb  showVersion={true} version='v1.0' />
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
            <SheetTitle className="text-left">Menu</SheetTitle>
            <SheetDescription className="text-left">Navigate to different sections of the dashboard.</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="py-4">
              <div className="space-y-1 px-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Layers2 className="mr-2 h-4 w-4" />
                  Projects
                </Button>
               
              </div>

              <Separator className="my-4" />

              <div className="space-y-1 px-2">
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="px-4 py-2">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">shadcn</p>
                    <p className="text-xs text-muted-foreground">m@example.com</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                        Admin
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setShowMobileMenu(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
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
