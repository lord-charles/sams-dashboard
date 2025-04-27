import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
  _id: string;
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { Spinner } from "@nextui-org/react";
import { Backdrop } from "@mui/material";

export default function SchoolsTableWithAttendance({
  schools: initialSchools,
  setShowLearners,
  setCode,
  date,
  setDate
}: {
  schools: schoolInterface[];
  setShowLearners: (show: boolean) => void;
  setCode: any
  date: Date
  setDate: (date: Date) => void
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [schools, setSchools] = useState<schoolInterface[]>(initialSchools || []);
  const [loading, setLoading] = useState(false);


  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);
    setLoading(true);
    try {
      const res = await axios.post(`${base_url}attendance/schoolsWithAttendance`, {
        date: newDate
      });
      setSchools(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not fetch schools for this date",
        variant: "destructive"
      });
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-2">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Spinner color="primary" size="lg" />
      </Backdrop>
      <div className="hidden h-full flex-1 flex-col space-y-4 md:flex">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Schools</CardTitle>
            <CardDescription>Here&apos;s a list of schools with attendance today.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div>
              <input
                type="date"
                value={date ? date.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900 text-sm shadow-sm transition-colors duration-150"
              />

            </div>
            <Button
              className={`text-white font-semibold`}
              onClick={() => {
                status === "authenticated" &&
                  session?.user?.userType === "SuperAdmin"
                  ? router.push("/dashboard/schools/new")
                  : toast({
                    title: "Error",
                    description:
                      "You do not have permission to add a new school",
                    variant: "destructive",
                  });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New School
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="w-full flex justify-center py-10 text-muted-foreground">Loading schools...</div>
        ) : (
          <DataTable
            data={Array.isArray(schools) ? schools : []}
            columns={columns}
            setShowLearners={setShowLearners}
            setCode={setCode}
          />
        )}
      </div>
    </Card>
  );
}
