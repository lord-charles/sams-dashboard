"use client";

import React from "react";
import AdvancedStatCards from "./components/AdvancedStatCards";
import SchoolsTabs from "./tabs";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { SchoolBreadcrumb } from "./components/school-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "../loading";
import { FetchErrorDisplay } from "@/components/fetch-error-display";
import useSWR from 'swr';

// Fetcher functions with error handling
const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

const postFetcher = async (url) => {
  try {
    const response = await axios.post(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

// SWR configuration for better performance
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 300000, // Refresh every 5 minutes
  shouldRetryOnError: true,
  retryCount: 3,
};

const Schools = () => {
  // SWR hooks with error handling
  const { data: genderData, error: genderError } = useSWR(
    `${base_url}data-set/state/gender`,
    postFetcher,
    swrConfig
  );

  const { data: schools, error: schoolsError } = useSWR(
    `${base_url}school-data/schools`,
    fetcher,
    swrConfig
  );

  const { data: enrollmentData, error: enrollmentError } = useSWR(
    `${base_url}school-data/enrollment/completed`,
    fetcher,
    swrConfig
  );

  const { data: overallLearnerStats, error: statsError } = useSWR(
    `${base_url}school-data/overall-learner-stats`,
    fetcher,
    swrConfig
  );

  // Check for any errors
  const errors = [genderError, schoolsError, enrollmentError, statsError].filter(Boolean);

  if (errors.length > 0) {
    return (
      <FetchErrorDisplay 
        error="Failed to load schools data. Please try again." 
        retry={() => window.location.reload()} 
      />
    );
  }

  // Check if all data is loaded
  const isLoading = !genderData || !schools || !enrollmentData || !overallLearnerStats;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-gradient-to-b from-primary/20 to-background p-2">
      <div className="mb-2 p-1">
        <SchoolBreadcrumb />
      </div>
      <AdvancedStatCards 
        enrollmentData={enrollmentData} 
        schools={schools?.data} 
        overallLearnerStats={overallLearnerStats}
      />
      <SchoolsTabs 
        genderData={genderData} 
        schools={schools?.data} 
        enrollmentData={enrollmentData} 
        overallLearnerStats={overallLearnerStats}
      />
    </div>
  );
};

export default Schools;