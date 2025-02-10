"use client";
import { createColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useThemeContext } from "@/lib/themeContext";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export type EligibilityInterface = {
  code?: string;
  year?: number;
  state10?: string;
  county28?: string;
  payam28?: string;
  ownership?: string;
  schoolType?: string;
  school?: string;
  submittedAmount?: number;
  governance?: {
    SGB?: boolean;
    SDP?: boolean;
    budgetSubmitted?: boolean;
    bankAccount?: boolean;
  };
  enrolment?: number;
  eligibility?: string;
};

export default function EligibilityTable({
  budgets,
  selectedYear,
}: {
  budgets: any;
  selectedYear: string;
}) {
  const { themeColor } = useThemeContext();

  return (
    <Card className="p-4">
      <div className=" flex-1 flex-col space-y-8 md:flex ">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <CardTitle>Eligibility Overview - {selectedYear}</CardTitle>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable
          data={Array.isArray(budgets) ? budgets : []}
          selectedYear={selectedYear}
          columns={createColumns(selectedYear)}
        />
      </div>
    </Card>
  );
}
