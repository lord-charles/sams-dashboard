"use client"

import { Book, BookOpen, Check, ChevronsUpDown, GraduationCap, School, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Backdrop } from "@mui/material";
import { Spinner } from "@nextui-org/react";


import { useEffect } from "react";
import { NoLearnersYet } from "../no-learner";
import LearnersTable from "../learner-table/leaners";
import { useToast } from "@/hooks/use-toast";

export default function EligibleDashboard({
  data,
  states
}: {
  data: {
    overall: {
      total: number;
      male: number;
      female: number;
      maleWithDisability: number;
      femaleWithDisability: number;
    };
    byEducation: {
      SEC: {
        total: number;
        male: number;
        female: number;
        maleWithDisability: number;
        femaleWithDisability: number;
      };
      PRI: {
        total: number;
        male: number;
        female: number;
        maleWithDisability: number;
        femaleWithDisability: number;
      };
      ALP: {
        total: number;
        male: number;
        female: number;
        maleWithDisability: number;
        femaleWithDisability: number;
      };
    };
    totalSchools: number;
    states: {
      total: number;
      male: number;
      female: number;
      state: string;
      lwd: number;
      schools: number;
    }[];
  };
  states: { state: string }[];
}) {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState(data);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [counties, setCounties] = useState([]);
  const [payams, setPayams] = useState([]);
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedPayam, setSelectedPayam] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  // Fetch latest dashboard stats based on filters
  const fetchDashboardStats = async (params: { state10?: string; county28?: string; payam28?: string; code?: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${base_url}ct/eligible/learners/stats`, { params });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync dropdowns and dashboard data with URL params on initial load
  useEffect(() => {
    const stateParam = searchParams.get("state") || "";
    const countyParam = searchParams.get("county") || "";
    const payamParam = searchParams.get("payam") || "";
    const codeParam = searchParams.get("code") || "";

    setSelectedState(stateParam);
    setSelectedCounty(countyParam);
    setSelectedPayam(payamParam);
    setSelectedSchool(codeParam);

    if (stateParam) fetchCounties(stateParam);
    if (countyParam) fetchPayams(countyParam);
    if (payamParam) fetchSchools(payamParam);
    if (codeParam) fetchStudents(codeParam);

    fetchDashboardStats({
      state10: stateParam || undefined,
      county28: countyParam || undefined,
      payam28: payamParam || undefined,
      code: codeParam || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const calculatePercentage = (part: number, total: number) => {
    if (!total || isNaN(part) || isNaN(total)) return "0.00";
    let percent = (part / total) * 100;
    if (!isFinite(percent) || percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return percent.toFixed(2);
  }

  const fetchCounties = async (state: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${base_url}data-set/get/2023_data/county`, { state });
      setCounties(response.data);
    } catch (error) {
      console.error("Error fetching counties:", error);
    }
    setIsLoading(false);
  };

  const fetchPayams = async (county: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${base_url}data-set/get/2023_data/county/payam`, { county28: county });
      setPayams(response.data);
    } catch (error) {
      console.error("Error fetching payams:", error);
    }
    setIsLoading(false);
  };

  const fetchSchools = async (payam: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${base_url}ct/eligible/schools?payam28=${payam}`);
      setSchools(response.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
    setIsLoading(false);
  };

  const fetchStudents = async (code: string) => {
    try {
      setIsLoading(true);
      // const response = await axios.post(`${base_url}data-set/get/2023_data/county/payam/schools/students`, { code, isDroppedOut: false });
      const response = await axios.get(`${base_url}ct/eligible/learners?code=${code}`);
      setStudents(response.data);
      console.log(response.data);

    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  };

  const handleSchoolCodeSearch = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${base_url}ct/eligible/learners?code=${code}`);
      setStudents(response.data);
      if (response.data.length < 1) {
        return toast({
          title: "No Eligible Learners Found ",
          description: `No eligible learners found for the given school code (${code}).`,
          variant: "destructive",
        })
      }

      if (response.data && response.data.length > 0) {
        const learner = response.data[0];


        setSelectedState(learner.state10 || "");
        setSelectedCounty(learner.county28 || "");
        setSelectedPayam(learner.payam28 || "");
        setSelectedSchool(learner.code || "");

        fetchCounties(learner.state10 || "");
        fetchPayams(learner.county28 || "");
        fetchSchools(learner.payam28 || "");
        fetchStudents(learner.code || "");
        updateURL({
          state: learner.state10,
          county: learner.county28,
          payam: learner.payam28,
          code: learner.code,
        });
        fetchDashboardStats({
          state10: learner.state10,
          county28: learner.county28,
          payam28: learner.payam28,
          code: learner.code,
        });
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  };


  const updateURL = (params: Record<string, string | undefined>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    // Create the new URL
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCounty("");
    setSelectedPayam("");
    setSelectedSchool("");
    setCounties([]);
    setPayams([]);
    setSchools([]);
    setStudents([]);
    fetchCounties(value);
    updateURL({
      state: value,
      county: undefined,
      payam: undefined,
      code: undefined
    });
    fetchDashboardStats({ state10: value });
  };

  const handleCountyChange = (value: string) => {
    setSelectedCounty(value);
    setSelectedPayam("");
    setSelectedSchool("");
    setPayams([]);
    setSchools([]);
    setStudents([]);
    fetchPayams(value);
    updateURL({
      state: selectedState,
      county: value,
      payam: undefined,
      code: undefined
    });
    fetchDashboardStats({ state10: selectedState, county28: value });
  };

  const handlePayamChange = (value: string) => {
    setSelectedPayam(value);
    setSelectedSchool("");
    setSchools([]);
    setStudents([]);
    fetchSchools(value);
    updateURL({
      state: selectedState,
      county: selectedCounty,
      payam: value,
      code: undefined
    });
    fetchDashboardStats({ state10: selectedState, county28: selectedCounty, payam28: value });
  };

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
    setStudents([]);
    fetchStudents(value);
    updateURL({
      state: selectedState,
      county: selectedCounty,
      payam: selectedPayam,
      code: value
    });
    fetchDashboardStats({ state10: selectedState, county28: selectedCounty, payam28: selectedPayam, code: value });

  };


  const ComboboxSelect = ({ options, value, onChange, placeholder }: any) => {
    const [open, setOpen] = React.useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white dark:bg-gray-800"
          >
            {value
              ? options.find((option: any) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option: any, index: number) => (
                  <CommandItem
                    key={index}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="space-y-2">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Spinner color="primary" size="lg" />
      </Backdrop>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 my-4">
        <ComboboxSelect
          options={states.map((state: any) => ({ value: state.state, label: state.state }))}
          value={selectedState}
          onChange={handleStateChange}
          placeholder="Select State"
        />
        {selectedState && (
          <ComboboxSelect
            options={counties.map((county: any) => ({ value: county._id, label: county._id }))}
            value={selectedCounty}
            onChange={handleCountyChange}
            placeholder="Select County"
          />
        )}
        {selectedCounty && (
          <ComboboxSelect
            options={payams.map((payam: any) => ({ value: payam._id, label: payam._id }))}
            value={selectedPayam}
            onChange={handlePayamChange}
            placeholder="Select Payam"
          />
        )}
        {selectedPayam && (
          <ComboboxSelect
            options={schools.map((school: any) => ({ value: school.code, label: `${school._id} (${school.code})` }))}
            value={selectedSchool}
            onChange={handleSchoolChange}
            placeholder="Select School"
          />
        )}
      </div>
      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 text-blue-600 dark:text-blue-300">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.overall.total)}</div>
            <p className="text-xs text-muted-foreground">Across {formatNumber(dashboardData.totalSchools)} schools</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
            <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-2 text-pink-600 dark:text-pink-300">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculatePercentage(dashboardData?.overall?.female || 0, dashboardData?.overall?.total || 0)}% Female
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(dashboardData?.overall?.female || 0)} female, {formatNumber(dashboardData?.overall?.male || 0)} male
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learners with Disabilities</CardTitle>
            <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2 text-amber-600 dark:text-amber-300">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardData?.overall?.maleWithDisability || 0 + dashboardData?.overall?.femaleWithDisability || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentage(
                dashboardData?.overall?.maleWithDisability || 0 + dashboardData?.overall?.femaleWithDisability || 0,
                dashboardData?.overall?.total || 0,
              )}
              % of total Learners
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schools</CardTitle>
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 text-green-600 dark:text-green-300">
              <School className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData?.totalSchools || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Avg. {formatNumber(Math.round(dashboardData?.overall?.total || 0 / dashboardData?.totalSchools || 0))} Learners per school
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Education Level Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ALP Learners</CardTitle>
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2 text-purple-600 dark:text-purple-300">
              <Book className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData?.byEducation?.ALP?.total || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentage(dashboardData?.byEducation?.ALP?.total || 0, dashboardData?.overall?.total || 0)}% of total Learners
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primary Learners</CardTitle>
            <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2 text-indigo-600 dark:text-indigo-300">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData?.byEducation?.PRI?.total || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentage(dashboardData?.byEducation?.PRI?.total || 0, dashboardData?.overall?.total || 0)}% of total Learners
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secondary Learners</CardTitle>
            <div className="rounded-full bg-teal-100 dark:bg-teal-900 p-2 text-teal-600 dark:text-teal-300">
              <GraduationCap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData?.byEducation?.SEC?.total || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentage(dashboardData?.byEducation?.SEC?.total || 0, dashboardData?.overall?.total || 0)}% of total Learners
            </p>
          </CardContent>
        </Card>
      </div>



      {students.length > 0 ? (

        <LearnersTable
          learners={students}
        />

      ) : (
        <NoLearnersYet
          selectedState={selectedState}
          selectedCounty={selectedCounty}
          selectedPayam={selectedPayam}
          selectedSchool={selectedSchool}
          onSchoolCodeSearch={handleSchoolCodeSearch}
        />
      )}
    </div>
  )
}


