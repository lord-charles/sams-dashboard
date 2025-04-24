"use client";

import { useEffect, useState } from "react";
import LiveEnrollmentModule from "./components/live-enrollment";
import { useIndexedSWR } from "@/lib/hooks/useIndexedSWR";
import { apiEndpoints } from "@/lib/services/api.service";
import type { LearnerStatistics } from "@/lib/types/dashboard";
import { FetchErrorDisplay } from "@/components/fetch-error-display";
import Loading from "../loading";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";


const LiveEnrollmentPage = () => {
  // Fetch data using useIndexedSWR
  const { data: states, error: statesError } = useIndexedSWR(apiEndpoints.states);
  
  const { data: todaysEnrollment, error: todaysEnrollmentError } = useIndexedSWR(
    apiEndpoints.learners.todaysEnrollment,
    { method: 'POST' }
  );

  const { data: enrollmentSummary, error: enrollmentSummaryError } = useIndexedSWR(
    apiEndpoints.learners.enrollmentSummary,
    { method: 'POST' }
  );

    const { data: enrollmentData, error: enrollmentError } = useIndexedSWR(
      `${base_url}school-data/enrollment/completed`
    );

  // Handle errors
  const errors = [
    statesError, todaysEnrollmentError,
    enrollmentSummaryError, enrollmentError
  ].filter(Boolean);

  if (errors.length > 0) {
    return <FetchErrorDisplay error={errors[0] as unknown as string} retry={() => window.location.reload()} />;
  }

  // Check if data is loading
  if (!states || !todaysEnrollment || !enrollmentSummary || !enrollmentData) {
    return <Loading />;
  }



  const initialStatistics = {
    todaysEnrollment: todaysEnrollment.data,
    enrollmentSummary: enrollmentSummary
  };

  return (
    <div>
      <LiveEnrollmentModule 
        initialStates={states || []}
        initialStatistics={initialStatistics || []}
        enrollmentData={enrollmentData || []}
      />
    </div>
  );
};

export default LiveEnrollmentPage;
