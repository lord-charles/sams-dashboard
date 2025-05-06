"use client";

import { useEffect, useState } from "react";
import LearnerModuleClient from "./components/LearnerModuleClient";
import axios from 'axios';
import { base_url } from "../../utils/baseUrl";
import useSWR from 'swr';
import Loading from "../loading";
import { FetchErrorDisplay } from "@/components/fetch-error-display";
import DatabaseConnectionIssue from "../schools/components/DatabaseConnectionIssue";


// Fetcher functions with error handling
const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

const postFetcher = async (url, year) => {
  try {
    const response = await axios.post(url, { enrollmentYear: year });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};
// SWR configuration for better performance
const swrConfig = {
  revalidateOnFocus: false, // Don't revalidate on window focus
  revalidateOnReconnect: true, // Revalidate when browser regains connection
  refreshInterval: 300000, // Refresh every 5 minutes
  shouldRetryOnError: true, // Retry on error
  retryCount: 3, // Number of retries
};

const LearnerModule = () => {
  const currentYear = new Date().getFullYear();

  // SWR hooks with error handling
  const { data: states, error: statesError } = useSWR(
    `${base_url}data-set/get/2023_data/state`,
    fetcher,
    swrConfig
  );

  const { data: totalLearnersData, error: totalLearnersError } = useSWR(
    [`${base_url}data-set/getLearnerCountByLocation`, currentYear],
    ([url, year]) => postFetcher(url, year),
    swrConfig
  );

  const { data: promotedLearnersData, error: promotedLearnersError } = useSWR(
    [`${base_url}data-set/getPromotedLearnersCountByLocation`, currentYear],
    ([url, year]) => postFetcher(url, year),
    swrConfig
  );

  const { data: disabledLearnersData, error: disabledLearnersError } = useSWR(
    [`${base_url}data-set/getDisabledLearnersCountByLocation`, currentYear],
    ([url, year]) => postFetcher(url, year),
    swrConfig
  );

  const [newLearnersData, setNewLearnersData] = useState(null);
  const [newLearnersError, setNewLearnersError] = useState(null);

  useEffect(() => {
    const fetchNewLearners = async () => {
      try {
        const response = await axios.post(`${base_url}data-set/getLearnerCountByLocation`, {
          year: 2025
        });
        setNewLearnersData(response.data);
      } catch (error) {
        setNewLearnersError(error);
      }
    };

    fetchNewLearners();
  }, []);


  const { data: overallMaleFemaleStat, error: overallStatError } = useSWR(
    [`${base_url}data-set/overallMaleFemaleStat`, currentYear],
    ([url, year]) => postFetcher(url, year),
    swrConfig
  );
  // console.log(newLearnersData)
  // Check for any errors
  const errors = [statesError, totalLearnersError, promotedLearnersError,
    disabledLearnersError, newLearnersError, overallStatError]
    .filter(Boolean);

  if (errors.length > 0) {
    return (
      <FetchErrorDisplay error={errors[0]} retry={() => window.location.reload()} />

    );
  }


  // Check if all data is loaded
  const isLoading = !states || !totalLearnersData || !promotedLearnersData ||
    !disabledLearnersData || !newLearnersData || !overallMaleFemaleStat;

  if (isLoading) {
    return <Loading />;
  }

  // Check for DB connection issues
  const isDbConnectionIssue = [totalLearnersData, promotedLearnersData, disabledLearnersData, newLearnersData, overallMaleFemaleStat].some(
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

  // Calculate statistics once data is available
  const totalStudents = overallMaleFemaleStat.totalMale + overallMaleFemaleStat.totalFemale;
  const malePercentage = totalStudents ? (overallMaleFemaleStat.totalMale / totalStudents) * 100 : 0;
  const femalePercentage = totalStudents ? (overallMaleFemaleStat.totalFemale / totalStudents) * 100 : 0;

  const initialStatistics = {
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
    }
  };

  return (
    <LearnerModuleClient
      initialStates={states}
      initialStatistics={initialStatistics}
    />
  );
};

export default LearnerModule;

