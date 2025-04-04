import axios from 'axios';
import { base_url } from '../utils/baseUrl';
import Home from './home/home';


// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;




const Page = async () => {

  const fetchData = async () => {
    try {
      const [learnerStats, schoolStats] = await Promise.all([
        axios.get(`${base_url}school-data/learner-stats-by-state`),
        axios.get(`${base_url}school-data/school-types-by-state`)
      ]);

      return {
        learnerStats: learnerStats.data,
        schoolStats: schoolStats.data
      };
    } catch (error) {
      console.log(error);
      return {
        learnerStats: null,
        schoolStats: null
      };
    }
  };

  const { learnerStats, schoolStats } = await fetchData();
  return (
    <div>
      <Home learnerStats={learnerStats} schoolStats={schoolStats} />
    </div>
  );
};

export default Page;
 