import axios from 'axios';
import { base_url } from "@/app/utils/baseUrl";
import TeacherModuleClient from './components/teacher-module-client';

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;


async function getInitialData() {
  try {
    const [
      { data: states },
      { data: totalTeachers },
      { data: activeTeachers },
      { data: inactiveTeachers },
      { data: newTeachers },
      { data: overallGenderStats }
    ] = await Promise.all([
      axios.get(`${base_url}data-set/get/2023_data/state`),
      axios.post(`${base_url}user/getTeacherCountByLocation`, {}),
      axios.post(`${base_url}user/getTeacherCountByLocation`, { isDroppedOut: false }),
      axios.post(`${base_url}user/getTeacherCountByLocation`, { isDroppedOut: true }),
      axios.post(`${base_url}user/getTeacherCountByLocation`, { year: new Date().getFullYear() }),
      axios.post(`${base_url}user/overallMaleFemaleStat`, {}),
    ]);

    const totalTeachersCount = overallGenderStats.totalMale + overallGenderStats.totalFemale;
    const malePercentage = totalTeachersCount ? (overallGenderStats.totalMale / totalTeachersCount) * 100 : 0;
    const femalePercentage = totalTeachersCount ? (overallGenderStats.totalFemale / totalTeachersCount) * 100 : 0;

    const initialStatistics = {
      totalTeachers: { total: totalTeachers.count, current: totalTeachers.count },
      activeTeachers: { total: activeTeachers.count, current: activeTeachers.count },
      inactiveTeachers: { total: inactiveTeachers.count, current: inactiveTeachers.count },
      newTeachers: { total: newTeachers.count, current: newTeachers.count },
      malePercentage: Number(malePercentage.toFixed(2)),
      femalePercentage: Number(femalePercentage.toFixed(2)),
      genderStats: {
        totalMale: overallGenderStats.totalMale,
        totalFemale: overallGenderStats.totalFemale,
        totalMaleLwd: overallGenderStats.maleWithDisabilities,
        totalFemaleLwd: overallGenderStats.femaleWithDisabilities

      }
    };

    return {
      initialStates: states,
      initialStatistics,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      initialStates: [],
      initialStatistics: {
        totalTeachers: { total: 0, current: 0 },
        activeTeachers: { total: 0, current: 0 },
        inactiveTeachers: { total: 0, current: 0 },
        newTeachers: { total: 0, current: 0 },
        droppedOutTeachers: 0,
        averageAge: 0,
        malePercentage: 0,
        femalePercentage: 0,
        genderStats: {
          totalMale: 0,
          totalFemale: 0,
          totalMaleLwd: 0,
          totalFemaleLwd: 0
        }
      }, malePercentage: 0,
      femalePercentage: 0,
    };
  }
}

export default async function TeacherPage() {
  const { initialStates, initialStatistics } = await getInitialData();

  return (
    <TeacherModuleClient
      initialStates={initialStates}
      initialStatistics={initialStatistics}
    />
  );
}