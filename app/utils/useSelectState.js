"use client";
import React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useState } from "react";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const useSelectState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const state = searchParams.get("state");
  const [activeState, setActiveState] = useState(state);
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/data-set/get/2023_data/state`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  const states = React.useMemo(() => {
    let filteredRows = data?.map((item) => ({
      label: item?.state,
      value: item?.state,
    }));

    return filteredRows;
  }, [data]);
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.delete("county");
      params.delete("payam");
      params.delete("school");
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  return {
    activeState,
    data,
    isLoading,
    render: (
      <Select
        color="primary"
        label="Select state"
        placeholder="Select state"
        defaultSelectedKeys={[]}
        isLoading={isLoading}
        onChange={(e) => {
          setActiveState(e.target.value);
          router.replace(
            pathname + "?" + createQueryString("state", e.target.value)
          );
        }}
      >
        {states?.map((state) => (
          <SelectItem key={state.value} value={state.value}>
            {state.label}
          </SelectItem>
        ))}
      </Select>
    ),
  };
};

export default useSelectState;
