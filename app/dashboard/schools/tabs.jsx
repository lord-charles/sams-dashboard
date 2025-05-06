"use client"
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SchoolsTable from "./school-table/schools";
import EnrollmentDashboard from "./components/enrollment-dashboard";
import { BarChart3, GraduationCap, School } from "lucide-react";
import EnrollmentStats from "./enrollment/enrollment-stats";

// const OverviewGraphs = dynamic(() => import("./overview-graphs"), {
//     loading: () => <LazyLoader />,
// });



const SchoolsTabs = ({ schools, enrollmentData }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTab = searchParams.get("tab") || "overview";
    const [selectedTab, setSelectedTab] = useState(initialTab);
    const handleTabChange = (value) => {
        setSelectedTab(value);
        const params = new URLSearchParams(window.location.search);
        params.set("tab", value);
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    // Only schools with schoolStatus.isOpen === "open"
    const openSchools = Array.isArray(schools)
        ? schools.filter(
            (school) =>
                school.schoolStatus && school.schoolStatus.isOpen === "open"
        )
        : [];

    return (
        <Card className="p-2 mt-4">
            <Tabs
                defaultValue={selectedTab}
                className="space-y-4"
                onValueChange={handleTabChange}
            >
                <TabsList className="h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
                    <TabsTrigger value="overview" className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
                        <span className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span>Overview</span>
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="schools" className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
                        <span className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            <span>Schools</span>
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="enrollment" className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
                        <span className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Enrollment</span>
                        </span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <EnrollmentDashboard
                        schoolsData={enrollmentData} />
                </TabsContent>
                <TabsContent value="schools" className="space-y-4">
                    <SchoolsTable schools={schools} />
                </TabsContent>
                <TabsContent value="enrollment" className="space-y-4">
                    <EnrollmentStats schoolsData={enrollmentData} allSchools={openSchools} />
                </TabsContent>
            </Tabs>
        </Card>
    );
};

export default SchoolsTabs;
