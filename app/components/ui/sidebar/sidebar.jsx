"use client";
import React from "react";
import { Sidebar } from "./sidebar.styles";
import { CompaniesDropdown } from "./companies-dropdown";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";
import UsersIcon from "../icons/sidebar/users-icon";
import ActivityIcon from "../icons/sidebar/activity-icon";
import LaptopIcon from "../icons/sidebar/laptop-icon";
import SchoolIcon from "../icons/sidebar/school-icon";
import GraduateIcon from "../icons/sidebar/graduate-icon";
import CalendarIcon from "../icons/sidebar/calendar-icon";
import FileIcon from "../icons/sidebar/file-icon";
import GraphIcon from "../icons/sidebar/graph-icon";
import GlobeIcon from "../icons/sidebar/globe-icon";
import QuestionIcon from "../icons/sidebar/question-icon";
import JournalIcon from "../icons/sidebar/journal-icon";
import { CollapseItems } from "./collapse-items";
import CashIcon from "../icons/sidebar/cash-icon";
import { ShieldIcon } from "../icons/sidebar/shield-icon";
import { InfoIcon } from "lucide-react";
import { UserBanner } from "../../UserBanner";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[202] sticky top-0 ">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={`${Sidebar({
          collapsed: collapsed,
        })} bg-gradient-to-b from-primary/20 to-background`}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Dashboard"
              icon={<LaptopIcon />}
              isActive={pathname === "/dashboard"}
              href="/dashboard"
            />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={pathname === "/dashboard/schools"}
                title="Schools"
                icon={<SchoolIcon />}
                href="/dashboard/schools"
              />
              <CollapseItems
                icon={<GraduateIcon />}
                items={[
                  {
                    name: "Learners",
                    url: "/dashboard/learners",
                  },
                  {
                    name: "Live Enrollment",
                    url: "/dashboard/live-enrollment",
                  },
                  { name: "Teachers", url: "/dashboard/teachers" },
                ]}
                title="Enrollment"
              />

              <SidebarItem
                isActive={pathname === "/dashboard/attendance"}
                title="Attendance"
                icon={<CalendarIcon />}
                href="/dashboard/attendance"
              />
              <CollapseItems
                icon={<CashIcon />}
                items={[
                  {
                    name: "Cash Transfers",
                    url: `/dashboard/grants/cash-transfers/home/${new Date().getFullYear()}`,
                  },
                  {
                    name: "Capitation Grants",
                    url: `/dashboard/grants/sbrts/home/${new Date().getFullYear()}`,
                  },
                  // {
                  //   name: "Other Disbursements",
                  //   url: "/dashboard/grants/other",
                  // },
                  // {
                  //   name: "Teacher Incentives",
                  //   url: "/dashboard/grants/teacher",
                  // },
                ]}
                title="Grants"
              />
              {/* <CollapseItems
                icon={<UsersIcon />}
                items={[
                  {
                    name: "Users",
                    url: "/dashboard/users",
                  },
                  // { name: "Roles", url: "/dashboard/roles" },
                ]}
                title="Administration"
              /> */}
              {/* <SidebarItem
                isActive={pathname === "/dashboard/exams"}
                title="Exams"
                icon={<FileIcon />}
                href="/dashboard/exams"
              /> */}
              <SidebarItem
                isActive={pathname === "/dashboard/reports"}
                title="Reports"
                icon={<GraphIcon />}
                href="/dashboard/reports"
              />
              {/* <SidebarItem
                isActive={pathname === "/dashboard/progress"}
                title="Progress"
                icon={<ActivityIcon />}
                href="/dashboard/progress"
              /> */}
            </SidebarMenu>

            <SidebarMenu title="Resources">
              <SidebarItem
                // isActive={pathname === "/dashboard/changelog"}
                title="GESS Website"
                href="https://girlseducationsouthsudan.org/"
                icon={<GlobeIcon />}
              />
              <SidebarItem
                // isActive={pathname === "/dashboard/changelog"}
                title="MoGEI Website"
                href="https://mogei.gov.ss/"
                icon={<GlobeIcon />}
              />
              <SidebarItem
                isActive={pathname === "/dashboard/about-us"}
                title="About"
                href="/dashboard/about-us"
                icon={<InfoIcon className="h-4 w-4 text-gray-500" />}
              />
              <SidebarItem
                isActive={pathname === "/dashboard/lms"}
                title="LMS"
                href="/dashboard/lms"
                icon={<QuestionIcon />}
              />



            </SidebarMenu>
          </div>

          <UserBanner
            user={{
              name: "Charles Mwaniki",
              email: "charles@sssams.org",
              role: "Administrator",
              avatarUrl: "/path/to/avatar.jpg"
            }}
            isLoggedIn={true}
            notification={{
              title: "Plan about to expire",
              message: "Enjoy 10% off when renewing your plan today.",
              actionLabel: "Get the discount",
              onAction: () => handleRenewal()
            }}
            onLogout={() => handleLogout()}
          />

        </div>
      </div>
    </aside>
  );
};
