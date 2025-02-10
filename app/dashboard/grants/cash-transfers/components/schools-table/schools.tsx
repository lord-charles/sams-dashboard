"use client";
import { createColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Card, CardTitle } from "@/components/ui/card";
import { SchoolData } from "./types";

export default function SchoolsTable({
  schools,
  year,
}: {
  schools: SchoolData[];
  year: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex-1 flex-col space-y-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <CardTitle>Cash Transfers Schools - {year}</CardTitle>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable
          columns={createColumns(year)}
          data={Array.isArray(schools) ? schools : []}
          selectedYear={year}
        />
      </div>
    </Card>
  );
}
