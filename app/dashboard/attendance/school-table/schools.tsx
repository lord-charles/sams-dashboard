
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, FilterX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import * as React from "react";
import { format } from "date-fns";
import { Backdrop } from "@mui/material";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export type schoolInterface = {
  payam28: string;
  state10: string;
  county28: string;
  schoolName: string;
  schoolType: string;
  emisId: string;
  code: string;
  attendanceDays?: number;
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

export default function SchoolsTable({
  schools,
  setShowLearners,
  setCode
}: {
  schools: schoolInterface[];
  setShowLearners: (show: boolean) => void;
  setCode: any
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [range, setRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [loading, setLoading] = React.useState(false);
  const [filteredSchools, setFilteredSchools] = React.useState<schoolInterface[]>(schools);

  const fetchSchools = async (params: any) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axios.post(`${base_url}attendance/allSchools?${query}`);
      setFilteredSchools(res.data.data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch schools.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (date) {
      fetchSchools({ date: format(date, "yyyy-MM-dd") });
    } else if (range.from && range.to) {
      fetchSchools({ from: format(range.from, "yyyy-MM-dd"), to: format(range.to, "yyyy-MM-dd") });
    } else {
      setFilteredSchools(schools);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, range.from, range.to, schools]);

  const resetFilters = () => {
    setDate(undefined);
    setRange({ from: undefined, to: undefined });
    setFilteredSchools(schools);
  };

  const isFiltered = !!date || !!(range.from && range.to);

  return (
    <div className="shadow-md border-t-4 border-t-primary p-2 rounded-md">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Spinner color="primary" size="lg" />
      </Backdrop>

      <div className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Schools Directory</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Manage and view all registered schools in the system
            </CardDescription>
          </div>

          <Button
            className="bg-primary hover:bg-primary/90 text-white font-semibold self-start sm:self-center transition-all"
            onClick={() => {
              status === "authenticated" &&
                session?.user?.userType === "SuperAdmin"
                ? router.push("/dashboard/schools/new")
                : toast({
                  title: "Access Denied",
                  description: "You do not have permission to add a new school",
                  variant: "destructive",
                });
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New School
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="bg-muted/50 rounded-lg">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[220px] justify-start text-left font-normal",
                      date && "border-primary/50 bg-primary/5"
                    )}
                    disabled={!!range.from || !!range.to}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select specific date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0 w-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={d => {
                      setDate(d);
                      setRange({ from: undefined, to: undefined });
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[260px] justify-start text-left font-normal",
                      range.from && range.to && "border-primary/50 bg-primary/5"
                    )}
                    disabled={!!date}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {range.from && range.to
                      ? `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`
                      : <span>Select date range</span>
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0 w-auto">
                  <Calendar
                    mode="range"
                    selected={range}
                    onSelect={r => {
                      setRange(r as any);
                      setDate(undefined);
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {isFiltered && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="self-end"
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              )}
            </div>

            <div className="ml-auto flex items-center">
              <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-xs">Count (Attendance days count)</span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-md border p-1">
          <DataTable
            data={Array.isArray(filteredSchools) ? filteredSchools : []}
            columns={columns}
            setShowLearners={setShowLearners}
            setCode={setCode}
          />
        </div>

        {filteredSchools.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-muted-foreground mb-2">No schools found matching your criteria</p>
            {isFiltered && (
              <Button variant="outline" onClick={resetFilters} size="sm">
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
