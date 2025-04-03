import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export type EnrollmentStatus = {
  year: number;
  isComplete: boolean;
  completedBy: string;
  comments?: string;
  percentageComplete?: number;
  _id: string;
};

export type School = {
  _id: string;
  code: string;
  payam28: string;
  state10: string;
  county28: string;
  schoolName: string;
  schoolOwnerShip: string;
  schoolType: string;
  emisId: string;
  isEnrollmentComplete: EnrollmentStatus[];
};

export default function SchoolEnrollmentTable({
  schools,
}: {
  schools: School[];
}) {
  return (
    <Card className="p-4 ">
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div className="space-y-2">
            <CardTitle>Enrollment</CardTitle>
            <CardDescription>Manage and view school enrollment status</CardDescription>
          </div>
        </div>
        <DataTable
          data={Array.isArray(schools) ? schools : []}
          columns={columns}
        />
      </div>
    </Card>
  );
}
