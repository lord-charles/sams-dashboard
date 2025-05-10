import React from "react";
import CtDashboard from "../components/ct-dashboard";
import { DashboardProvider } from "../contexts/dashboard-context";
import { CTBreadcrumb } from "../components/breadcrumb";
import { DashboardHeader } from "../components/dashboard-header";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { Metadata } from "next";
import UnderConstruction from "@/components/under-construction";

export const metadata: Metadata = {
  title: "School Budget Dashboard",
  description: "School budget management and tracking system",
};

interface PageProps {
  params: { year?: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getInitialData(year: number) {
  try {
    const [{ data: states }, { data: statCardData }, { data: uniqueSchools }] =
      await Promise.all([
        axios.get(`${base_url}data-set/get/2023_data/state`),
        axios.get(`${base_url}ct/stat-card/data?year=${year}&tranche=1`),
        axios.get(`${base_url}ct/get/unique-schools?year=${year}&tranche=1`),
      ]);

    return {
      states,
      statCardData,
      uniqueSchools,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      states: [],
      statCardData: {
        totalSchools: { value: 0 },
        totalLearners: { value: 0, male: 0, female: 0 },
        totalAmountDisbursed: { value: 0, currency: "SSP" },
        accountabilityRate: { value: 0, unit: "%" },
        learnersWithDisabilities: {
          value: 0,
          percentageOfTotalLearners: 0,
          male: 0,
          female: 0,
        },
        averageAttendance: { value: 0, unit: "%" },
        publicSchools: { value: 0, percentageOfTotalSchools: 0 },
        latestTranche: { trancheNumber: 0, startDate: null },
      },
    };
  }
}

export default async function DashboardPage({ params }: PageProps) {
  const currentYear = new Date().getFullYear().toString();
  const year = params.year || currentYear;
  const { states, statCardData, uniqueSchools } = await getInitialData(
    parseInt(year)
  );

  return (
    <DashboardProvider initialYear={year} initialSchoolType="PRI">
      <div className="px-2 min-h-screen bg-gradient-to-b from-primary/20 to-background">
        <DashboardHeader />
        <CtDashboard
          initialStates={states || []}
          initialStatCardData={statCardData}
          initialUniqueSchools={uniqueSchools?.data || []}
        />
      </div>
      {/* <UnderConstruction/> */}
    </DashboardProvider>
  );
}
