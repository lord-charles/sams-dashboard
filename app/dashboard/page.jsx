import axios from 'axios';
import { base_url } from '../utils/baseUrl';
import Home from './home/home';


// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;




const Page = async () => {

  const fetchData = async () => {
    try {
      const [learnerStats, schoolStats, enrollmentData] = await Promise.all([
        axios.get(`${base_url}school-data/learner-stats-by-state`),
        axios.get(`${base_url}school-data/school-types-by-state`),
        axios.get(`${base_url}school-data/enrollment/completed`),
      ]);

      return {
        learnerStats: learnerStats.data,
        schoolStats: schoolStats.data,
        enrollmentData: enrollmentData.data
      };
    } catch (error) {
      console.log(error);
      return {
        learnerStats: null,
        schoolStats: null,
        enrollmentData: null
      };
    }
  };

  const { learnerStats, schoolStats, enrollmentData } = await fetchData();
  return (
    <div>
      <Home learnerStats={learnerStats} schoolStats={schoolStats} enrollmentData={enrollmentData} />
    </div>
  );
};

export default Page;
 