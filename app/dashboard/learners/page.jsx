import LearnerModuleClient from "./components/LearnerModuleClient";
import axios from 'axios';
import { base_url } from "../../utils/baseUrl";

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 7200;


async function getInitialData() {
  try {
    const [
      { data: states },
      { data: totalLearnersData },
      { data: promotedLearnersData },
      { data: disabledLearnersData },
      { data: newLearnersData },
      { data: overallMaleFemaleStat }
    ] = await Promise.all([
      axios.get(`${base_url}data-set/get/2023_data/state`),
      axios.post(`${base_url}data-set/getLearnerCountByLocation`, { enrollmentYear: new Date().getFullYear() }),
      axios.post(`${base_url}data-set/getPromotedLearnersCountByLocation`, { enrollmentYear: new Date().getFullYear() }),
      axios.post(`${base_url}data-set/getDisabledLearnersCountByLocation`, { enrollmentYear: new Date().getFullYear() }),
      axios.post(`${base_url}data-set/getLearnerCountByLocation`, { year: new Date().getFullYear() }),
      axios.post(`${base_url}data-set/overallMaleFemaleStat`, { enrollmentYear: new Date().getFullYear() }),
    ]);
    // Calculate percentages from overallMaleFemaleStat
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

    return {
      states,
      initialStatistics,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      states: [],
      initialStatistics: {
        totalLearners: { total: 0, current: 0 },
        promotedLearners: { total: 0, current: 0 },
        disabledLearners: {
          total: 0,
          current: 0,
          male: 0,
          female: 0
        },
        newLearners: { total: 0, current: 0 },
        droppedOutLearners: {
          total: 0,
          current: 0
        },
        averageAge: 0,
        malePercentage: 0,
        femalePercentage: 0,
        genderStats: {
          totalMale: 0,
          totalFemale: 0,
          totalMaleLwd: 0,
          totalFemaleLwd: 0,
          droppedOutMale: 0,
          droppedOutFemale: 0
        }
      },
    };
  }
}

export default async function LearnerModule() {
  const { states, initialStatistics } = await getInitialData();
  console.log(states)
  return (
    <LearnerModuleClient
      initialStates={states}
      initialStatistics={initialStatistics}
    />
  );
}