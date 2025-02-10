import { Input, Link, Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";

import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import { PlaceholdersAndVanishInput } from "./vanish-inputs";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";

export const NavbarWrapper = ({ children }) => {
  const pathname = usePathname()?.split("/")[2]?.toUpperCase();

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

  const handleChange = (e) => {
  };
  const onSubmit = (e) => {
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
          <NavbarContent className="md:hidden">
            <BurguerButton />
          </NavbarContent>
          <div className="flex justify-between w-full items-center">
            <div className="font-bold text-xl md:ml:0 lg:ml:0 xxxs:ml-4 md:text-3xl mt-4 ">{formattedPathname ? formattedPathname : <Badge variant="default" className="px-4 py-2 text-lg font-semibold mb-4 bg-primary-500">
              SAMS
            </Badge>}</div>


            <div className="hidden lg:flex w-[400px]">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>

            <NavbarContent
              justify="end"
              className="w-fit data-[justify=end]:flex-grow-0"
            >
              {/* <ModeToggle /> */}

              {/* <NotificationsDropdown /> */}

              <NavbarContent>
                <UserDropdown />
              </NavbarContent>
            </NavbarContent>
          </div>
        </Navbar>
      </div>
      {children}
    </div>
  );
};
