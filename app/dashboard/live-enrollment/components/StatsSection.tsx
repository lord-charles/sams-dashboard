
import { TotalEnrollmentCard } from "./stats/TotalEnrollmentCard";
import { GenderDistributionCard } from "./stats/GenderDistributionCard";
import { CurrentYearCard } from "./stats/CurrentYearCard";
import { DisabilityStatsCard } from "./stats/DisabilityStatsCard";

export interface EnrollmentData {
  _id: string;
  code: string;
  schoolName: string;
  schoolType: string;
  emisId: string;
  isEnrollmentComplete: {
    year: number;
    isComplete: boolean;
    learnerEnrollmentComplete: boolean;
    percentageComplete: number;
  }[];
  learnerStats: {
    [key: string]: {
      total: number;
      male: number;
      female: number;
      withDisability: number;
      currentYear: {
        total: number;
        male: number;
        female: number;
        withDisability: number;
      };
    };
  };
}
interface StatsSectionProps {
  data: any[];
}

const calculateStats = (data: EnrollmentData[]) => {
  const completedEnrollments = data.filter(
    school => school.isEnrollmentComplete.some(e => e.learnerEnrollmentComplete)
  );

  if (completedEnrollments.length === 0) return null;

  const stats = {
    totalEnrollment: 0,
    totalCurrentYear: 0,
    maleCount: 0,
    femaleCount: 0,
    currentYearMale: 0,
    currentYearFemale: 0,
    disabilityCount: 0,
    currentYearDisability: 0,
    yearOverYearGrowth: 0
  };

  completedEnrollments.forEach(school => {
    Object.values(school.learnerStats).forEach(grade => {
      stats.totalEnrollment += grade.total;
      stats.totalCurrentYear += grade.currentYear.total;
      stats.maleCount += grade.male;
      stats.femaleCount += grade.female;
      stats.currentYearMale += grade.currentYear.male;
      stats.currentYearFemale += grade.currentYear.female;
      stats.disabilityCount += grade.withDisability;
      stats.currentYearDisability += grade.currentYear.withDisability;
    });
  });

  stats.yearOverYearGrowth = ((stats.currentYearMale + stats.currentYearFemale) / stats.totalEnrollment * 100) - 100;

  return stats;
};

export const StatsSection = ({ data }: StatsSectionProps) => {
  const stats = calculateStats(data);
  
  if (!stats) return null;

  const malePercentage = (stats.maleCount / (stats.maleCount + stats.femaleCount)) * 100;
  const currentYearPercentage = (stats.totalCurrentYear / stats.totalEnrollment) * 100;
  const disabilityGrowth = ((stats.currentYearDisability / stats.disabilityCount) * 100) - 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <TotalEnrollmentCard
        totalEnrollment={stats.totalEnrollment}
        currentYearTotal={stats.totalCurrentYear}
        yearOverYearGrowth={stats.yearOverYearGrowth}
      />
      <GenderDistributionCard
        maleCount={stats.maleCount}
        femaleCount={stats.femaleCount}
        malePercentage={malePercentage}
      />
      <CurrentYearCard
        totalCurrentYear={stats.totalCurrentYear}
        currentYearMale={stats.currentYearMale}
        currentYearFemale={stats.currentYearFemale}
        percentageOfTotal={currentYearPercentage}
      />
      <DisabilityStatsCard
        disabilityCount={stats.disabilityCount}
        currentYearDisability={stats.currentYearDisability}
        yearOverYearGrowth={disabilityGrowth}
      />
    </div>
  );
};
