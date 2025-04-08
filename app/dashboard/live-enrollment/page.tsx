"use client";

import { useEffect } from "react";
import LiveEnrollmentModule from "./components/live-enrollment";
import { useIndexedSWR } from "@/lib/hooks/useIndexedSWR";
import { apiEndpoints } from "@/lib/services/api.service";
import type { LearnerStatistics } from "@/lib/types/dashboard";
import { FetchErrorDisplay } from "@/components/fetch-error-display";
import Loading from "../loading";

const LiveEnrollmentPage = () => {
  const currentYear = new Date().getFullYear();

  // Fetch data using useIndexedSWR
  const { data: states, error: statesError } = useIndexedSWR(apiEndpoints.states);
  
  const { data: totalLearnersData, error: totalLearnersError } = useIndexedSWR(
    apiEndpoints.learners.total,
    { method: 'POST', body: { enrollmentYear: currentYear } }
  );
  const { data: newLearnersData, error: newLearnersError } = useIndexedSWR(
    apiEndpoints.learners.total,
    { method: 'POST', body: { year: currentYear } }
  );
  
  const { data: promotedLearnersData, error: promotedLearnersError } = useIndexedSWR(
    apiEndpoints.learners.promoted,
    { method: 'POST', body: { enrollmentYear: currentYear } }
  );
  
  const { data: disabledLearnersData, error: disabledLearnersError } = useIndexedSWR(
    apiEndpoints.learners.disabled,
    { method: 'POST', body: { enrollmentYear: currentYear } }
  );
  
  const { data: overallMaleFemaleStat, error: overallStatError } = useIndexedSWR(
    apiEndpoints.learners.genderStats,
    { method: 'POST', body: { enrollmentYear: currentYear } }
  );

  const { data: todaysEnrollment, error: todaysEnrollmentError } = useIndexedSWR(
    apiEndpoints.learners.todaysEnrollment,
    { method: 'POST' }
  );

  const { data: enrollmentSummary, error: enrollmentSummaryError } = useIndexedSWR(
    apiEndpoints.learners.enrollmentSummary,
    { method: 'POST' }
  );

  // Handle errors
  const errors = [
    statesError, totalLearnersError, newLearnersError, promotedLearnersError,
    disabledLearnersError, overallStatError, todaysEnrollmentError,
    enrollmentSummaryError
  ].filter(Boolean);

  if (errors.length > 0) {
    return <FetchErrorDisplay error={errors[0] as unknown as string} retry={() => window.location.reload()} />;
  }

  // Check if data is loading
  if (!states || !totalLearnersData || !newLearnersData || !promotedLearnersData || 
      !disabledLearnersData || !overallMaleFemaleStat || 
      !todaysEnrollment || !enrollmentSummary) {
    return <Loading />;
  }

  // Calculate statistics
  const totalStudents = overallMaleFemaleStat.totalMale + overallMaleFemaleStat.totalFemale;
  const malePercentage = totalStudents ? (overallMaleFemaleStat.totalMale / totalStudents) * 100 : 0;
  const femalePercentage = totalStudents ? (overallMaleFemaleStat.totalFemale / totalStudents) * 100 : 0;

  const initialStatistics: LearnerStatistics = {
    totalLearners: { total: totalLearnersData.count, current: totalLearnersData.count },
    promotedLearners: { total: promotedLearnersData.count, current: promotedLearnersData.count },
    disabledLearners: { total: disabledLearnersData.count, current: disabledLearnersData.count },
    newLearners: { total: newLearnersData.count, current: newLearnersData.count },
    droppedOutLearners: {
      total: overallMaleFemaleStat.droppedOutMale + overallMaleFemaleStat.droppedOutFemale,
      current: overallMaleFemaleStat.droppedOutMale + overallMaleFemaleStat.droppedOutFemale
    },
    averageAge: 0,
    malePercentage: Number(malePercentage.toFixed(2)),
    femalePercentage: Number(femalePercentage.toFixed(2)),
    genderStats: {
      totalMale: overallMaleFemaleStat.totalMale,
      totalFemale: overallMaleFemaleStat.totalFemale,
      totalMaleLwd: overallMaleFemaleStat.maleWithDisabilities,
      totalFemaleLwd: overallMaleFemaleStat.femaleWithDisabilities,
      droppedOutMale: overallMaleFemaleStat.droppedOutMale,
      droppedOutFemale: overallMaleFemaleStat.droppedOutFemale
    },
    todaysEnrollment: todaysEnrollment.data,
    enrollmentSummary: enrollmentSummary
  };

  return (
    <div>
      <LiveEnrollmentModule 
        initialStates={states}
        initialStatistics={initialStatistics}
      />
    </div>
  );
};

export default LiveEnrollmentPage;
