"use client";
import { createColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export interface AccountabilityInterface {
  code: string;
  academicYear: number;
  state10: string;
  county28: string;
  payam28: string;
  schoolName: string;
  schoolType: string;
  ownership: string;
  totalRevenue: number;
  totalExpenditure: number;
  openingBalance: number;
  closingBalance: number;
  tranches: Array<{
    amountDisbursed: number;
    amountApproved: number;
    paidBy: string;
  }>;
}

export default function AccountabilityTable({
  accountabilities,
  selectedYear,
}: {
  accountabilities: AccountabilityInterface[];
  selectedYear: string;
}) {
  return (
    <Card className="p-4 overflow-auto">
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <div>
          <CardTitle>Accountability Overview - {selectedYear}</CardTitle>
        </div>
        <DataTable
          data={Array.isArray(accountabilities) ? accountabilities : []}
          columns={createColumns(selectedYear)}
          selectedYear={selectedYear}
        />
      </div>
    </Card>
  );
}
