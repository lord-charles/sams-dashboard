"use client";
import React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useState } from "react";
import useSWR from "swr";

const useSelectPayam = (activeCounty) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payam = searchParams.get("payam");
  const [activePayam, setActivePayam] = useState(payam);
  const pathname = usePathname();
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
    `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/data-set/get/2023_data/county/payam?county=${activeCounty}`,
    () =>
      fetchData(
        `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/data-set/get/2023_data/county/payam?county=${activeCounty}`,
        { county28: activeCounty }
      ),
    {
      shouldRetryOnError: false,
    }
  );
  const payams = React.useMemo(() => {
    let filteredRows = data?.map((item) => ({
      label: item?._id,
      value: item?._id,
    }));

    return filteredRows;
  }, [data]);
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.delete("school");
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return {
    activePayam,
    data,
    isLoading,

    render: (
      <Select
        color="primary"
        label="Select payam"
        placeholder="Select payam"
        defaultSelectedKeys={[]}
        isLoading={isLoading}
        onChange={(e) => {
          setActivePayam(e.target.value);
          router.push(
            pathname + "?" + createQueryString("payam", e.target.value)
          );
        }}
      >
        {payams?.map((payam) => (
          <SelectItem key={payam.value} value={payam.value}>
            {payam.label}
          </SelectItem>
        ))}
      </Select>
    ),
  };
};

export default useSelectPayam;
