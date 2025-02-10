"use client";
import React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { generateYearOptions } from "@/app/lib/constants";
import { useCallback } from "react";
import { useState } from "react";


const useYearSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const years = generateYearOptions();
  const year = new Date().getFullYear();
  const [activeYear, setActiveYear] = useState(year);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return {
    activeYear,
    render: (
      <div className="flex justify-end items-center mb-5">
        <Select
          color="primary"
          label="Select year"
          placeholder="Select a year"
          defaultSelectedKeys={[year]}
          selectionMode="single"
          className="max-w-xs"
          disallowEmptySelection
          onChange={(e) => {
            setActiveYear(e.target.value);
            router.push(
              pathname + "?" + createQueryString("year", e.target.value)
            );
          }}
        >
          {years.map((year) => (
            <SelectItem key={year.value} value={year.value}>
              {year.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    ),
  };
};

export default useYearSelect;
