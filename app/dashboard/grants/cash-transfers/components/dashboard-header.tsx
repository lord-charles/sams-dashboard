"use client";

import React from "react";
import { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardContext } from "../contexts/dashboard-context";
import { useRouter, useParams } from "next/navigation";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2014 + 1 }, (_, i) =>
  String(currentYear - i)
);

export function DashboardHeader() {
  const params = useParams();
  const { selectedYear, setSelectedYear } = useContext(DashboardContext);
  const router = useRouter();

  React.useEffect(() => {
    const yearFromUrl = params?.year as string;
    const validYear =
      yearFromUrl && years.includes(yearFromUrl)
        ? yearFromUrl
        : String(currentYear);
    if (validYear !== selectedYear) {
      setSelectedYear(validYear);
      if (!yearFromUrl) {
        router.push(`/dashboard/grants/cash-transfers/home/${validYear}`);
      }
    }
  }, [params?.year, selectedYear, setSelectedYear, router]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    router.push(`/dashboard/grants/cash-transfers/home/${year}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <h1 className="text-3xl font-bold tracking-tight">Cash Transfers</h1>
      <div className="flex space-x-4">
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
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
  );
}
