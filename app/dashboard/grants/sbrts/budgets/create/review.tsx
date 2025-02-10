"use client";

import { useBudgetStore } from "@/app/store/budget-store";
import { useMetaStore } from "@/app/store/meta-store";
import { useRevenueStore } from "@/app/store/revenue-store";
import { useState } from "react";
import {
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Users2,
  UserCircle,
  Building2,
  Building,
  Trees,
  ClipboardCheck,
  FileText,
  Receipt,
  Wallet,
  XCircle,
  School,
  GraduationCap,
  Users,
  TrendingUp,
  Folder,
  PieChart,
  FolderOpen,
  Calendar,
  Banknote,
  Text,
  ClipboardList,
  User,
  UserCheck,
  CurrencyIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SubmitBudgetDialog } from "../components/submit-budget-dialog";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const USD_TO_SSP_RATE = 130.26;

const convertUSDtoSSP = (usdAmount: number) => {
  return usdAmount * USD_TO_SSP_RATE;
};

const ExchangeRateInfo = () => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
    <CurrencyIcon className="h-4 w-4" />
    <span>Exchange Rate: 1 USD = {USD_TO_SSP_RATE.toFixed(2)} SSP</span>
  </div>
);

export default function ReviewTab({ schoolInfo }: { schoolInfo: any }) {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const { groups: budget } = useBudgetStore();
  const { groups: revenue } = useRevenueStore();
  const { meta } = useMetaStore();
  const [activeTab, setActiveTab] = useState("meta");
  const [hasReviewed, setHasReviewed] = useState({
    meta: false,
    revenue: false,
    budget: false,
  });

  const allSectionsReviewed = Object.values(hasReviewed).every(Boolean);
  const reviewProgress =
    (Object.values(hasReviewed).filter(Boolean).length / 3) * 100;

  const calculateTotalRevenue = () => {
    return revenue.reduce((total, group) => {
      const groupTotal = group.categories.reduce((catTotal, category) => {
        const categoryTotal = category.items.reduce((itemTotal, item) => {
          if (group.groupName === "CAPEX") {
            return itemTotal + convertUSDtoSSP(item.amount);
          }
          return itemTotal + item.amount;
        }, 0);
        return catTotal + categoryTotal;
      }, 0);
      return total + groupTotal;
    }, 0);
  };

  const calculateTotalBudget = () => {
    return parseFloat(
      budget
        .reduce((total, group) => {
          const groupTotal = group.categories.reduce((catTotal, category) => {
            const categoryTotal = category.items.reduce((itemTotal, item) => {
              const itemCost = item.neededItems.reduce((sum, neededItem) => {
                if (group.groupName === "CAPEX") {
                  return sum + convertUSDtoSSP(neededItem.totalCost);
                }
                return sum + neededItem.totalCost;
              }, 0);
              return itemTotal + itemCost;
            }, 0);
            return catTotal + categoryTotal;
          }, 0);
          return total + groupTotal;
        }, 0)
        .toFixed(2)
    );
  };

  const handleNext = () => {
    if (activeTab === "meta") setActiveTab("revenue");
    else if (activeTab === "revenue") setActiveTab("budget");
  };

  const handlePrevious = () => {
    if (activeTab === "budget") setActiveTab("revenue");
    else if (activeTab === "revenue") setActiveTab("meta");
  };

  const budgetData = {
    totalBudget: calculateTotalBudget(),
    totalRevenue: calculateTotalRevenue(),
    currency: "SSP",
    exchangeRate: USD_TO_SSP_RATE,
  };

  const transformRevenueDataToSchema = (revenueData: any) => {
    return revenueData.flatMap((group: any) =>
      group.categories.flatMap((category: any) =>
        category.items.map((item: any) => ({
          type: group.groupName || "",
          category: category.categoryName || "",
          description: item.description || "",
          amount: item.amount || 0,
          sourceCode: item.budgetCode || "",
          group: group.groupName || "",
        }))
      )
    );
  };

  function parseSchoolData({ meta, budget, revenues, schoolInfo }: any) {
    const metaSummary = {
      classLevels: meta?.classLevels || [],
      latestAttendance: meta?.latestAttendance || 0,
      learners: {
        estimatedFemale: meta?.learners?.estimatedFemale || 0,
        estimatedMale: meta?.learners?.estimatedMale || 0,
        estimatedFemaleDisabled: meta?.learners?.estimatedFemaleDisabled || 0,
        estimatedMaleDisabled: meta?.learners?.estimatedMaleDisabled || 0,
      },
      teachers: {
        estimatedFemale: meta?.teachers?.estimatedFemale || 0,
        estimatedMale: meta?.teachers?.estimatedMale || 0,
        estimatedFemaleDisabled: meta?.teachers?.estimatedFemaleDisabled || 0,
        estimatedMaleDisabled: meta?.teachers?.estimatedMaleDisabled || 0,
      },
      classrooms: {
        permanent: meta?.classrooms?.permanent || 0,
        temporary: meta?.classrooms?.temporary || 0,
        openAir: meta?.classrooms?.openAir || 0,
      },
      governance: {
        SGB: meta?.governance?.SGB || false,
        SDP: meta?.governance?.SDP || false,
        budgetSubmitted: meta?.governance?.budgetSubmitted || false,
        bankAccount: meta?.governance?.bankAccount || false,
      },
      subCommitteeResponsible: {
        subCommitteeName: meta?.budget?.committee?.name || "",
        chairperson: meta?.budget?.committee?.chairperson || "",
        responsibilities: meta?.budget?.committee?.responsibilities || "",
      },
      impact: meta?.budget?.impact || "",
      preparation: {
        preparedBy: meta?.budget?.preparation?.preparedBy || "",
        preparationDate: meta?.budget?.preparation?.preparationDate || "",
        submittedBy: meta?.budget?.preparation?.submittedBy || "",
      },
    };

    const budgetSummary = {
      submittedAmount: calculateTotalBudget(),
      groups: budget?.map((group: any) => ({
        group: group.groupName,
        categories: group.categories.map((category: any) => ({
          categoryName: category.categoryName,
          categoryCode: category.categoryCode,
          items: category.items.map((item: any) => ({
            budgetCode: item.budgetCode,
            description: item.description,
            neededItems: item.neededItems.map(
              (neededItem: any) => neededItem.name
            ),
            units: item.neededItems.reduce(
              (sum: any, ni: any) => sum + ni.quantity,
              0
            ),
            unitCostSSP:
              item.neededItems.length > 0 ? item.neededItems[0].unitCost : 0,
            totalCostSSP: item.neededItems.reduce(
              (sum: any, ni: any) => sum + ni.totalCost,
              0
            ),
            fundingSource: item.fundingSource,
            monthActivityToBeCompleted: item.monthActivityToBeCompleted,
          })),
        })),
      })),
    };

    const revenuesSummary = transformRevenueDataToSchema(revenue || []);
    const schoolSummary = {
      code: schoolInfo?.code || "",
      year: new Date().getFullYear(),
      ownership: schoolInfo?.schoolOwnerShip || "",
      schoolType: schoolInfo?.schoolType || "",
      school: schoolInfo?.schoolName || "",
      state10: schoolInfo?.state10 || "",
      county28: schoolInfo?.county28 || "",
      payam28: schoolInfo?.payam28 || "",
    };

    return {
      ...schoolSummary,
      meta: metaSummary,
      budget: budgetSummary,
      revenues: revenuesSummary,
    };
  }

  const submitData = parseSchoolData({
    meta,
    budget,
    revenue,
    schoolInfo,
  });

  const searchParams = useSearchParams();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const nextYear = new Date().getFullYear() + 1;
      const budgetId = localStorage.getItem("budgetId");
      const isCreating = searchParams?.get("edit") === null;

      if (isCreating) {
        // Check if budget exists when creating new budget
        try {
          const existingBudget = await axios.get(
            `${base_url}budget/code/${schoolInfo?.code}/${nextYear}`
          );

          if (existingBudget.data) {
            toast({
              variant: "destructive",
              duration: 6000,
              title: "Budget already exists",
              description: `A budget for ${nextYear} has already been submitted for this school. Please update the existing budget instead.`,
            });
            return;
          }
        } catch (error: any) {
          console.error("Error checking budget status:", error?.response?.data);
          // Only proceed if error is 404 (budget doesn't exist)
          if (error?.response?.status !== 404) {
            toast({
              variant: "destructive",
              duration: 5000,
              title: "Error checking budget status",
              description: "Please try again later.",
            });
            return;
          }
        }

        // Create new budget if it doesn't exist
        try {
          const res = await axios.post(`${base_url}budget`, submitData);
          console.log("Budget created:", res.data);
          toast({
            variant: "default",
            duration: 5000,
            title: "Success",
            description: "Budget created successfully.",
          });
        } catch (error) {
          throw error; // Let the outer catch block handle this
        }
      } else {
        // Update existing budget
        try {
          const res = await axios.patch(
            `${base_url}budget/${budgetId}`,
            submitData
          );
          console.log("Budget updated:", res.data);
          toast({
            variant: "default",
            duration: 5000,
            title: "Success",
            description: "Budget updated successfully.",
          });
        } catch (error) {
          throw error; // Let the outer catch block handle this
        }
      }
    } catch (error: any) {
      console.error("Error submitting budget:", error?.response?.data);
      toast({
        variant: "destructive",
        duration: 5000,
        title: "Error",
        description:
          "Failed to save budget. Please try again or select the school again from the budget list.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold tracking-tight ">
              Budget Review
            </h2>
            <p className="text-lg text-muted-foreground">
              Review and confirm your budget details
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-[200px] space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span className="text-violet-600">
                  {Math.round(reviewProgress)}%
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={reviewProgress}
                  className="h-2 bg-violet-100"
                />
                <div
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${reviewProgress}%` }}
                />
              </div>
            </div>

            <SubmitBudgetDialog
              budgetData={budgetData}
              allSectionsReviewed={allSectionsReviewed}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList className="inline-flex h-auto p-1.5 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 shadow-lg">
            {[
              { value: "meta", label: "Meta", icon: FileText },
              { value: "revenue", label: "Revenue", icon: Banknote },
              { value: "budget", label: "Budget", icon: Wallet },
            ].map((tab, index) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-sm hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <div className="relative">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-200 dark:bg-violet-700 text-violet-700 dark:text-violet-200 text-xs font-bold">
                    {index + 1}
                  </div>
                  {hasReviewed[tab.value as keyof typeof hasReviewed] && (
                    <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white dark:bg-gray-800 rounded-full" />
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold uppercase tracking-wide">
                    Step {index + 1}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <div>
            <div className="hidden lg:block">
              {!allSectionsReviewed && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please review all sections before submitting the budget
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <ExchangeRateInfo />
          </div>
        </div>

        <TabsContent value="meta" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <School className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold">
                      School Information
                    </h3>
                  </div>
                  <div className="space-y-6 ">
                    <div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm text-muted-foreground">
                          Class Levels
                        </h4>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {meta?.classLevels?.map((level) => (
                          <Badge
                            key={level}
                            variant="secondary"
                            className="text-sm"
                          >
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm text-muted-foreground">
                          Enrollment & Attendance
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2s">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                          <div className="relative p-4 rounded-lg border bg-card">
                            <p className="text-3xl font-bold tracking-tight">
                              {(meta?.learners?.estimatedFemale || 0) +
                                (meta?.learners?.estimatedMale || 0) +
                                (meta?.learners?.estimatedFemaleDisabled || 0) +
                                (meta?.learners?.estimatedMaleDisabled || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Estimated Enrollment
                            </p>
                          </div>
                        </div>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900 dark:to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                          <div className="relative p-4 rounded-lg border bg-card">
                            <p className="text-3xl font-bold tracking-tight">
                              {meta?.latestAttendance}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Latest Attendance
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 my-2">
                      <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />

                      <h4 className="font-medium text-sm text-muted-foreground">
                        Classrooms
                      </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        <div className="relative p-4 rounded-lg border bg-card text-center">
                          <Building className="h-5 w-5 text-green-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">
                            {meta?.classrooms?.permanent}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Permanent
                          </p>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900 dark:to-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        <div className="relative p-4 rounded-lg border bg-card text-center">
                          <Building className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">
                            {meta?.classrooms?.temporary}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Temporary
                          </p>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        <div className="relative p-4 rounded-lg border bg-card text-center">
                          <Trees className="h-5 w-5 text-orange-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">
                            {meta?.classrooms?.openAir}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Open Air
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardContent className="p-0">
                <div className=" p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-semibold">Teachers</h3>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Regular Teachers
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                          <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-pink-500" />
                            <span>Female</span>
                          </div>
                          <span className="font-semibold">
                            {meta?.teachers?.estimatedFemale}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                          <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-blue-500" />
                            <span>Male</span>
                          </div>
                          <span className="font-semibold">
                            {meta?.teachers?.estimatedMale}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Teachers with Disabilities
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                          <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-pink-500" />
                            <span>Female</span>
                          </div>
                          <span className="font-semibold">
                            {meta?.teachers?.estimatedFemaleDisabled}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                          <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-blue-500" />
                            <span>Male</span>
                          </div>
                          <span className="font-semibold">
                            {meta?.teachers?.estimatedMaleDisabled}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardContent className="p-0">
                <div className=" p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-semibold">Learners</h3>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Regular Learners
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                          <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-pink-500" />
                            <span>Female</span>
                          </div>
                          <span className="font-semibold">
                            {meta?.learners?.estimatedFemale}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                          <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-blue-500" />
                            <span>Male</span>
                          </div>
                          <span className="font-semibold">
                            {meta?.learners?.estimatedMale}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Learners with Disabilities
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                          <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-pink-500" />
                            <span>Female</span>
                          </div>
                          <span className="font-semibold">
                            {meta?.learners?.estimatedFemaleDisabled}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                          <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-blue-500" />
                            <span>Male</span>
                          </div>
                          <span className="font-semibold">
                            {meta?.learners?.estimatedMaleDisabled}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardContent className="p-0">
                <div className=" p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-lg font-semibold">Governance</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Text className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-sm font-semibold">Summary</h3>
                  </div>
                  <div className="space-y-5">
                    {Object.entries(meta.governance).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg bg-card border group hover:border-orange-200 dark:hover:border-orange-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {key === "SGB" && (
                            <Users2 className="h-4 w-4 text-orange-500" />
                          )}
                          {key === "SDP" && (
                            <FileText className="h-4 w-4 text-orange-500" />
                          )}
                          {key === "budgetSubmitted" && (
                            <Receipt className="h-4 w-4 text-orange-500" />
                          )}
                          {key === "bankAccount" && (
                            <Wallet className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            value ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {value ? (
                            <>
                              <span className="text-sm font-medium">Yes</span>
                              <CheckCircle2 className="h-5 w-5" />
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-medium">No</span>
                              <XCircle className="h-5 w-5" />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold">Budget Details</h3>
                </div>
                <div className="grid gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Budget Impact
                    </h4>
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm leading-relaxed">
                        {meta?.budget?.impact || "No impact statement provided"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Responsible Committee
                    </h4>
                    <div className="grid gap-2 grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                        <div className="flex items-center gap-3">
                          <Users2 className="h-5 w-5 text-purple-500" />
                          <span>Committee Name</span>
                        </div>
                        <span className="font-semibold">
                          {meta?.budget?.committee?.name || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-purple-500" />
                          <span>Chairperson</span>
                        </div>
                        <span className="font-semibold">
                          {meta?.budget?.committee?.chairperson ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="p-4 rounded-lg bg-card border">
                        <div className="flex items-center gap-2 mb-2">
                          <ClipboardList className="h-5 w-5 text-purple-500" />
                          <h5 className="text-sm font-medium">
                            Responsibilities
                          </h5>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {meta?.budget?.committee?.responsibilities ||
                            "No responsibilities specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Preparation Details
                    </h4>
                    <div className="grid gap-2 grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-purple-500" />
                          <span>Prepared By</span>
                        </div>
                        <span className="font-semibold">
                          {meta?.budget?.preparation?.preparedBy ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-purple-500" />
                          <span>Preparation Date</span>
                        </div>
                        <span className="font-semibold">
                          {meta?.budget?.preparation?.preparationDate ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                        <div className="flex items-center gap-3">
                          <UserCheck className="h-5 w-5 text-purple-500" />
                          <span>Submitted By</span>
                        </div>
                        <span className="font-semibold">
                          {meta?.budget?.preparation?.submittedBy ||
                            "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Checkbox
                  id="meta-review"
                  checked={hasReviewed.meta}
                  onCheckedChange={(checked) =>
                    setHasReviewed((prev) => ({
                      ...prev,
                      meta: checked === true,
                    }))
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="meta-review"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Confirm Meta Information Review
                  </label>
                  <p className="text-sm text-muted-foreground">
                    I have reviewed all school information and confirm it is
                    accurate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className=" p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xl font-semibold">Revenue Summary</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">
                          Total Revenue (in SSP)
                        </p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          SSP {calculateTotalRevenue().toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-emerald-500" />
                    </div>
                    {/* <ExchangeRateInfo /> */}
                  </div>
                </div>

                <div className="space-y-8">
                  {revenue.map((group) => (
                    <div
                      key={group.id}
                      className="bg-card rounded-xl border shadow-sm"
                    >
                      <div className="p-4 border-b bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Folder className="h-5 w-5 text-muted-foreground" />
                          <h4 className="font-medium">{group.groupName}</h4>
                        </div>
                      </div>
                      <div className="divide-y">
                        {group.categories.map((category) => (
                          <div key={category.id} className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="font-normal"
                                >
                                  {category.categoryCode}
                                </Badge>
                                <h5 className="font-medium">
                                  {category.categoryName}
                                </h5>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                                  Category Total:
                                </p>
                                <p className="font-semibold">
                                  {group.groupName === "CAPEX" ? (
                                    <>
                                      USD{" "}
                                      {category.items
                                        .reduce(
                                          (acc, item) => acc + item.amount,
                                          0
                                        )
                                        .toLocaleString()}
                                      <span className="text-sm text-muted-foreground ml-2">
                                        (SSP{" "}
                                        {convertUSDtoSSP(
                                          category.items.reduce(
                                            (acc, item) => acc + item.amount,
                                            0
                                          )
                                        ).toLocaleString()}
                                        )
                                      </span>
                                    </>
                                  ) : (
                                    `SSP ${category.items
                                      .reduce(
                                        (acc, item) => acc + item.amount,
                                        0
                                      )
                                      .toLocaleString()}`
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="relative overflow-hidden rounded-lg border bg-background">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-muted/50">
                                    <TableHead className="w-[50%]">
                                      Description
                                    </TableHead>
                                    <TableHead>Budget Code</TableHead>
                                    <TableHead className="text-right">
                                      Amount
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {category?.items?.map((item) => (
                                    <TableRow
                                      key={item.id}
                                      className="hover:bg-muted/50 transition-colors"
                                    >
                                      <TableCell className="font-medium">
                                        {item?.description}
                                      </TableCell>

                                      <TableCell>
                                        <Badge
                                          variant="outline"
                                          className="font-normal"
                                        >
                                          {item?.budgetCode}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <Banknote className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                          <span className="font-semibold tabular-nums">
                                            {group.groupName === "CAPEX" ? (
                                              <>
                                                USD{" "}
                                                {item?.amount?.toLocaleString()}
                                                <span className="text-sm text-muted-foreground ml-2">
                                                  (SSP{" "}
                                                  {convertUSDtoSSP(
                                                    item?.amount || 0
                                                  ).toLocaleString()}
                                                  )
                                                </span>
                                              </>
                                            ) : (
                                              `SSP ${item?.amount?.toLocaleString()}`
                                            )}
                                          </span>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow className="bg-muted/50">
                                    <TableCell
                                      colSpan={3}
                                      className="text-right font-medium"
                                    >
                                      Category Total
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                                      {group.groupName === "CAPEX" ? (
                                        <>
                                          USD{" "}
                                          {category.items
                                            .reduce(
                                              (acc, item) => acc + item.amount,
                                              0
                                            )
                                            .toLocaleString()}
                                          <span className="text-sm text-muted-foreground ml-2">
                                            (SSP{" "}
                                            {convertUSDtoSSP(
                                              category.items.reduce(
                                                (acc, item) =>
                                                  acc + item.amount,
                                                0
                                              )
                                            ).toLocaleString()}
                                            )
                                          </span>
                                        </>
                                      ) : (
                                        `SSP ${category.items
                                          .reduce(
                                            (acc, item) => acc + item.amount,
                                            0
                                          )
                                          .toLocaleString()}`
                                      )}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className=" p-6">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="revenue-review"
                    checked={hasReviewed.revenue}
                    onCheckedChange={(checked) =>
                      setHasReviewed((prev) => ({
                        ...prev,
                        revenue: checked === true,
                      }))
                    }
                    className="peer"
                  />
                  <CheckCircle2 className="absolute -top-2 -right-2 h-4 w-4 text-emerald-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="revenue-review"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Confirm Revenue Information Review
                    </label>
                    <p className="text-sm text-muted-foreground">
                      I have reviewed all revenue details and confirm they are
                      accurate
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className=" p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary dark:text-violet-400" />
                    <h3 className="text-xl font-semibold">Budget Summary</h3>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border">
                    <div className="flex flex-col">
                      <p className="text-sm text-muted-foreground">
                        Total Budget
                      </p>
                      <p className="text-2xl font-bold text-primary dark:text-violet-400">
                        {budget[0]?.groupName === "CAPEX" ? "USD" : "SSP"}{" "}
                        {calculateTotalBudget().toLocaleString()}
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="space-y-8">
                  {budget?.map((group) => (
                    <div
                      key={group.id}
                      className="bg-card rounded-xl border shadow-sm"
                    >
                      <div className="p-4 border-b bg-muted/50">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-5 w-5 text-muted-foreground" />
                          <h4 className="font-medium">{group?.groupName}</h4>
                        </div>
                      </div>
                      <div className="divide-y">
                        {group?.categories?.map((category) => (
                          <div key={category?.id} className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="font-normal"
                                >
                                  {category?.categoryCode}
                                </Badge>
                                <h5 className="font-medium">
                                  {category?.categoryName}
                                </h5>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                                  Category Total:
                                </p>
                                <p className="font-semibold">
                                  {group.groupName === "CAPEX" ? (
                                    <>
                                      USD{" "}
                                      {category.items
                                        .reduce(
                                          (acc, item) =>
                                            acc +
                                            item.neededItems.reduce(
                                              (sum, neededItem) =>
                                                sum + neededItem.totalCost,
                                              0
                                            ),
                                          0
                                        )
                                        .toLocaleString()}
                                      <span className="text-sm text-muted-foreground ml-2">
                                        (SSP{" "}
                                        {convertUSDtoSSP(
                                          category.items.reduce(
                                            (acc, item) =>
                                              acc +
                                              item.neededItems.reduce(
                                                (sum, neededItem) =>
                                                  sum + neededItem.totalCost,
                                                0
                                              ),
                                            0
                                          )
                                        ).toLocaleString()}
                                        )
                                      </span>
                                    </>
                                  ) : (
                                    `SSP ${category.items
                                      .reduce(
                                        (acc, item) =>
                                          acc +
                                          item.neededItems.reduce(
                                            (sum, neededItem) =>
                                              sum + neededItem.totalCost,
                                            0
                                          ),
                                        0
                                      )
                                      .toLocaleString()}`
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              {category.items.map((item) => (
                                <Card
                                  key={item?.id}
                                  className="overflow-hidden"
                                >
                                  <CardContent className="p-0">
                                    <div className="bg-muted/30 p-4">
                                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                        <div>
                                          <h6 className="font-medium flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-green-600" />
                                            {item?.description}
                                          </h6>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            Budget Code: {item?.budgetCode}
                                          </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                          <p className="text-sm flex items-center gap-1">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            Due:{" "}
                                            {item?.monthActivityToBeCompleted}
                                          </p>
                                          <p className="text-sm flex items-center gap-1 mt-1">
                                            <Banknote className="h-4 w-4 text-muted-foreground" />
                                            {item?.fundingSource}
                                          </p>
                                        </div>
                                      </div>

                                      {item?.neededItems?.length > 0 && (
                                        <div className="bg-card rounded-lg border overflow-hidden">
                                          <Table>
                                            <TableHeader>
                                              <TableRow className="bg-muted/50 hover:bg-muted/70">
                                                <TableHead>Item</TableHead>
                                                <TableHead className="text-right">
                                                  Unit Cost
                                                </TableHead>
                                                <TableHead className="text-right">
                                                  Quantity
                                                </TableHead>
                                                <TableHead className="text-right">
                                                  Total
                                                </TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {item?.neededItems?.map(
                                                (neededItem, index) => (
                                                  <TableRow
                                                    key={index}
                                                    className="hover:bg-muted/50 transition-colors"
                                                  >
                                                    <TableCell>
                                                      {neededItem?.name}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                      {group.groupName ===
                                                      "CAPEX" ? (
                                                        <>
                                                          USD{" "}
                                                          {neededItem?.unitCost?.toLocaleString()}
                                                          <span className="text-sm text-muted-foreground ml-2">
                                                            (SSP{" "}
                                                            {convertUSDtoSSP(
                                                              neededItem?.unitCost ||
                                                                0
                                                            ).toLocaleString()}
                                                            )
                                                          </span>
                                                        </>
                                                      ) : (
                                                        `SSP ${neededItem?.unitCost?.toLocaleString()}`
                                                      )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                      {neededItem?.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                      {group.groupName ===
                                                      "CAPEX" ? (
                                                        <>
                                                          USD{" "}
                                                          {neededItem?.totalCost?.toLocaleString()}
                                                          <span className="text-sm text-muted-foreground ml-2">
                                                            (SSP{" "}
                                                            {convertUSDtoSSP(
                                                              neededItem?.totalCost ||
                                                                0
                                                            ).toLocaleString()}
                                                            )
                                                          </span>
                                                        </>
                                                      ) : (
                                                        `SSP ${neededItem?.totalCost?.toLocaleString()}`
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )}
                                              <TableRow className="bg-muted/30 hover:bg-muted/50">
                                                <TableCell
                                                  colSpan={3}
                                                  className="font-medium"
                                                >
                                                  Needed Items Total
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-primary dark:text-violet-400">
                                                  {group.groupName === "CAPEX"
                                                    ? "USD"
                                                    : "SSP"}{" "}
                                                  {item?.neededItems
                                                    .reduce(
                                                      (acc, neededItem) =>
                                                        acc +
                                                        neededItem.totalCost,
                                                      0
                                                    )
                                                    .toLocaleString()}
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </Table>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className=" p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Checkbox
                      id="budget-review"
                      checked={hasReviewed.budget}
                      onCheckedChange={(checked) =>
                        setHasReviewed((prev) => ({
                          ...prev,
                          budget: checked === true,
                        }))
                      }
                      className="peer"
                    />
                    <CheckCircle2 className="absolute -top-2 -right-2 h-4 w-4 text-green-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="budget-review"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Confirm Budget Information Review
                    </label>
                    <p className="text-sm text-muted-foreground">
                      I have reviewed all budget details and confirm they are
                      accurate
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={activeTab === "meta"}
        >
          Previous
        </Button>

        {activeTab === "budget" ? (
          <SubmitBudgetDialog
            budgetData={budgetData}
            allSectionsReviewed={allSectionsReviewed}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        ) : (
          <Button
            onClick={activeTab === "budget" ? onSubmit : handleNext}
            disabled={activeTab === "budget" && !allSectionsReviewed}
          >
            {activeTab === "budget" ? "Submit Budget" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
