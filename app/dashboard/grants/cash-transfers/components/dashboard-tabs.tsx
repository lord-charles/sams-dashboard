"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import SchoolsTable from "./schools-table/schools";

export function DashboardTabs({
  schools,
  selectedTranche,
  selectedYear,
}: {
  schools: any;
  selectedTranche: string;
  selectedYear: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab") || "schools";
  const handleTabChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    router.push(url.pathname + url.search);
  };

  return (
    <Tabs
      defaultValue={currentTab}
      onValueChange={handleTabChange}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="schools">Schools</TabsTrigger>
        {/* <TabsTrigger value="accountability">Accountability</TabsTrigger> */}
      </TabsList>

      <TabsContent value="schools">
        <SchoolsTable schools={schools} year={selectedYear} />
      </TabsContent>

      {/* <TabsContent value="accountability">
        <Card>
          <CardHeader>
            <CardTitle>Accountability</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Accountability reports and metrics would go here, including:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Funds disbursed vs. accounted for</li>
              <li>Timelines for accountability submissions</li>
              <li>
                Breakdown by payment methods (Bank, Pay Agent, Mobile Money)
              </li>
              <li>List of recent accountability submissions</li>
              <li>Any discrepancies or issues flagged</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent> */}
    </Tabs>
  );
}
