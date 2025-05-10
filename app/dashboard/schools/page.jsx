"use client";

import React from "react";
import AdvancedStatCards from "./components/AdvancedStatCards";
import SchoolsTabs from "./tabs";
import { base_url } from "@/app/utils/baseUrl";
import { SchoolBreadcrumb } from "./components/school-breadcrumb";
import Loading from "../loading";
import DatabaseConnectionIssue from "./components/DatabaseConnectionIssue";
import { FetchErrorDisplay } from "@/components/fetch-error-display";
import { useIndexedSWR } from "@/lib/hooks/useIndexedSWR";


const Schools = () => {
  // SWR hooks with IndexedDB caching
  // const { data: genderData, error: genderError } = useIndexedSWR(
  //   `${base_url}data-set/state/gender`,
  //   { method: 'POST' }
  // );

  const { data: schools, error: schoolsError } = useIndexedSWR(
    `${base_url}school-data/schools`
  );

  const { data: enrollmentData, error: enrollmentError } = useIndexedSWR(
    `${base_url}school-data/enrollment/completed`
  );

  const { data: overallLearnerStats, error: statsError } = useIndexedSWR(
    `${base_url}school-data/overall-learner-stats`
  );

  // Check for any errors
  const errors = [schoolsError, enrollmentError, statsError].filter(Boolean);

  if (errors.length > 0) {
    return (
      <FetchErrorDisplay
        error="Failed to load schools data. Please try again."
        retry={() => window.location.reload()}
      />
    );
  }

  // Check if all data is loaded
  const isLoading = !schools || !enrollmentData || !overallLearnerStats;

  if (isLoading) {
    return <Loading />;
  }

  // Check for DB connection errors in the data itself
  const isDbConnectionIssue = [enrollmentData, schools, overallLearnerStats].some(
    (d) =>
      d &&
      typeof d === 'object' &&
      d.error &&
      typeof d.error === 'string' &&
      d.error.includes('ECONNREFUSED')
  );
  if (isDbConnectionIssue) {
    return <DatabaseConnectionIssue />;
  }
  return (
    <div className="bg-gradient-to-b from-primary/20 to-background p-2">

      <AdvancedStatCards
        enrollmentData={enrollmentData === undefined || enrollmentData === null ? [] : enrollmentData}
        schools={schools?.data || []}
      />
      <SchoolsTabs
        schools={schools?.data || []}
        enrollmentData={enrollmentData === undefined || enrollmentData === null ? [] : enrollmentData}
      />
    </div>
  );
};

export default Schools;