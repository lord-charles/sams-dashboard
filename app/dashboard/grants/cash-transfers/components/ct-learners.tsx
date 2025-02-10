"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserIcon,
  BanknoteIcon,
  GraduationCapIcon,
  CalendarIcon,
  MapPin,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import LearnersTable, {
  type learnerInterface,
} from "../learners/learner-table/leaners";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CashTransfersBreadcrumb } from "./ctlearners-breadcrumb";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base_url } from "@/app/utils/baseUrl";
import { NoLearners } from "./no-learners";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

interface CtLearnersProps {
  data: learnerInterface[];
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2014 + 1 }, (_, i) =>
  String(currentYear - i)
);

const StatCard = ({ title, value, icon: Icon, isLoading }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

export function CtLearners({ data: initialData }: CtLearnersProps) {
  const params = useParams();

  const urlYear = params?.year ? parseInt(params.year as string) : currentYear;
  const urlTranche = params?.tranche ? parseInt(params.tranche as string) : 1;

  const [selectedYear, setSelectedYear] = useState(String(urlYear));
  const [selectedTranche, setSelectedTranche] = useState(urlTranche);
  const [data, setData] = useState(initialData);
  const [data2, setData2] = useState(initialData);
  console.log(data);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(data[0]?.code);

  const fetchData = async (year: string, tranche: number) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${base_url}ct/get/learners?code=${code}&tranche=${tranche}&year=${year}`
      );
      setData(res.data?.data || []);
    } catch (error: any) {
      console.log("Error fetching learners data:", error);

      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleYearChange = async (year: string) => {
    setSelectedYear(year);
    await fetchData(year, selectedTranche);
  };

  const handleTrancheChange = async (tranche: string) => {
    const trancheNum = parseInt(tranche);
    setSelectedTranche(trancheNum);
    await fetchData(selectedYear, trancheNum);
  };

  const totalLearners = data.length;
  const totalLearnersWithDisability = data.filter(
    (learner) => learner.hasDisability
  ).length;

  const totalApprovedAmount = data.reduce(
    (acc, learner) => acc + (learner.amounts?.approved?.amount || 0),
    0
  );

  const totalPaidAmount = data.reduce(
    (acc, learner) => acc + (learner.amounts?.paid?.amount || 0),
    0
  );

  const averageAttendance =
    data.reduce((acc, learner) => acc + (learner.learner?.attendance || 0), 0) /
    (totalLearners || 1);

  return (
    <div className="space-y-6 p-4 bg-gradient-to-b from-primary/10 to-background">
      <div className="flex justify-between items-center">
        <CashTransfersBreadcrumb
          schoolName={data2[0]?.schoolName}
          code={data2[0]?.code}
          year={parseInt(selectedYear)}
        />
        <div className="flex gap-4 xxs:hidden md:flex">
          <Select
            value={selectedTranche.toString()}
            onValueChange={handleTrancheChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[180px]">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectValue placeholder="Select Tranche" />
              )}
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3].map((tranche) => (
                <SelectItem key={tranche} value={tranche.toString()}>
                  Tranche {tranche}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedYear}
            onValueChange={handleYearChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[180px]">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectValue placeholder="Select Year" />
              )}
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardContent className="p-4 flex justify-between md:flex-col lg:flex-row">
            {isLoading ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              <h1 className="text-4xl font-bold text-primary">
                {data2[0]?.schoolName}
              </h1>
            )}
            <div className="flex flex-wrap gap-2 text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 bg-primary/10 rounded-full px-3 py-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {data2[0]?.state10 || "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>State</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 bg-primary/10 rounded-full px-3 py-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {data2[0]?.county28 || "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>County</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 bg-primary/10 rounded-full px-3 py-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {data2[0]?.payam28 || "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Payam</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 bg-primary/10 rounded-full px-3 py-1">
                      <GraduationCapIcon className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {data2[0]?.schoolType || "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>School Type</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 bg-primary/10 rounded-full px-3 py-1">
                      <UserIcon className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {data2[0]?.schoolOwnership || "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>School Ownership</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 bg-primary/10 rounded-full px-3 py-1">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {selectedYear || "N/A"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Academic Year</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>
      {!data || data.length === 0 ? (
        <NoLearners
          selectedYear={selectedYear}
          selectedTranche={selectedTranche}
          schoolCode={code}
        />
      ) : (
        <div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-4">
            <StatCard
              title="Total Learners"
              value={totalLearners}
              icon={UserIcon}
              isLoading={isLoading}
            />

            <StatCard
              title="Learners With Disability"
              value={totalLearnersWithDisability}
              icon={UserIcon}
              isLoading={isLoading}
            />

            <StatCard
              title="Attendance"
              value={`${averageAttendance.toFixed(1)}%`}
              icon={GraduationCapIcon}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-6 flex flex-col lg:flex-row gap-4">
            <Card className="overflow-hidden lg:w-2/3 md:w-full">
              <CardHeader className="border-b bg-muted/40 px-6">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <BanknoteIcon className="h-5 w-5 text-primary" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 grid grid-cols-2 md:grid-cols-1 gap-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-4">
                  {[
                    {
                      icon: CreditCard,
                      label: "Payment Method",
                      value: data[0]?.approval?.paymentMethod,
                    },
                    {
                      icon: Building2,
                      label: "Bank Name",
                      value: data[0]?.approval?.paymentThroughDetails?.bankName,
                    },
                    {
                      icon: Building2,
                      label: "Contact At Bank",
                      value:
                        data[0]?.approval?.paymentThroughDetails?.contactAtBank,
                    },
                    {
                      icon: Smartphone,
                      label: "Money Provider",
                      value:
                        data[0]?.approval?.paymentThroughDetails
                          ?.mobileMoneyName,
                    },
                    {
                      icon: totalPaidAmount > 0 ? CheckCircle2 : AlertCircle,
                      label: "Payment Status",
                      value:
                        totalPaidAmount > 0
                          ? "Partially/Fully Paid"
                          : "Pending Payment",
                      valueClassName:
                        totalPaidAmount > 0
                          ? "text-green-600"
                          : "text-yellow-600",
                      iconClassName:
                        totalPaidAmount > 0
                          ? "text-green-500"
                          : "text-yellow-500",
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2 flex-1">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <item.icon
                          className={`h-4 w-4 ${item.iconClassName || ""}`}
                        />
                        {item.label}
                      </h4>
                      <p
                        className={`text-lg font-semibold ${
                          item.valueClassName || ""
                        }`}
                      >
                        {item.value || "Not Specified"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 lg:w-1/3 md:w-full">
              {[
                {
                  label: "Total Approved Amount",
                  amount: totalApprovedAmount,
                  currency: data[0]?.amounts.approved.currency,
                },
                {
                  label: "Total Amount Paid",
                  amount: totalPaidAmount,
                  currency: data[0]?.amounts.paid?.currency,
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="flex flex-col justify-between flex-1"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {item.label}
                    </CardTitle>
                    <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {item.amount} {item.currency || "SSP"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="pt-6">
            <LearnersTable learners={data} />
          </div>
        </div>
      )}
    </div>
  );
}
