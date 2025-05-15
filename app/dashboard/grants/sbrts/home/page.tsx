import { Metadata } from "next";
import { DashboardHeader } from "../components/dashboard-header";
import { StatsCards } from "../components/stats-cards";
import { DashboardTabs } from "../components/dashboard-tabs";
import { DashboardProvider } from "../contexts/dashboard-context";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";

export const metadata: Metadata = {
  title: "School Budget Dashboard",
  description: "School budget management and tracking system",
};

interface PageProps {
  params: { year?: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ params }: PageProps) {
  const currentYear = new Date().getFullYear().toString();
  const year = params.year || currentYear;

  const budget = await axios.get(`${base_url}budget`, {
    params: { year },
  });
  const data = budget.data;

  return (
    <DashboardProvider initialYear={year} initialSchoolType="SBRTS">
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/20 to-background p-1 gap-2">
        <DashboardHeader />
        <StatsCards />
        <DashboardTabs budgets={data} />
      </div>
    </DashboardProvider>
  );
}
