import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
// import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { SidebarWrapper } from "@/components/sidebar/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}
    >
      <section className="flex ">
        {/* <SidebarWrapper /> */}
        <SidebarWrapper>
        <SidebarInset className="flex-1 overflow-hidden flex flex-col">
        <NavbarWrapper>{children}</NavbarWrapper>
        </SidebarInset>
        </SidebarWrapper>
      </section>
    </SidebarContext.Provider>
  );
};
