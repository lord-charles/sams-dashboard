"use client";

import React, { useState } from "react";
import { StatsCards } from "./stats-cards";
import { base_url } from "@/app/utils/baseUrl";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Backdrop } from "@mui/material";
import { Spinner } from "@nextui-org/react";
import SchoolsTable from "./schools-table/schools";
import { usePathname } from "next/navigation";

export default function CtDashboard({
  initialStates,
  initialStatCardData,
  initialUniqueSchools,
}: any) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear().toString();

  const yearFromPath = pathname?.split("/").pop() || currentYear;

  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState(initialStates);
  const [counties, setCounties] = useState([]);
  const [payams, setPayams] = useState([]);
  const [statCardData, setStatCardData] = useState(initialStatCardData);
  const [uniqueSchools, setUniqueSchools] = useState(initialUniqueSchools);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedPayam, setSelectedPayam] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedYear, setSelectedYear] = useState(yearFromPath);
  const [selectedTranche, setSelectedTranche] = useState(
    initialStatCardData?.latestTranche?.trancheNumber.toString() || "1"
  );

  const fetchCounties = async (state: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${base_url}data-set/get/2023_data/county`,
        { state }
      );
      setCounties(response.data);
    } catch (error) {
      console.error("Error fetching counties:", error);
    }
    setIsLoading(false);
  };

  const fetchPayams = async (county: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${base_url}data-set/get/2023_data/county/payam`,
        { county28: county }
      );
      setPayams(response.data);
    } catch (error) {
      console.error("Error fetching payams:", error);
    }
    setIsLoading(false);
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCounty("");
    setSelectedPayam("");
    setSelectedSchool("");
    setCounties([]);
    setPayams([]);
    fetchCounties(value);

    Promise.all([
      axios.get(
        `${base_url}ct/stat-card/data?year=${selectedYear}&tranche=${selectedTranche}&state=${value}`
      ),
      axios.get(
        `${base_url}ct/get/unique-schools?year=${selectedYear}&tranche=${selectedTranche}&state=${value}`
      ),
    ])
      .then(([statCardRes, schoolsRes]) => {
        setStatCardData(statCardRes.data);
        setUniqueSchools(schoolsRes.data?.data || []);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setStatCardData({
            totalSchools: { value: 0 },
            totalLearners: { value: 0, male: 0, female: 0 },
            totalAmountDisbursed: { value: 0, currency: "USD" },
            accountabilityRate: { value: 0, unit: "%" },
            learnersWithDisabilities: {
              value: 0,
              percentageOfTotalLearners: 0,
              male: 0,
              female: 0,
            },
            averageAttendance: { value: 0, unit: "%" },
            publicSchools: { value: 0, percentageOfTotalSchools: 0 },
            latestTranche: {
              trancheNumber: Number(selectedTranche),
              startDate: null,
            },
          });
          setUniqueSchools([]);
        }
        console.error("Error fetching data:", error);
      });
  };

  const handleCountyChange = (value: string) => {
    setSelectedCounty(value);
    setSelectedPayam("");
    setSelectedSchool("");
    setPayams([]);
    fetchPayams(value);

    Promise.all([
      axios.get(
        `${base_url}ct/stat-card/data?year=${selectedYear}&tranche=${selectedTranche}&state=${selectedState}&county=${value}`
      ),
      axios.get(
        `${base_url}ct/get/unique-schools?year=${selectedYear}&tranche=${selectedTranche}&state=${selectedState}&county=${value}`
      ),
    ])
      .then(([statCardRes, schoolsRes]) => {
        setStatCardData(statCardRes.data);
        setUniqueSchools(schoolsRes.data?.data || []);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setStatCardData({
            totalSchools: { value: 0 },
            totalLearners: { value: 0, male: 0, female: 0 },
            totalAmountDisbursed: { value: 0, currency: "USD" },
            accountabilityRate: { value: 0, unit: "%" },
            learnersWithDisabilities: {
              value: 0,
              percentageOfTotalLearners: 0,
              male: 0,
              female: 0,
            },
            averageAttendance: { value: 0, unit: "%" },
            publicSchools: { value: 0, percentageOfTotalSchools: 0 },
            latestTranche: {
              trancheNumber: Number(selectedTranche),
              startDate: null,
            },
          });
          setUniqueSchools([]);
        }
        console.log("Error fetching data:", error);
      });
  };

  const handlePayamChange = (value: string) => {
    setSelectedPayam(value);
    setSelectedSchool("");

    Promise.all([
      axios.get(
        `${base_url}ct/stat-card/data?year=${selectedYear}&tranche=${selectedTranche}&state=${selectedState}&county=${selectedCounty}&payam=${value}`
      ),
      axios.get(
        `${base_url}ct/get/unique-schools?year=${selectedYear}&tranche=${selectedTranche}&state=${selectedState}&county=${selectedCounty}&payam=${value}`
      ),
    ])
      .then(([statCardRes, schoolsRes]) => {
        setStatCardData(statCardRes.data);
        setUniqueSchools(schoolsRes.data?.data || []);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setStatCardData({
            totalSchools: { value: 0 },
            totalLearners: { value: 0, male: 0, female: 0 },
            totalAmountDisbursed: { value: 0, currency: "USD" },
            accountabilityRate: { value: 0, unit: "%" },
            learnersWithDisabilities: {
              value: 0,
              percentageOfTotalLearners: 0,
              male: 0,
              female: 0,
            },
            averageAttendance: { value: 0, unit: "%" },
            publicSchools: { value: 0, percentageOfTotalSchools: 0 },
            latestTranche: {
              trancheNumber: Number(selectedTranche),
              startDate: null,
            },
          });
          setUniqueSchools([]);
        }
        console.log("Error fetching data:", error);
      });
  };

  const handleTrancheChange = async (value: string) => {
    setSelectedTranche(value);
    setIsLoading(true);
    try {
      const [statCardResponse, schoolsResponse] = await Promise.all([
        axios.get(
          `${base_url}ct/stat-card/data?year=${selectedYear}&tranche=${value}`
        ),
        axios.get(
          `${base_url}ct/get/unique-schools?year=${selectedYear}&tranche=${value}`
        ),
      ]);
      setStatCardData(statCardResponse.data);
      setUniqueSchools(schoolsResponse.data?.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const ComboboxSelect = ({ options, value, onChange, placeholder }: any) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white dark:bg-gray-800"
          >
            {value
              ? options.find(
                (option: { value: string }) => option.value === value
              )?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
            />
            <CommandList>
              <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option: { value: string; label: string }) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {option?.label || ""}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const tranches = [
    { label: "Tranche 1", tranche: "1" },
    { label: "Tranche 2", tranche: "2" },
    { label: "Tranche 3", tranche: "3" },
  ];

  return (
    <div className="space-y-2">
      <Backdrop open={isLoading} className="">
        <Spinner />
      </Backdrop>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          <ComboboxSelect
            options={states.map((state: { state: string; label: string }) => ({
              value: state.state,
              label: state.state,
            }))}
            value={selectedState}
            onChange={handleStateChange}
            placeholder="Select State"
          />
          {selectedState && (
            <ComboboxSelect
              options={counties.map((county: { _id: string }) => ({
                value: county._id,
                label: county._id,
              }))}
              value={selectedCounty}
              onChange={handleCountyChange}
              placeholder="Select County"
            />
          )}
          {selectedCounty && (
            <ComboboxSelect
              options={payams.map((payam: { _id: string }) => ({
                value: payam._id,
                label: payam._id,
              }))}
              value={selectedPayam}
              onChange={handlePayamChange}
              placeholder="Select Payam"
            />
          )}

          <ComboboxSelect
            options={tranches.map((tranche) => ({
              value: tranche.tranche,
              label: tranche.label,
            }))}
            value={selectedTranche}
            onChange={handleTrancheChange}
            placeholder="Select Tranche"
          />
        </div>
        <StatsCards data={statCardData || {}} />
      </div>


      <SchoolsTable schools={uniqueSchools} year={selectedYear} />


    </div>
  );
}
