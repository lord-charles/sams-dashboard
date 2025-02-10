"use client";

import { useContext } from "react";
import { DashboardContext } from "../../contexts/dashboard-context";
import useSWR from "swr";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { NoBudgets } from "../../budgets/components/no-budgets";
import { TableSkeleton } from "@/components/skeletons/table-loading";
import AccountabilityTable from "../../budgets/accountability-table/accountability";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function AccountabilityTab() {
  const { selectedYear } = useContext(DashboardContext);

  const { data, error, isLoading } = useSWR(
    `${base_url}accountability?tranche=Tranche 1&year=${selectedYear}`,
    fetcher,
    { errorRetryCount: 2, revalidateOnFocus: false }
  );

  return (
    <div>
      {isLoading ? (
        <TableSkeleton
          title="Accountability Overview"
          description={`Accountability Overview - ${selectedYear}`}
          columns={5}
          rows={10}
        />
      ) : error ? (
        <div className="text-destructive text-center py-4">
          Error loading accountability data
        </div>
      ) : data?.length === 0 ? (
        <NoBudgets
          selectedYear={selectedYear}
          onYearChange={() => {}}
          tab="accountability"
        />
      ) : (
        <AccountabilityTable
          accountabilities={data}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
}
