"use client";

import { useEffect, useState } from 'react';
import { useIndexedSWR } from '@/lib/hooks/useIndexedSWR';
import { apiEndpoints } from '@/lib/services/api.service';
import { FetchErrorDisplay } from '@/components/fetch-error-display';
import Loading from '../loading';
import Home from './home';
import DatabaseConnectionIssue from '../schools/components/DatabaseConnectionIssue';

const useHomeData = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: schoolStats, error: schoolStatsError } = useIndexedSWR(
    isMounted ? apiEndpoints.home.schoolStats : null,
    { method: 'GET' },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 900000, // 15 minutes - longer cache for static data
      dedupingInterval: 600000, // 10 minutes - reduce API calls
    }
  );

  const { data: enrollmentData, error: enrollmentError } = useIndexedSWR(
    isMounted ? apiEndpoints.home.enrollmentData : null,
    { method: 'GET' },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes - more frequent updates for enrollment
      dedupingInterval: 60000, // 1 minute - ensure fresh enrollment data
    }
  );

  return {
    data: {
      schoolStats: schoolStats,
      enrollmentData: enrollmentData
    },
    error: schoolStatsError || enrollmentError,
    isLoading: !isMounted || !schoolStats || !enrollmentData
  };
};

const HomeDataClient = () => {
  const { data, error, isLoading } = useHomeData();
  if (error) {
    return <FetchErrorDisplay error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  // DB connection error check
  const isDbConnectionIssue = [data.schoolStats, data.enrollmentData].some(
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

  return <Home schoolStats={data.schoolStats === undefined || data.schoolStats === null ? [] : data.schoolStats} enrollmentData={data.enrollmentData === undefined || data.enrollmentData === null ? [] : data.enrollmentData} />;
};

export default HomeDataClient;