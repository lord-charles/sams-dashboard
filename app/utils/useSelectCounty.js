"use client";
import React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useState } from "react";
import useSWR from "swr";
import { base_url } from "./baseUrl";

const useSelectCounty = (activeState) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const county = searchParams.get("county");

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
    `${base_url}data-set/get/2023_data/county?state=${activeState}`,
    () =>
      fetchData(
        `${base_url}data-set/get/2023_data/county?state=${activeState}`,
        { state: activeState }
      ),
    {
      shouldRetryOnError: false,
    }
  );
  const counties = React.useMemo(() => {
    let filteredRows = data?.map((item) => ({
      label: item?._id,
      value: item?._id,
    }));

    return filteredRows;
  }, [data]);

  const [activeCounty, setActiveCounty] = useState(county);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.delete("payam");
      params.delete("school");
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  return {
    activeCounty,
    data,
    isLoading,
    render: (
      <Select
        color="primary"
        label="Select county"
        isLoading={isLoading}
        defaultSelectedKeys={[]}
        placeholder="Select county"
        onChange={(e) => {
          setActiveCounty(e.target.value);
          router.push(
            pathname + "?" + createQueryString("county", e.target.value)
          );
        }}
      >
        {counties?.map((county) => (
          <SelectItem key={county.value} value={county.value}>
            {county.label}
          </SelectItem>
        ))}
      </Select>
    ),
  };
};

export default useSelectCounty;
