"use client";

import React, {  useState } from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, UserCheck, UserMinus, UserPlus, School, CalendarIcon, PanelsTopLeft, House } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from 'lucide-react';
import { Backdrop } from "@mui/material";
import { endOfMonth, format, startOfMonth } from "date-fns";
import TodaysEnrollmentDataDisplay from "./todays-enrollment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import StatesDashboard from "./summary/states-dashboard";
import { LiveEnrollmentBreadcrumb } from "./live-enrollment-breadcrumb";

const LiveEnrollmentModule = ({ initialStates,
    initialStatistics }: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [states, setStates] = useState(initialStates);
    const [counties, setCounties] = useState([]);
    const [payams, setPayams] = useState([]);
    const [schools, setSchools] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCounty, setSelectedCounty] = useState("");
    const [selectedPayam, setSelectedPayam] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
    const currentYear = new Date().getFullYear();
    const [date, setDate] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    
    const [statistics, setStatistics] = useState(() => {
        // Calculate initial gender percentages
        const totalStudents = (initialStatistics?.genderStats?.totalMale || 0) +
            (initialStatistics.genderStats?.totalFemale || 0);
        const initialMalePercentage = totalStudents > 0
            ? Math.round(((initialStatistics.genderStats?.totalMale || 0) / totalStudents) * 100)
            : 0;
        const initialFemalePercentage = totalStudents > 0
            ? Math.round(((initialStatistics.genderStats?.totalFemale || 0) / totalStudents) * 100)
            : 0;

        // Calculate initial disability percentages
        const totalLwd = (initialStatistics.genderStats?.totalMaleLwd || 0) +
            (initialStatistics.genderStats?.totalFemaleLwd || 0);
        const initialMaleLwdPercentage = totalLwd > 0
            ? Math.round(((initialStatistics.genderStats?.totalMaleLwd || 0) / totalLwd) * 100)
            : 0;
        const initialFemaleLwdPercentage = totalLwd > 0
            ? Math.round(((initialStatistics.genderStats?.totalFemaleLwd || 0) / totalLwd) * 100)
            : 0;


        return {
            totalLearners: {
                total: initialStatistics.totalLearners.total || 0,
                current: initialStatistics.totalLearners.current || 0
            },
            promotedLearners: {
                total: initialStatistics.promotedLearners.total || 0,
                current: initialStatistics.promotedLearners.current || 0
            },
            disabledLearners: {
                total: initialStatistics.disabledLearners?.total || 0,
                current: initialStatistics.disabledLearners?.current || 0
            },
            newLearners: {
                total: initialStatistics.newLearners.total || 0,
                current: initialStatistics.newLearners.current || 0
            },
            droppedOutLearners: {
                total: (initialStatistics.genderStats?.droppedOutMale || 0) +
                    (initialStatistics.genderStats?.droppedOutFemale || 0),
                current: (initialStatistics.genderStats?.droppedOutMale || 0) +
                    (initialStatistics.genderStats?.droppedOutFemale || 0)
            },
            averageAge: initialStatistics.averageAge || 0,
            genderStats: {
                malePercentage: initialMalePercentage,
                femalePercentage: initialFemalePercentage,
                totalMale: initialStatistics.genderStats?.totalMale || 0,
                totalFemale: initialStatistics.genderStats?.totalFemale || 0,
                maleLwd: initialStatistics.genderStats?.totalMaleLwd || 0,
                femaleLwd: initialStatistics.genderStats?.totalFemaleLwd || 0,
                totallwd: totalLwd,
                maleLwdPercentage: initialMaleLwdPercentage,
                femaleLwdPercentage: initialFemaleLwdPercentage
            },
            todaysEnrollment:initialStatistics.todaysEnrollment,
            enrollmentSummary:initialStatistics.enrollmentSummary

        };
    }); 



     const fetchStatistics = async (params:any) => {
        setIsLoading(true);
        console.log("Fetching with year:", params.enrollmentYear);

        try {
            const [
                totalLearners,
                promotedLearners,
                disabledLearners,
                newLearners,
                genderStats
            ] = await Promise.all([
                axios.post(`${base_url}data-set/getLearnerCountByLocation`, { ...params, isDroppedOut: false }),
                axios.post(`${base_url}data-set/getPromotedLearnersCountByLocation`, { ...params, enrollmentYear:currentYear }),
                axios.post(`${base_url}data-set/getDisabledLearnersCountByLocation`, params),
                axios.post(`${base_url}data-set/getLearnerCountByLocation`, { ...params, year:currentYear }),
                axios.post(`${base_url}data-set/overallMaleFemaleStat`, params),
            ]);
            // Calculate total students and percentages
            const totalStudents = genderStats.data.totalMale + genderStats.data.totalFemale;
            const malePercentage = totalStudents > 0
                ? Math.round((genderStats.data.totalMale / totalStudents) * 100)
                : 0;
            const femalePercentage = totalStudents > 0
                ? Math.round((genderStats.data.totalFemale / totalStudents) * 100)
                : 0;

            // Calculate percentages for learners with disabilities
            const totalLwd = genderStats.data.maleWithDisabilities + genderStats.data.femaleWithDisabilities;
            const maleLwdPercentage = totalLwd > 0
                ? Math.round((genderStats.data.maleWithDisabilities / totalLwd) * 100)
                : 0;
            const femaleLwdPercentage = totalLwd > 0
                ? Math.round((genderStats.data.femaleWithDisabilities / totalLwd) * 100)
                : 0;

            setStatistics(prev => {
                return {
                    totalLearners: {
                        total: prev.totalLearners.total,
                        current: totalLearners.data.count
                    },
                    promotedLearners: {
                        total: prev.promotedLearners.total,
                        current: promotedLearners.data.count
                    },
                    disabledLearners: {
                        total: prev.genderStats.totallwd,
                        current: genderStats.data.maleWithDisabilities + genderStats.data.femaleWithDisabilities
                    },
                    newLearners: {
                        total: prev.newLearners.total,
                        current: newLearners.data.count
                    },
                    droppedOutLearners: {
                        total: prev.droppedOutLearners.total,
                        current: genderStats.data.droppedOutMale + genderStats.data.droppedOutFemale
                    },
                    averageAge: prev.averageAge,
                    genderStats: {
                        malePercentage,
                        femalePercentage,
                        totalMale: genderStats.data.totalMale || 0,
                        totalFemale: genderStats.data.totalFemale || 0,
                        maleLwd: genderStats.data.maleWithDisabilities || 0,
                        femaleLwd: genderStats.data.femaleWithDisabilities || 0,
                        totallwd: prev.genderStats.totallwd,
                        maleLwdPercentage,
                        femaleLwdPercentage
                    },
                    todaysEnrollment: prev.todaysEnrollment,
                    enrollmentSummary: prev.enrollmentSummary
                };
            });
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
        setIsLoading(false);
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
        fetchStatistics({ state10: value, enrollmentYear: currentYear });
    };

    const handleCountyChange = (value: string) => {
        setSelectedCounty(value);
        setSelectedPayam("");
        setSelectedSchool("");
        setPayams([]);
        setSchools([]);
        setStudents([]);
        fetchPayams(value);
        fetchStatistics({ state10: selectedState, county28: value, enrollmentYear: currentYear });
    };

    const handlePayamChange = (value: string) => {
        setSelectedPayam(value);
        setSelectedSchool("");
        setSchools([]);
        setStudents([]);
        fetchSchools(value);
        fetchStatistics({ state10: selectedState, county28: selectedCounty, payam28: value, enrollmentYear: currentYear });
    };

    const handleSchoolChange = (value: string) => {
        setSelectedSchool(value);
        setStudents([]);
        fetchStudents(value);
        fetchStatistics({ code: value, enrollmentYear: currentYear });
    };

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
            const response = await axios.post(`${base_url}data-set/get/2023_data/county/payam/schools`, { payam28: payam });
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
            const response = await axios.post(`${base_url}data-set/2023_data/get/learnersv2`, { code, enrollmentYear: currentYear });
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 5000);
        }
    };
    return (
        <div className="p-4 space-y-6 bg-gradient-to-b from-primary/20 to-background">
            <div className="flex items-center justify-between">

                <LiveEnrollmentBreadcrumb />

                {/* <DatePickerWithRange /> */}
                <div className="flex items-center space-x-4 py-0">
                 
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[160px] justify-start items-center text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <CalendarIcon className="mr-2 relative top-[1.5px]  h-4 w-4" />
                                )}
                               <h2>{format(Date.now(), "LLL dd, y")}</h2>
                            </Button>
                       
                </div>
            </div>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <ComboboxSelect
                        options={states?.map((state: any) => ({ value: state.state, label: state.state }))}
                        value={selectedState}
                        onChange={handleStateChange}
                        placeholder="Select State"
                    />
                    {selectedState && (
                        <ComboboxSelect
                            options={counties.map((county: any) => ({ value: county?._id, label: county?._id }))}
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
                            options={schools.map((school: any) => ({ value: school.code, label: `${school.school} (${school?.code})` }))}
                            value={selectedSchool}
                            onChange={handleSchoolChange}
                            placeholder="Select School"
                        />
                    )}
                </div>


            </div>


            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    <StatCard
                        title="Total Enrolled Learners"
                        total={statistics.totalLearners.total}
                        current={statistics.totalLearners.current}
                        icon={<Users className="h-8 w-8 text-blue-500" />}
                    />
                    <StatCard
                        title="Promoted Learners"
                        total={statistics.promotedLearners.total}
                        current={statistics.promotedLearners.current}
                        icon={<UserCheck className="h-8 w-8 text-green-500" />}
                    />
                    <StatCard
                        title="Learners with Disabilities"
                        total={statistics.genderStats.totallwd}
                        current={statistics.genderStats?.maleLwd + statistics.genderStats?.femaleLwd}
                        icon={<UserMinus className="h-8 w-8 text-yellow-500" />}
                    />
                    <StatCard
                        title="New Learners"
                        total={statistics.newLearners.total}
                        current={statistics.newLearners.current}
                        icon={<UserPlus className="h-8 w-8 text-purple-500" />}
                    />
                    <StatCard
                        title="Dropped Out"
                        total={statistics.droppedOutLearners.total}
                        current={statistics.droppedOutLearners.current}
                        icon={<School className="h-8 w-8 text-red-500" />}
                    />
                  
                </div>

                <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="mb-3 h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
          <TabsTrigger  
            value="tab-1"
            className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
          >
            <House
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Live Enrollment
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
          >
            <PanelsTopLeft
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
                        Live Enrollment Summary

          </TabsTrigger>
         
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
      <TodaysEnrollmentDataDisplay data={statistics.todaysEnrollment} />

      </TabsContent>
      <TabsContent value="tab-2">
        <StatesDashboard data={statistics.enrollmentSummary}/>
      </TabsContent>
    </Tabs>


            <Backdrop open={isLoading} className="bg-black/50">
                <Button disabled className="bg-white text-blue-600">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                </Button>
            </Backdrop>
        </div>
    )
}

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
                            {options.map((option: any) => (
                                <CommandItem
                                    key={option.value}
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

const StatCard = ({ title, total, current, value, subtext, icon }:any) => (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {total !== undefined && current !== undefined ? (
                <>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {current.toLocaleString()}
                    </div>
                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total: {total.toLocaleString()}
                    </p> */}
                </>
            ) : (
                <>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                    {Array.isArray(subtext) ? (
                        subtext.map((text, index) => (
                            <p key={index} className="text-xs text-gray-500 dark:text-gray-400">
                                {text}
                            </p>
                        ))
                    ) : (
                        subtext && <p className="text-xs text-gray-500 dark:text-gray-400">{subtext}</p>
                    )}
                </>
            )}
        </CardContent>
    </Card>
);
export default LiveEnrollmentModule