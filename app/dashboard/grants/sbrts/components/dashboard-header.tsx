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
const schoolTypes = ["All Schools", "Primary", "Secondary", "Technical"];

export function DashboardHeader() {
  const params = useParams();
  const {
    selectedYear,
    setSelectedYear,
    selectedSchoolType,
    setSelectedSchoolType,
  } = useContext(DashboardContext);
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
        router.push(`/dashboard/grants/sbrts/home/${validYear}`);
      }
    }
  }, [params?.year, selectedYear, setSelectedYear, router]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    router.push(`/dashboard/grants/sbrts/home/${year}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center sm:space-y-0 sm:space-x-4">
      <h1 className="text-2xl font-bold tracking-tight">Capitation Grants</h1>

      <div className="flex ">
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
