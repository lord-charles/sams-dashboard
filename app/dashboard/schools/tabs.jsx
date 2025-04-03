"use client"
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LazyLoader from "@/components/lazy-loader";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import SchoolsTable from "./school-table/schools";
import Enrollment from "./enrollment/enrollment";

const OverviewGraphs = dynamic(() => import("./overview-graphs"), {
    loading: () => <LazyLoader />,
});



const SchoolsTabs = ({ genderData, schools, enrollmentData }) => {
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

    return (
        <Card className="p-4 mt-8 bg-gradient-to-b from-primary/20 to-background">
            <Tabs
                defaultValue={selectedTab}
                className="space-y-4"
                onValueChange={handleTabChange}
            >
                <TabsList className="">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="schools">Schools</TabsTrigger>
                    <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <OverviewGraphs genderData={genderData} />
                </TabsContent>
                <TabsContent value="schools" className="space-y-4">
                    <SchoolsTable schools={schools} />
                </TabsContent>
                <TabsContent value="enrollment" className="space-y-4">
                    <Enrollment schools={enrollmentData} allSchools={schools} />
                </TabsContent>
            </Tabs>
        </Card>
    );
};

export default SchoolsTabs;
