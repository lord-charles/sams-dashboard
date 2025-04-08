"use client";

import { useIndexedSWR } from '@/lib/hooks/useIndexedSWR';
import { apiEndpoints } from '@/lib/services/api.service';
import Home from './home/home';
import { FetchErrorDisplay } from '@/components/fetch-error-display';
import Loading from './loading';

// Custom hook for home page data
const useHomeData = () => {
  const { data: schoolStats, error: schoolStatsError } = useIndexedSWR(
    apiEndpoints.home.schoolStats,
    { method: 'GET' },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 900000, // 15 minutes - longer cache for static data
      dedupingInterval: 600000, // 10 minutes - reduce API calls
    }
  );

  const { data: enrollmentData, error: enrollmentError } = useIndexedSWR(
    apiEndpoints.home.enrollmentData,
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
    isLoading: !schoolStats || !enrollmentData
  };
};

const Page = () => {
  const { data, error, isLoading } = useHomeData();

  if (error) {
    return <FetchErrorDisplay error={error}  />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Home schoolStats={data.schoolStats} enrollmentData={data.enrollmentData} />
    </div>
  );
};

export default Page;