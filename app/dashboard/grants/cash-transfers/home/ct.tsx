'use client'

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelsTopLeft, Box, House, Settings } from "lucide-react";
import CtDashboard from "../components/ct-dashboard";
import OverviewDashboard from "../components/tabs/overview";
import EligibleDashboard from "../components/tabs/eligible";

import { useRouter, useSearchParams } from "next/navigation";
import { DashboardHeader } from "../components/dashboard-header";
import CashTransferCriteriaSettings from "../components/ct-settings";

function CT({
    initialStates,
    initialStatCardData,
    initialUniqueSchools,
    initialOverviewData
}: {
    initialStates: any[];
    initialStatCardData: any;
    initialUniqueSchools: any[];
    initialOverviewData: any;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") || "overview";

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("tab", value);
        router.replace(`?${params.toString()}`);
    };

    return (
        <Tabs value={tabParam} onValueChange={handleTabChange}>
            <ScrollArea>
                <TabsList className="-h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
                    <TabsTrigger
                        value="overview"
                        className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                        <House
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                        Eligibility Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="eligible"
                        className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                        <PanelsTopLeft
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                        Eligible Learners
                    </TabsTrigger>
                    <TabsTrigger
                        value="validated"
                        className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                        <Box
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                        Validated
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                        <Settings
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                        Settings
                    </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="overview">
                <OverviewDashboard data={initialOverviewData} />
            </TabsContent>
            <TabsContent value="eligible">

                <EligibleDashboard
                    data={initialOverviewData}
                    states={initialStates || []}
                />
            </TabsContent>
            <TabsContent value="validated">
                <DashboardHeader />
                <CtDashboard
                    initialStates={initialStates || []}
                    initialStatCardData={initialStatCardData}
                    initialUniqueSchools={initialUniqueSchools || []}
                />
            </TabsContent>
            <TabsContent value="settings">
                <CashTransferCriteriaSettings />
            </TabsContent>
        </Tabs>
    );
}

export { CT };