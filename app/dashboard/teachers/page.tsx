"use client";

import TeacherModuleClient from './components/teacher-module-client';
import { useIndexedSWR } from "@/lib/hooks/useIndexedSWR";
import { apiEndpoints } from "@/lib/services/api.service";
import type { TeacherStatistics } from "@/lib/types/dashboard";
import { FetchErrorDisplay } from "@/components/fetch-error-display";
import Loading from '../loading';
import DatabaseConnectionIssue from '../schools/components/DatabaseConnectionIssue';

const TeacherPage = () => {
  // Fetch data using useIndexedSWR
  const { data: states, error: statesError } = useIndexedSWR(apiEndpoints.states);

  const { data: totalTeachers, error: totalTeachersError } = useIndexedSWR(
    apiEndpoints.teachers.total,
    { method: 'POST' }
  );

  const { data: activeTeachers, error: activeTeachersError } = useIndexedSWR(
    apiEndpoints.teachers.active,
    { method: 'POST', body: { isDroppedOut: false } }
  );

  const { data: inactiveTeachers, error: inactiveTeachersError } = useIndexedSWR(
    apiEndpoints.teachers.inactive,
    { method: 'POST', body: { isDroppedOut: true } }
  );

  const { data: newTeachers, error: newTeachersError } = useIndexedSWR(
    apiEndpoints.teachers.total,
    { method: 'POST', body: { year: "2022" } }
  );

  const { data: overallGenderStats, error: genderStatsError } = useIndexedSWR(
    apiEndpoints.teachers.genderStats,
    { method: 'POST' }
  );

  // Handle errors
  const errors = [
    statesError, totalTeachersError, activeTeachersError,
    inactiveTeachersError, newTeachersError, genderStatsError
  ].filter(Boolean);

  if (errors.length > 0) {
    return <FetchErrorDisplay error={errors[0] as unknown as string} retry={() => window.location.reload()} />;
  }

  // Check if data is loading
  if (!states || !totalTeachers || !activeTeachers ||
    !inactiveTeachers || !newTeachers || !overallGenderStats) {
    return <Loading />;
  }

  // Check for DB connection issues
  const isDbConnectionIssue = [totalTeachers, activeTeachers, inactiveTeachers, newTeachers, overallGenderStats].some(
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

  console.log(overallGenderStats)
  // Calculate statistics
  const totalTeachersCount = overallGenderStats.totalMale + overallGenderStats.totalFemale;
  const malePercentage = totalTeachersCount ? (overallGenderStats.totalMale / totalTeachersCount) * 100 : 0;
  const femalePercentage = totalTeachersCount ? (overallGenderStats.totalFemale / totalTeachersCount) * 100 : 0;

  const initialStatistics: TeacherStatistics = {
    totalTeachers: { total: totalTeachers.count, current: totalTeachers.count },
    activeTeachers: { total: activeTeachers.data.activeCount, current: activeTeachers.activeCount },
    inactiveTeachers: { total: inactiveTeachers.data.inactiveCount, current: inactiveTeachers.inactiveCount },
    newTeachers: { total: newTeachers.count, current: newTeachers.count },
    droppedOutTeachers: inactiveTeachers.data.droppedOutCount,
    averageAge: 0,
    malePercentage: Number(malePercentage.toFixed(2)),
    femalePercentage: Number(femalePercentage.toFixed(2)),
    genderStats: {
      totalMale: overallGenderStats.totalMale,
      totalFemale: overallGenderStats.totalFemale,
      totalMaleLwd: overallGenderStats.maleWithDisabilities,
      totalFemaleLwd: overallGenderStats.femaleWithDisabilities
    }
  };

  return (
    <TeacherModuleClient
      initialStates={states}
      initialStatistics={initialStatistics}
    />
  );
};

export default TeacherPage;