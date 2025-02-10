"use client";
import React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useState } from "react";
import useSWR from "swr";

const useSelectSchool = (activePayam) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const school = searchParams.get("school");
  const [activeSchool, setActiveSchool] = useState(school);
  const pathname = usePathname();
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const fetchData = async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  };
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/data-set/get/2023_data/county/payam/schools?payam=${activePayam}`,
    () =>
      fetchData(
        `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/data-set/get/2023_data/county/payam/schools?payam=${activePayam}`,
        { payam28: activePayam }
      ),
    {
      shouldRetryOnError: false,
    }
  );
  const schools = React.useMemo(() => {
    let filteredRows = data?.map((item) => ({
      label: item?.school,
      value: item?.school,
    }));

    return filteredRows;
  }, [data]);
  return {
    activeSchool,
    render: (
      <Select
        color="primary"
        label="Select school"
        placeholder="Select school"
        defaultSelectedKeys={[]}
        isLoading={isLoading}
        onChange={(e) => {
          setActiveSchool(e.target.value);
          router.push(
            pathname + "?" + createQueryString("school", e.target.value)
          );
        }}
      >
        {schools?.map((school) => (
          <SelectItem key={school.value} value={school.value}>
            {school.label}
          </SelectItem>
        ))}
      </Select>
    ),
  };
};

export default useSelectSchool;
