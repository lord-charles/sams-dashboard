"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import BudgetDataCollection from "./budget";
import { Toaster } from "@/components/ui/toaster";
import RevenueDataCollection from "./revenue";
import MetaDataCollection from "./meta";
import { useSchoolInfo } from "@/hooks/useSchoolInfo";
import General from "./general";
import Review from "./review";
import { CreateBudgetBreadcrumb } from "./breadcrumb";
import { CreativeCommons, Edit3, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LoadingEditBudget from "./loading-edit-budget";
import { Badge } from "@/components/ui/badge";

type RevenueType = {
  category: string;
  categoryCode: string;
  items: Array<{
    budgetCode: string;
    activityDescription: string;
  }>;
};

type BudgetCodeItem = {
  Expenditure: Array<{
    category: string;
    categoryCode: string;
    items: Array<{
      budgetCode: string;
      activityDescription: string;
    }>;
  }>;
  Revenue: Array<RevenueType>;
};

function CreateBudgetData({
  budgetCodes,
}: {
  budgetCodes: Array<BudgetCodeItem>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams?.get("tab") || "general"
  );
  const { schoolInfo, isLoading } = useSchoolInfo();
  const isEditing = searchParams?.get("edit") === "true";
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (
      tab &&
      ["general", "meta", "revenue", "budget", "review"].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!schoolInfo) {
    return null; // Router redirect is handled in the hook
  }

  if (isEditing) {
    return <LoadingEditBudget />;
  }

  return (
    <div className="space-y-0 p-4 bg-gradient-to-b from-primary/20 to-background">
      <Toaster />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
          <CreateBudgetBreadcrumb
            schoolName={schoolInfo?.schoolName}
            code={schoolInfo?.code}
          />
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                searchParams?.get("edit") === null ? "default" : "secondary"
              }
              className="text-sm font-medium px-2 py-1"
            >
              {searchParams?.get("edit") === null ? (
                <Edit3 className="w-4 h-4 mr-1" />
              ) : (
                <CreativeCommons className="w-4 h-4 mr-1" />
              )}
              {searchParams?.get("edit") === null
                ? "Creating Budget"
                : "Editing Budget"}
            </Badge>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">
                        {schoolInfo?.state10 || "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>State</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="font-semibold">
                        {schoolInfo?.county28 || "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>County</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold">
                        {schoolInfo?.payam28 || "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Payam</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full pt-2"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="meta">Meta</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <General info={schoolInfo} />
        </TabsContent>
        <TabsContent value="meta">
          <ScrollArea className="h-[calc(100vh-14rem)] w-full rounded-md border p-4">
            <MetaDataCollection />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="budget">
          <ScrollArea className="h-[calc(100vh-14rem)] w-full rounded-md border p-4">
            <BudgetDataCollection budgetCodes={budgetCodes} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="revenue">
          <ScrollArea className="h-[calc(100vh-14rem)] w-full rounded-md border p-4">
            <RevenueDataCollection budgetCodes={budgetCodes} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="review">
          <ScrollArea className="h-[calc(100vh-14rem)] w-full rounded-md border p-4">
            <Review schoolInfo={schoolInfo} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CreateBudgetData;
