"use client";

import { useContext } from "react";

import { DashboardContext } from "../../contexts/dashboard-context";
import useSWR from "swr";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { Loader2 } from "lucide-react";
import EligibilityTable from "../../budgets/eligibility-table/eligibility";
import { NoBudgets } from "../../budgets/components/no-budgets";
import { TableSkeleton } from "@/components/skeletons/table-loading";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function EligibilityTab() {
  const { selectedYear, selectedSchoolType } = useContext(DashboardContext);

  const { data, error, isLoading } = useSWR(
    `${base_url}budget/get/eligibility?year=${selectedYear}`,
    fetcher,
    { errorRetryCount: 2, revalidateOnFocus: false }
  );

  return (
    <div>
      {isLoading ? (
        <TableSkeleton
          title="Eligibility Overview"
          description={`Eligibility Overview - ${selectedYear}`}
          columns={5}
          rows={10}
        />
      ) : error ? (
        <div className="text-destructive text-center py-4">
          Error loading eligibility data
        </div>
      ) : data?.data.length === 0 ? (
        <NoBudgets
          selectedYear={selectedYear}
          onYearChange={() => {}}
          tab="eligibility"
        />
      ) : (
        <EligibilityTable budgets={data.data} selectedYear={selectedYear} />
      )}
    </div>
  );
}
