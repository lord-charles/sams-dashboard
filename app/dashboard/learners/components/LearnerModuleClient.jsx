"use client";

import React, { useState } from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserMinus, UserPlus, School, GraduationCap, CalendarDays } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from 'lucide-react';
import LearnersTable from "../learner-table/leaners";
import { LearnerBreadcrumb } from "./learner-breadcrumb";
import { NoLearnersYet } from "./no-learner";
import { Backdrop } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@nextui-org/react";


const currentYear = new Date().getFullYear();

const LearnerModuleClient = ({ initialStates, initialStatistics }) => {
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

    // Generate years from 2014 to current year
    const years = Array.from({ length: currentYear - 2014 + 1 }, (_, i) =>
        String(currentYear - i)
    );

    const [statistics, setStatistics] = useState(() => {
        // Calculate initial gender percentages
        const totalStudents = (initialStatistics.genderStats?.totalMale || 0) +
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
            }
        };
    });


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

                await fetchStatistics(statisticsParams);

            } catch (error) {
                console.error('Error initializing from URL:', error);
                // You might want to add error handling/notification here
            } finally {
                setIsLoading(false);
            }
        };

        initializeFromURL();
    }, []); // Run only once on component mount

    const fetchCounties = async (state) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${base_url}data-set/get/2023_data/county`, { state });
            setCounties(response.data);
        } catch (error) {
            console.error("Error fetching counties:", error);
        }
        setIsLoading(false);
    };

    const fetchPayams = async (county) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${base_url}data-set/get/2023_data/county/payam`, { county28: county });
            setPayams(response.data);
        } catch (error) {
            console.error("Error fetching payams:", error);
        }
        setIsLoading(false);
    };

    const fetchSchools = async (payam) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${base_url}data-set/get/2023_data/county/payam/schools`, { payam28: payam });
            setSchools(response.data);
        } catch (error) {
            console.error("Error fetching schools:", error);
        }
        setIsLoading(false);
    };

    const fetchStudents = async (code) => {
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


    const updateURL = (params) => {
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

    const fetchStatistics = async (params) => {
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
                axios.post(`${base_url}data-set/getPromotedLearnersCountByLocation`, { ...params, enrollmentYear: parseInt(params.enrollmentYear, 10) || new Date().getFullYear() }),
                axios.post(`${base_url}data-set/getDisabledLearnersCountByLocation`, params),
                axios.post(`${base_url}data-set/getLearnerCountByLocation`, { ...params, year: parseInt(params.enrollmentYear, 10) || new Date().getFullYear() }),
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
                    }
                };
            });
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
        setIsLoading(false);
    };

    const handleStateChange = (value) => {
        setSelectedState(value);
        setSelectedCounty("");
        setSelectedPayam("");
        setSelectedSchool("");
        setCounties([]);
        setPayams([]);
        setSchools([]);
        setStudents([]);
        fetchCounties(value);
        fetchStatistics({ state10: value, enrollmentYear: selectedYear });
        updateURL({
            state: value,
            county: null,
            payam: null,
            code: null
        });
    };

    const handleCountyChange = (value) => {
        setSelectedCounty(value);
        setSelectedPayam("");
        setSelectedSchool("");
        setPayams([]);
        setSchools([]);
        setStudents([]);
        fetchPayams(value);
        fetchStatistics({ state10: selectedState, county28: value, enrollmentYear: selectedYear });
        updateURL({
            state: selectedState,
            county: value,
            payam: null,
            code: null
        });
    };

    const handlePayamChange = (value) => {
        setSelectedPayam(value);
        setSelectedSchool("");
        setSchools([]);
        setStudents([]);
        fetchSchools(value);
        fetchStatistics({ state10: selectedState, county28: selectedCounty, payam28: value, enrollmentYear: selectedYear });
        updateURL({
            state: selectedState,
            county: selectedCounty,
            payam: value,
            code: null
        });
    };

    const handleSchoolChange = (value) => {
        setSelectedSchool(value);
        setStudents([]);
        fetchStudents(value);
        fetchStatistics({ code: value, enrollmentYear: selectedYear });
        updateURL({
            state: selectedState,
            county: selectedCounty,
            payam: selectedPayam,
            code: value
        });
    };

    const ComboboxSelect = ({ options, value, onChange, placeholder }) => {
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
        <div className="p-4 space-y-0 bg-gradient-to-b from-primary/20 to-background">
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <Spinner color="primary" size="lg" />
            </Backdrop>
            <div className="flex items-center justify-between">

                <LearnerBreadcrumb />

                <div className="flex flex-wrap gap-4">
                    {/* Year Selector */}
                    <Select
                        value={selectedYear.toString()}
                        onValueChange={(value) => {
                            const selectedValue = parseInt(value);
                            console.log("Selecting year:", selectedValue);
                            setSelectedYear(selectedValue);
                            // Pass the selected value directly to fetchStatistics
                            fetchStatistics({
                                state10: selectedState,
                                county28: selectedCounty,
                                payam28: selectedPayam,
                                code: selectedSchool,
                                enrollmentYear: selectedValue  // Pass the value directly
                            });
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

            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                    <ComboboxSelect
                        options={states.map(state => ({ value: state.state, label: state.state }))}
                        value={selectedState}
                        onChange={handleStateChange}
                        placeholder="Select State"
                    />
                    {selectedState && (
                        <ComboboxSelect
                            options={counties.map(county => ({ value: county._id, label: county._id }))}
                            value={selectedCounty}
                            onChange={handleCountyChange}
                            placeholder="Select County"
                        />
                    )}
                    {selectedCounty && (
                        <ComboboxSelect
                            options={payams.map(payam => ({ value: payam._id, label: payam._id }))}
                            value={selectedPayam}
                            onChange={handlePayamChange}
                            placeholder="Select Payam"
                        />
                    )}
                    {selectedPayam && (
                        <ComboboxSelect
                            options={schools.map(school => ({ value: school.code, label: `${school.school} (${school.code})` }))}
                            value={selectedSchool}
                            onChange={handleSchoolChange}
                            placeholder="Select School"
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Enrolled Learners"
                        total={statistics.totalLearners.total}
                        current={statistics.totalLearners.current}
                        icon={<Users className="h-8 w-8 text-blue-500" />}
                        blurred={schools.length === 0}
                    />
                    <StatCard
                        title="Promoted Learners"
                        total={statistics.promotedLearners.total}
                        current={statistics.promotedLearners.current}
                        icon={<UserCheck className="h-8 w-8 text-green-500" />}
                        blurred={schools.length === 0}
                    />
                    <StatCard
                        title="Learners with Disabilities"
                        total={statistics.genderStats.totallwd}
                        current={statistics.genderStats?.maleLwd + statistics.genderStats?.femaleLwd}
                        icon={<UserMinus className="h-8 w-8 text-yellow-500" />}
                        blurred={schools.length === 0}
                    />
                    <StatCard
                        title="New Learners"
                        total={statistics.newLearners.total}
                        current={statistics.newLearners.current}
                        icon={<UserPlus className="h-8 w-8 text-purple-500" />}
                        blurred={schools.length === 0}
                    />
                    <StatCard
                        title="Dropped Out"
                        total={statistics.droppedOutLearners.total}
                        current={statistics.droppedOutLearners.current}
                        icon={<School className="h-8 w-8 text-red-500" />}
                        blurred={schools.length === 0}
                    />
                    <StatCard title="Average Age" value={`${statistics.averageAge} years`} icon={<GraduationCap className="h-8 w-8 text-indigo-500" />} blurred={schools.length === 0} />
                    <StatCard
                        title="Male Learners"
                        value={`${statistics.genderStats?.malePercentage}%`}
                        subtext={[
                            `Total: ${statistics.genderStats?.totalMale?.toLocaleString()} learners`,
                            `With Disabilities: ${statistics.genderStats?.maleLwdPercentage}% (${statistics.genderStats?.maleLwd?.toLocaleString()})`
                        ]}
                        icon={<Users className="h-8 w-8 text-blue-500" />}
                        blurred={schools.length === 0}
                    />

                    <StatCard
                        title="Female Learners"
                        value={`${statistics.genderStats?.femalePercentage}%`}
                        subtext={[
                            `Total: ${statistics.genderStats?.totalFemale?.toLocaleString()} learners`,
                            `With Disabilities: ${statistics.genderStats?.femaleLwdPercentage}% (${statistics.genderStats?.femaleLwd?.toLocaleString()})`
                        ]}
                        icon={<Users className="h-8 w-8 text-pink-500" />}
                        blurred={schools.length === 0}
                    />
                </div>


                {students.length > 0 ? (

                    <LearnersTable learners={students} />

                ) : (
                    <NoLearnersYet
                        selectedState={selectedState}
                        selectedCounty={selectedCounty}
                        selectedPayam={selectedPayam}
                        selectedSchool={selectedSchool}
                    />
                )}

            </div>


        </div>
    );
};

const StatCard = ({ title, total, current, value, subtext, icon, blurred }) => (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {total !== undefined && current !== undefined ? (
                <>
                    <div className={`text-2xl font-bold text-gray-900 dark:text-white ${blurred ? 'blur-sm opacity-5 select-none' : ''}`}>
                        {current.toLocaleString()}
                    </div>
                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total: {total.toLocaleString()}
                    </p> */}
                </>
            ) : (
                <>
                    <div className={`text-2xl font-bold text-gray-900 dark:text-white ${blurred ? 'blur-sm opacity-5 select-none' : ''}`}>{value}</div>
                    {Array.isArray(subtext) ? (
                        subtext.map((text, index) => (
                            <p key={index} className={`text-xs text-gray-500 dark:text-gray-400 ${blurred ? 'blur-[2px] opacity-5 select-none' : ''}`}>
                                {text}
                            </p>
                        ))
                    ) : (
                        subtext && <p className={`text-xs text-gray-500 dark:text-gray-400 ${blurred ? 'blur-[2px] opacity-5 select-none' : ''}`}>{subtext}</p>
                    )}
                </>
            )}
        </CardContent>
    </Card>
);

export default LearnerModuleClient;