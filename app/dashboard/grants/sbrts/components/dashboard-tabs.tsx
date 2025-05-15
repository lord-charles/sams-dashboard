"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetTab } from "./tabs/budget-tab";
import { ApprovalsTab } from "./tabs/approvals-tab";
import { AccountabilityTab } from "./tabs/accountability-tab";
import { EligibilityTab } from "./tabs/eligibility-tab";
import { useRouter, useSearchParams } from "next/navigation";
import { DisbursementsTab } from "./tabs/disbursement";

export function DashboardTabs({ budgets }: { budgets: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab") || "budget";

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
        <TabsTrigger value="budget">Budget</TabsTrigger>
        <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
        <TabsTrigger value="approvals">Approvals</TabsTrigger>
        <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
        <TabsTrigger value="accountability">Accountability</TabsTrigger>
      </TabsList>
      <TabsContent value="budget" className="space-y-4">
        <BudgetTab budgets={budgets} />

      </TabsContent>
      <TabsContent value="eligibility" className="space-y-4">
        <EligibilityTab />
      </TabsContent>
      <TabsContent value="approvals" className="space-y-4">
        <ApprovalsTab />
      </TabsContent>
      <TabsContent value="disbursements" className="space-y-4">
        <DisbursementsTab />
      </TabsContent>
      <TabsContent value="accountability" className="space-y-4">
        <AccountabilityTab />
      </TabsContent>
    </Tabs>
  );
}
