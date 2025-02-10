"use client";
import { useContext } from "react";
import BudgetTable from "../../budgets/budget-table/budgets";
import { Card } from "@/components/ui/card";
import { DashboardContext } from "../../contexts/dashboard-context";
import { NoBudgets } from "../../budgets/components/no-budgets";

export function BudgetTab({ budgets }: { budgets: any }) {
  const { selectedYear, selectedSchoolType } = useContext(DashboardContext);

  const onYearChange = (year: string) => {
    console.log(year);
  };

  return (
    <Card>
      {budgets.length === 0 ? (
        <NoBudgets
          selectedYear={selectedYear}
          onYearChange={onYearChange}
          tab="budget"
        />
      ) : (
        <BudgetTable
          budgets={budgets}
          selectedYear={selectedYear}
          selectedSchoolType={selectedSchoolType}
        />
      )}
    </Card>
  );
}
