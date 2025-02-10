"use client";
import { createColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Card, CardTitle } from "@/components/ui/card";

export interface ApprovalInterface {
  _id: string;
  code: string;
  academicYear: number;
  state10: string;
  county28: string;
  payam28: string;
  schoolName: string;
  schoolType: string;
  ownership: string;
  amountDisbursed: number;
  currency: string;
  approval: {
    approvedBy: string;
    approverName: string;
    approvalDate: string;
    status: string;
    remarks: string | null;
  };
  amountApproved: number;
  name: string;
}

export default function ApprovalsTable({
  approvals,
  selectedYear,
}: {
  approvals: ApprovalInterface[];
  selectedYear: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex-1 flex-col space-y-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <CardTitle>Approvals Overview - {selectedYear}</CardTitle>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable
          data={Array.isArray(approvals) ? approvals : []}
          selectedYear={selectedYear}
          columns={createColumns(selectedYear)}
        />
      </div>
    </Card>
  );
}
