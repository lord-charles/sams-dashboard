"use client";

import axios from 'axios';
import { base_url } from "../../utils/baseUrl";
import useSWR from 'swr';
import Loading from "../loading";
import { FetchErrorDisplay } from "@/components/fetch-error-display";
import AttendanceModuleClient from "./components/attendance-module";
import { useIndexedSWR } from '@/lib/hooks/useIndexedSWR';
import DatabaseConnectionIssue from '../schools/components/DatabaseConnectionIssue';


// Fetcher functions with error handling
const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

const postFetcher = async (url: string, year: number) => {
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

const AttendanceModule = () => {
  const currentYear = new Date().getFullYear();

  // SWR hooks with error handling
  const { data: states, error: statesError } = useSWR(
    `${base_url}data-set/get/2023_data/state`,
    fetcher,
    swrConfig
  );

  const { data: statsData, error: statsDataError } = useSWR(
    [`${base_url}attendance/statistics?year=${currentYear}`, currentYear],
    ([url, year]) => postFetcher(url, year),
    swrConfig
  );

  const { data: schools, error: schoolsError } = useIndexedSWR(
    `${base_url}attendance/allSchools`,
    { method: 'POST' }
  );

  const { data: schoolsWithAttendance, error: schoolsWithAttendanceError } = useSWR(
    `${base_url}attendance/schoolsWithAttendance`,
    postFetcher,
    swrConfig
  );


  const errors = [statesError, statsDataError, schoolsError, schoolsWithAttendanceError]
    .filter(Boolean);

  if (errors.length > 0) {
    return (
      <FetchErrorDisplay error={errors[0]} retry={() => window.location.reload()} />

    );
  }

  // Check if all data is loaded
  const isLoading = !states || !statsData || !schools || !schoolsWithAttendance;
  if (isLoading) {
    return <Loading />;
  }

  // Check for DB connection issues
  const isDbConnectionIssue = [states, statsData, schools, schoolsWithAttendance].some(
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
    <AttendanceModuleClient
      initialStates={states || []}
      statsData={statsData || {}}
      schoolsData={schools.data || []}
      schoolsWithAttendance={schoolsWithAttendance || []}
    />
  );
};

export default AttendanceModule;


