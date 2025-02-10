"use client";

import Image from "next/image";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useThemeContext } from "@/lib/themeContext";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export type teacherInterface = {
  active: boolean;
  code: string;
  countryOfOrigin: string;
  county10: string;
  county28: string;
  dateJoined: string;
  dob: string;
  dutyAssigned: { duty: string }[];
  email: string;
  firstAppointment: string;
  firstname: string;
  gender: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isDroppedOut: boolean;
  lastname: string;
  nationalNo: string;
  notes: string;
  payam28: string;
  phoneNumber: string;
  position: string;
  professionalQual: string;
  refugee: string;
  salaryGrade: string;
  school: string;
  source: string;
  state10: string;
  statesAsigned: string[];
  teacherCode: string;
  teacherHrisCode: string;
  teacherUniqueID: string;
  teachersEstNo: string;
  trainingLevel: string;
  userType: string;
  username: string;
  workStatus: string;
  year: string;
};

export default function TeachersTable({
  teachers,
}: {
  teachers: teacherInterface[];
}) {
  const { themeColor } = useThemeContext();

  return (
    <Card className="p-4">
      <div className="hidden flex-1 flex-col space-y-4 md:flex ">
        <div className="flex items-center justify-between space-y-2">
          <div className="space-y-2">
            <CardTitle>Teachers</CardTitle>
            <CardDescription>Here&apos;s a list of teachers.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={{
                pathname: "/dashboard/teachers/new-teacher",
                query: {
                  state: teachers[0]?.state10,
                  payam: teachers[0]?.payam28,
                  county: teachers[0]?.county28,
                  code: teachers[0]?.code,
                  school: teachers[0]?.school,
                },
              }}
            >
              <Button
                className={`${
                  themeColor === "Slate" ||
                  (themeColor === "Default" && "dark:text-black text-white")
                } text-white font-semibold`}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Teacher
              </Button>
            </Link>
          </div>
        </div>
        <DataTable
          data={Array.isArray(teachers) ? teachers : []}
          columns={columns}
        />
      </div>
    </Card>
  );
}
