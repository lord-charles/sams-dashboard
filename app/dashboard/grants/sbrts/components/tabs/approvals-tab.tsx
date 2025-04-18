"use client";

import { useContext } from "react";
import { DashboardContext } from "../../contexts/dashboard-context";
import useSWR from "swr";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { NoBudgets } from "../../budgets/components/no-budgets";
import { TableSkeleton } from "@/components/skeletons/table-loading";
import ApprovalsTable from "../../budgets/approvals-table/approvals";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function ApprovalsTab() {
  const { selectedYear, selectedSchoolType } = useContext(DashboardContext);

  const { data, error, isLoading } = useSWR(
    `${base_url}accountability/approvals/get-all?year=${selectedYear}`,
    fetcher,
    { errorRetryCount: 2, revalidateOnFocus: false }
  );

  return (
    <div>
      {isLoading ? (
        <TableSkeleton
          title="Approval Overview"
          description={`Approval Overview - ${selectedYear}`}
          columns={5}
          rows={10}
        />
      ) : error ? (
        <div className="text-destructive text-center py-4">
          Error loading approval data
        </div>
      ) : data?.length === 0 ? (
        <NoBudgets
          selectedYear={selectedYear}
          onYearChange={() => {}}
          tab="approvals"
        />
      ) : (
        <ApprovalsTable approvals={data} selectedYear={selectedYear} />
      )}
    </div>
  );
}
