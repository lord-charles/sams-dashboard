"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, UserCheck, UserMinus, UserPlus, School, GraduationCap } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from 'lucide-react';
import TeachersTable from "../teacher-table/teachers";
import { TeacherBreadcrumb } from "./teacher-breadcrumb";
import { NoTeachersYet } from "./no-teachers";
import { Backdrop } from "@mui/material";
import { useSearchParams } from 'next/navigation';
import { Spinner } from "@nextui-org/react";

const TeacherModuleClient = ({ initialStates, initialStatistics }) => {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [states, setStates] = useState(initialStates);
    const [counties, setCounties] = useState([]);
    const [payams, setPayams] = useState([]);
    const [schools, setSchools] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCounty, setSelectedCounty] = useState("");
    const [selectedPayam, setSelectedPayam] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
    const [statistics, setStatistics] = useState(() => {
        // Calculate initial gender percentages
        const totalTeachers = (initialStatistics.genderStats?.totalMale || 0) +
            (initialStatistics.genderStats?.totalFemale || 0);
        const initialMalePercentage = totalTeachers > 0
            ? Math.round(((initialStatistics.genderStats?.totalMale || 0) / totalTeachers) * 100)
            : 0;
        const initialFemalePercentage = totalTeachers > 0
            ? Math.round(((initialStatistics.genderStats?.totalFemale || 0) / totalTeachers) * 100)
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
            totalTeachers: {
                total: initialStatistics.totalTeachers.total || 0,
                current: initialStatistics.totalTeachers.current || 0
            },
            activeTeachers: {
                total: initialStatistics.activeTeachers.total || 0,
                current: initialStatistics.activeTeachers.current || 0
            },
            inactiveTeachers: {
                total: initialStatistics.inactiveTeachers.total || 0,
                current: initialStatistics.inactiveTeachers.current || 0
            },
            newTeachers: {
                total: initialStatistics.newTeachers.total || 0,
                current: initialStatistics.newTeachers.current || 0
            },
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

    const fetchTeachers = async (code) => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${base_url}user/getTeachersByCode`, { code });
            setTeachers(response.data);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 5000);
        }
    };

    const fetchStatistics = async (params) => {
        setIsLoading(true);
        try {
            const [
                totalTeachers,
                activeTeachers,
                inactiveTeachers,
                newTeachers,
                genderStats
            ] = await Promise.all([
                axios.post(`${base_url}user/getTeacherCountByLocation`, params),
                axios.post(`${base_url}user/getTeacherCountByLocation`, { ...params, active: true }),
                axios.post(`${base_url}user/getTeacherCountByLocation`, { ...params, active: false }),
                axios.post(`${base_url}user/getTeacherCountByLocation`, { ...params, year: new Date().getFullYear() }),
                axios.post(`${base_url}user/overallMaleFemaleStat`, params),
            ]);

            // Calculate total teachers and percentages
            const totalCount = genderStats.data.totalMale + genderStats.data.totalFemale;
            const malePercentage = totalCount > 0
                ? Math.round((genderStats.data.totalMale / totalCount) * 100)
                : 0;
            const femalePercentage = totalCount > 0
                ? Math.round((genderStats.data.totalFemale / totalCount) * 100)
                : 0;

            // Calculate percentages for teachers with disabilities
            const totalLwd = genderStats.data.maleWithDisabilities + genderStats.data.femaleWithDisabilities;
            const maleLwdPercentage = totalLwd > 0
                ? Math.round((genderStats.data.maleWithDisabilities / totalLwd) * 100)
                : 0;
            const femaleLwdPercentage = totalLwd > 0
                ? Math.round((genderStats.data.femaleWithDisabilities / totalLwd) * 100)
                : 0;

            setStatistics(prev => ({
                totalTeachers: {
                    total: prev.totalTeachers.total,
                    current: totalTeachers.data.count
                },
                activeTeachers: {
                    total: prev.activeTeachers.total,
                    current: activeTeachers.data.count
                },
                inactiveTeachers: {
                    total: prev.inactiveTeachers.total,
                    current: inactiveTeachers.data.count
                },
                newTeachers: {
                    total: prev.newTeachers.total,
                    current: newTeachers.data.count
                },
                genderStats: {
                    malePercentage,
                    femalePercentage,
                    totalMale: genderStats.data.totalMale || 0,
                    totalFemale: genderStats.data.totalFemale || 0,
                    maleLwd: genderStats.data.maleWithDisabilities || 0,
                    femaleLwd: genderStats.data.femaleWithDisabilities || 0,
                    totallwd: totalLwd,
                    maleLwdPercentage,
                    femaleLwdPercentage
                }
            }));
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
        setTeachers([]);
        fetchCounties(value);
        fetchStatistics({ state10: value });
    };

    const handleCountyChange = (value) => {
        setSelectedCounty(value);
        setSelectedPayam("");
        setSelectedSchool("");
        setPayams([]);
        setSchools([]);
        setTeachers([]);
        fetchPayams(value);
        fetchStatistics({ state10: selectedState, county28: value });
    };

    const handlePayamChange = (value) => {
        setSelectedPayam(value);
        setSelectedSchool("");
        setSchools([]);
        setTeachers([]);
        fetchSchools(value);
        fetchStatistics({ state10: selectedState, county28: selectedCounty, payam28: value });
    };

    const handleSchoolChange = (value) => {
        setSelectedSchool(value);
        setTeachers([]);
        fetchTeachers(value);
        fetchStatistics({ code: value });
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

    useEffect(() => {
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

                // Fetch teachers if school code is present
                if (urlParams.code) {
                    setSelectedSchool(urlParams.code);
                    const teachersResponse = await axios.post(
                        `${base_url}user/getTeachersByCode`,
                        { code: urlParams.code }
                    );
                    setTeachers(teachersResponse.data);
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

    return (
        <div className="p-4 space-y-6 bg-gradient-to-b from-primary/20 to-background">
             <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Spinner color="primary" size="lg" />
        </Backdrop>
            <TeacherBreadcrumb />

            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                            options={schools.map(school => ({ value: school.code, label: `${school.school} (${school?.code})` }))}
                            value={selectedSchool}
                            onChange={handleSchoolChange}
                            placeholder="Select School"
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Teachers"
                        total={statistics.totalTeachers.total}
                        current={statistics.totalTeachers.current}
                        icon={<Users className="h-8 w-8 text-blue-500" />}
                    />
                    <StatCard
                        title="Active Teachers"
                        total={statistics.activeTeachers.total}
                        current={statistics.activeTeachers.current}
                        icon={<UserCheck className="h-8 w-8 text-green-500" />}
                    />
                    <StatCard
                        title="Inactive Teachers"
                        total={statistics.inactiveTeachers.total}
                        current={statistics.inactiveTeachers.current}
                        icon={<UserMinus className="h-8 w-8 text-yellow-500" />}
                    />
                    <StatCard
                        title="New Teachers"
                        total={statistics.newTeachers.total}
                        current={statistics.newTeachers.current}
                        icon={<UserPlus className="h-8 w-8 text-purple-500" />}
                    />
                    <StatCard
                        title="Teachers with Disabilities"
                        total={statistics.genderStats.totallwd}
                        current={statistics.genderStats.maleLwd + statistics.genderStats.femaleLwd}
                        icon={<UserMinus className="h-8 w-8 text-yellow-500" />}
                    />
                    <StatCard title="Average Age" value={`30 years`} icon={<GraduationCap className="h-8 w-8 text-indigo-500" />} />

                    <StatCard
                        title="Male Teachers"
                        value={`${statistics.genderStats?.malePercentage}%`}
                        subtext={[
                            `Total: ${statistics.genderStats?.totalMale?.toLocaleString()} teachers`,
                            `With Disabilities: ${statistics.genderStats?.maleLwdPercentage}% (${statistics.genderStats?.maleLwd?.toLocaleString()})`
                        ]}
                        icon={<Users className="h-8 w-8 text-blue-500" />}
                    />
                    <StatCard
                        title="Female Teachers"
                        value={`${statistics.genderStats?.femalePercentage}%`}
                        subtext={[
                            `Total: ${statistics.genderStats?.totalFemale?.toLocaleString()} teachers`,
                            `With Disabilities: ${statistics.genderStats?.femaleLwdPercentage}% (${statistics.genderStats?.femaleLwd?.toLocaleString()})`
                        ]}
                        icon={<Users className="h-8 w-8 text-pink-500" />}
                    />
                </div>

                {teachers.length > 0 ? (
                    <TeachersTable teachers={teachers} />
                ) : (
                    <NoTeachersYet
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

const StatCard = ({ title, total, current, value, subtext, icon }) => (
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total: {total.toLocaleString()}
                    </p>
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

export default TeacherModuleClient;