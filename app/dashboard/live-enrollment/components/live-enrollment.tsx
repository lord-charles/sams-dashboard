"use client";

import React, { useState } from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarIcon, PanelsTopLeft, House } from 'lucide-react';
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
import { StatsSection } from "./StatsSection";
import { Spinner } from "@nextui-org/react";

interface LearnerStatsYear {
    total?: number;
    male?: number;
    female?: number;
    withDisability?: number;
}

interface LearnerStatsByGrade {
    [grade: string]: {
        total?: number;
        male?: number;
        female?: number;
        withDisability?: number;
        currentYear?: LearnerStatsYear;
    };
}

interface SchoolData {
    learnerStats?: LearnerStatsByGrade;
}



interface LiveEnrollmentModuleProps {
    initialStates: any[];
    initialStatistics: any;
    enrollmentData: SchoolData[];
}

const LiveEnrollmentModule = ({
    initialStates,
    initialStatistics,
    enrollmentData
}: LiveEnrollmentModuleProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [states] = useState(initialStates);
    const [counties, setCounties] = useState([]);
    const [payams, setPayams] = useState([]);
    const [schools, setSchools] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCounty, setSelectedCounty] = useState("");
    const [selectedPayam, setSelectedPayam] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
    const [enrollmentDataSet, setEnrollmentDataSet] = useState(enrollmentData || []);
    const currentYear = new Date().getFullYear();
    const [date, setDate] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });



    // Helper functions for statistics calculation
    const calculateEnrollmentStats = (enrollmentData: SchoolData[]) => {
        if (!enrollmentData?.length) return null;



        return {

            todaysEnrollment: initialStatistics.todaysEnrollment,
            enrollmentSummary: initialStatistics.enrollmentSummary
        };
    };

    const [statistics, setStatistics] = useState(() => {
        return calculateEnrollmentStats(enrollmentData) || {

            todaysEnrollment: initialStatistics.todaysEnrollment,
            enrollmentSummary: initialStatistics.enrollmentSummary
        };
    });



    const fetchStatistics = async (params: any) => {
        setIsLoading(true);

        try {
            const queryParams = new URLSearchParams();
            if (params.state10) queryParams.append('state', params.state10);
            if (params.county28) queryParams.append('county', params.county28);
            if (params.payam28) queryParams.append('payam', params.payam28);
            if (params.code) queryParams.append('code', params.code);

            const response = await axios.get(`${base_url}school-data/enrollment/completed?${queryParams.toString()}`);
            setEnrollmentDataSet(response.data);
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
        fetchCounties(value);
        fetchStatistics({ state10: value, enrollmentYear: currentYear });
    };

    const handleCountyChange = (value: string) => {
        setSelectedCounty(value);
        setSelectedPayam("");
        setSelectedSchool("");
        setPayams([]);
        setSchools([]);
        fetchPayams(value);
        fetchStatistics({ state10: selectedState, county28: value, enrollmentYear: currentYear });
    };

    const handlePayamChange = (value: string) => {
        setSelectedPayam(value);
        setSelectedSchool("");
        setSchools([]);
        fetchSchools(value);
        fetchStatistics({ state10: selectedState, county28: selectedCounty, payam28: value, enrollmentYear: currentYear });
    };

    const handleSchoolChange = (value: string) => {
        setSelectedSchool(value);
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


    return (
        <div className="p-2 space-b-2 bg-gradient-to-b from-primary/20 to-background">
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <Spinner color="primary" size="lg" />
            </Backdrop>

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
                            <CalendarIcon className="mr-2   h-4 w-4" />
                        )}
                        <h2>{format(Date.now(), "LLL dd, y")}</h2>
                    </Button>

                </div>
            </div>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

            <StatsSection data={enrollmentDataSet} />

            <Tabs defaultValue="tab-1" className="mt-4">
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
                    <StatesDashboard data={statistics.enrollmentSummary} />
                </TabsContent>
            </Tabs>

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

export default LiveEnrollmentModule