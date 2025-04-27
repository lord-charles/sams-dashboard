"use client";

import React, { useState } from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { Button } from "@/components/ui/button";
import { CalendarDays } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from 'lucide-react';
import { Backdrop } from "@mui/material";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@nextui-org/react";
import AttendanceStatCards from "./stat-cards";
import { format } from "date-fns";
import AttendanceTabs from "./AttendanceTabs";


const currentYear = new Date().getFullYear();

// Format date to readable format with safety checks
const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A'
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'Invalid Date'
        return format(date, "MMM d, yyyy")
    } catch {
        return 'Invalid Date'
    }
}

const AttendanceModuleClient = ({ initialStates, statsData: initialStatsData, schoolsData, schoolsWithAttendance }: { initialStates: any, statsData: any, schoolsData: any, schoolsWithAttendance: any }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
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
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [statsData, setStatsData] = useState(initialStatsData);

    const startDate = formatDate(statsData?.yearToDate?.dateRange?.start)
    const endDate = formatDate(statsData?.yearToDate?.dateRange?.end)


    // Generate years from 2014 to current year
    const years = Array.from({ length: currentYear - 2014 + 1 }, (_, i) =>
        String(currentYear - i)
    );



    React.useEffect(() => {
        const initializeFromURL = async () => {
            try {
                const urlParams = {
                    state: searchParams.get('state'),
                    county: searchParams.get('county'),
                    payam: searchParams.get('payam'),
                    code: searchParams.get('code')
                };

                // If no URL parameters, exit early
                if (!urlParams.state) return;

                setIsLoading(true);

                // Fetch all required data in parallel
                const [countiesResponse, payamsResponse, schoolsResponse] = await Promise.all([
                    axios.post(`${base_url}data-set/get/2023_data/county`, { state: urlParams.state }),
                    urlParams.county ? axios.post(`${base_url}data-set/get/2023_data/county/payam`, { county28: urlParams.county }) : null,
                    urlParams.payam ? axios.post(`${base_url}data-set/get/2023_data/county/payam/schools`, { payam28: urlParams.payam }) : null
                ]);

                // Update state with fetched data
                setSelectedState(urlParams.state);
                setCounties(countiesResponse.data);

                if (urlParams.county && payamsResponse) {
                    setSelectedCounty(urlParams.county);
                    setPayams(payamsResponse.data);
                }

                if (urlParams.payam && schoolsResponse) {
                    setSelectedPayam(urlParams.payam);
                    setSchools(schoolsResponse.data);
                }

                // Fetch students if school code is present
                if (urlParams.code) {
                    setSelectedSchool(urlParams.code);
                    const studentsResponse = await axios.post(
                        `${base_url}data-set/2023_data/get/learnersv2`,
                        { code: urlParams.code }
                    );
                    setStudents(studentsResponse.data);
                }

                // Fetch statistics based on the most specific parameter available
                const statisticsParams = urlParams.code
                    ? { code: urlParams.code }
                    : urlParams.payam
                        ? { state10: urlParams.state, county28: urlParams.county, payam28: urlParams.payam }
                        : urlParams.county
                            ? { state10: urlParams.state, county28: urlParams.county }
                            : { state10: urlParams.state };

                await fetchStatistics({ ...statisticsParams, enrollmentYear: selectedYear });

            } catch (error) {
                console.error('Error initializing from URL:', error);
                // You might want to add error handling/notification here
            } finally {
                setIsLoading(false);
            }
        };

        initializeFromURL();
    }, []); // Run only once on component mount

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
            const response = await axios.post(`${base_url}data-set/2023_data/get/learnersv2`, { code, enrollmentYear: selectedYear });
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 5000);
        }
    };


    // Fetch statistics based on filters
    const fetchStatistics = async (params: Record<string, any>) => {
        setIsLoading(true);
        try {
            // Build query string from params (always include all keys)
            const queryKeys = ['state', 'county', 'payam', 'year'];
            const query = queryKeys
                .map((key) => `${key}=${encodeURIComponent(params[key] ?? '')}`)
                .join('&');
            const url = `${base_url}attendance/statistics?${query}`;
            const response = await axios.post(url);
            setStatsData(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Refetch stats when filters change
    React.useEffect(() => {
        // Only fetch if a state is selected
        // if (!selectedState) return;
        const params: Record<string, any> = {
            state: selectedState,
            county: selectedCounty,
            payam: selectedPayam,
            year: selectedYear
        };
        fetchStatistics(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedState, selectedCounty, selectedPayam, selectedSchool, selectedYear]);

    const updateURL = (params: Record<string, string | null>) => {
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
            county: null,
            payam: null,
            code: null
        });
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
            payam: null,
            code: null
        });
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
            code: null
        });
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
    };

    const ComboboxSelect = ({ options, value, onChange, placeholder }: { options: { label: string; value: string }[], value: string, onChange: (value: string) => void, placeholder: string }) => {
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
                            ? options.find((option) => option.value === value)?.label
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
                                {options.map((option) => (
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

    return (
        <div className="p-2 bg-gradient-to-b from-primary/20 to-background">
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <Spinner color="primary" size="lg" />
            </Backdrop>
            <div className="flex items-center justify-between">

                <p className="text-muted-foreground">
                    Attendance analytics {startDate !== 'N/A' && `for ${startDate} to ${endDate}`}
                </p>

                <div className="flex flex-wrap gap-4">
                    {/* Year Selector */}
                    <Select
                        value={selectedYear.toString()}
                        onValueChange={(value) => {
                            setSelectedYear(value);
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            options={schools.map((school: any) => ({ value: school.code, label: `${school.school} (${school.code})` }))}
                            value={selectedSchool}
                            onChange={handleSchoolChange}
                            placeholder="Select School"
                        />
                    )}
                </div>

                <AttendanceStatCards statsData={statsData} />
            <AttendanceTabs statsData={statsData} schoolsData={schoolsData} schoolsWithAttendance={schoolsWithAttendance}/>

            </div>

        </div>
    );
};




export default AttendanceModuleClient;
