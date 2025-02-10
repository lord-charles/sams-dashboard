"use client";
import { createColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useThemeContext } from "@/lib/themeContext";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export type BudgetInterface = {
  code?: string;
  school?: string;
  state10?: string;
  county28?: string;
  payam28?: string;
  year?: number;
  meta?: {
    classLevels?: string[];
    estimateLearnerEnrolment?: number;
    latestAttendance?: number;
    teachers?: {
      estimatedFemale?: number;
      estimatedMale?: number;
      estimatedFemaleDisabled?: number;
      estimatedMaleDisabled?: number;
    };
    classrooms?: {
      permanent?: number;
      temporary?: number;
      openAir?: number;
    };
    governance?: {
      SGB?: boolean;
      SDP?: boolean;
      budgetSubmitted?: boolean;
      bankAccount?: boolean;
    };
  };
  budget?: {
    groups?: Array<{
      group?: string;
      categories?: Array<{
        categoryName?: string;
        categoryCode?: string;
        items?: Array<{
          budgetCode?: string;
          description?: string;
          neededItems?: string[];
          units?: number;
          unitCostSSP?: number;
          totalCostSSP?: number;
          fundingSource?: string | null;
          monthActivityToBeCompleted?: string;
          subCommitteeResponsible?: string;
          adaptationCostPercentageLWD?: number | null;
          impact?: string;
        }>;
      }>;
    }>;
    submittedAmount?: number;
    preparedBy?: string;
    reviewedBy?: string;
    reviewDate?: string; // Use Date type if you prefer working with Date objects
    previousYearLedgerAccountedFor?: boolean;
  };
  revenues?: Array<{
    type?: string;
    category?: string;
    description?: string;
    amount?: number;
    sourceCode?: string;
    group?: string;
  }>;
};

export default function BudgetTable({
  budgets,
  selectedYear,
  selectedSchoolType,
}: {
  budgets: any;
  selectedYear: string;
  selectedSchoolType: string;
}) {
  const { themeColor } = useThemeContext();

  return (
    <Card className="p-4">
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <CardTitle>Budget Overview - {selectedYear}</CardTitle>
            <CardDescription>
              Detailed breakdown of {selectedSchoolType} budgets and expenditure
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className={`${
                themeColor === "Slate" ||
                (themeColor === "Default" && "dark:text-black text-white")
              } text-white font-semibold`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Budget
            </Button>
          </div>
        </div>
        <DataTable
          data={Array.isArray(budgets) ? budgets : []}
          columns={createColumns(selectedYear)}
          selectedYear={selectedYear}
        />
      </div>
    </Card>
  );
}
