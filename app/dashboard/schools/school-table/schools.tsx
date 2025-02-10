"use client";

import Image from "next/image";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useThemeContext } from "@/lib/themeContext";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export type schoolInterface = {
  payam28: string;
  state10: string;
  county28: string;
  schoolName: string;
  schoolType: string;
  emisId: string;
  code: string;
};

export type schoolDataInterface = {
  schoolStatus: {
    isOpen: string;
    closeReason: string;
    closedDate: string;
  };
  headTeacher: {
    name: string;
    phoneNumber: number;
  };
  code: string;
  payam28: string;
  state10: string;
  county28: string;
  schoolName: string;
  schoolOwnerShip: string;
  schoolType: string;
  reporter: {
    name: string;
    phoneNumber: number;
  };
  facilities: {
    hasKitchen: boolean;
    hasFoodStorage: boolean;
    hasTextbookStorage: boolean;
    hasCleanWater: boolean;
    hasInternet: boolean;
    hasRecreationalActivities: boolean;
  };
  location: {
    gpsLng: number;
    gpsLat: number;
    distanceToCamp: string;
    gpsElev: number;
  };
  mentoringProgramme: {
    isAvailable: boolean;
  }[];
  feedingProgramme: {
    name: string;
    organizationName: string;
    numberOfMeals: number;
    kindStaff: string;
    isAvailable: boolean;
  }[];
  emisId: string;
  radioCoverage: {
    stations: {
      name: string;
    }[];
    programme: boolean;
    programmeGroup: string;
  };
  cellphoneCoverage: {
    vivacel: boolean;
    mtn: boolean;
    zain: boolean;
    gemtel: boolean;
    digitel: boolean;
    other: boolean;
  };
  operation: {
    boarding: boolean;
    daySchool: boolean;
    dayBoarding: boolean;
    feePaid: boolean;
    feeAmount: number;
  };
  schoolCategory: string;
  calendar: {
    year: number;
  };
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  lastVisited: {
    byWho: string;
    comments: string;
  }[];
  pta: {
    name: string;
    phoneNumber: number;
  };
  updatedAt: {
    $date: string;
  };
};

export default function SchoolsTable({
  schools,
}: {
  schools: schoolInterface[];
}) {
  const { themeColor } = useThemeContext();

  return (
    <Card className="p-4 ">
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div className="space-y-2">
            <CardTitle>Schools</CardTitle>
            <CardDescription>Here&apos;s a list of schools.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className={`${
                themeColor === "Slate" ||
                (themeColor === "Default" && "dark:text-black text-white")
              } text-white font-semibold`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New School
            </Button>
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
