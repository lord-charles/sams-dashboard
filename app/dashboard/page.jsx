import axios from 'axios';
import { base_url } from '../utils/baseUrl';
import Home from './home/home';


// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 600




const Page = async () => {

  const fetchData = async () => {
    try {
      const [schoolStats, enrollmentData] = await Promise.all([
        axios.get(`${base_url}school-data/school-types-by-state`),
        axios.get(`${base_url}school-data/enrollment/completed`),
      ]);

      return {
        schoolStats: schoolStats.data,
        enrollmentData: enrollmentData.data
      };
    } catch (error) {
      console.log(error);
      return {
        schoolStats: null,
        enrollmentData: null
      };
    }
  };

  const { schoolStats, enrollmentData } = await fetchData();
  return (
    <div>
      <Home  schoolStats={schoolStats} enrollmentData={enrollmentData} />
    </div>
  );
};

export default Page;
 