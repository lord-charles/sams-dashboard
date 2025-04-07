import React from "react";
import AdvancedStatCards from "./components/AdvancedStatCards";
import SchoolsTabs from "./tabs";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { SchoolBreadcrumb } from "./components/school-breadcrumb";

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

const Schools = async () => {
  const fetchData = async () => {
    try {
      const [genderResponse, schoolsResponse, enrollmentResponse, overallLearnerStats] = await Promise.all([
        axios.post(`${base_url}data-set/state/gender`),
        axios.get(`${base_url}school-data/schools`),
        axios.get(`${base_url}school-data/enrollment/completed`),
        axios.get(`${base_url}school-data/overall-learner-stats`)
      ]);

      return {
        genderData: genderResponse.data,
        schools: schoolsResponse.data,
        enrollmentData: enrollmentResponse.data,
        overallLearnerStats: overallLearnerStats.data
      };
    } catch (error) {
      console.log(error);
      return {
        genderData: null,
        schools: null,
        enrollmentData: null  ,
        overallLearnerStats: null
      };
    }
  };

  const { genderData, schools, enrollmentData, overallLearnerStats } = await fetchData();
  return (

      <div className="bg-gradient-to-b from-primary/20 to-background p-2">
        <div className="mb-2 p-1 ">
          <SchoolBreadcrumb />
        </div>
        <AdvancedStatCards enrollmentData={enrollmentData} schools={schools?.data} overallLearnerStats={overallLearnerStats}/>
        <SchoolsTabs genderData={genderData} schools={schools?.data} enrollmentData={enrollmentData} overallLearnerStats={overallLearnerStats}/>
      </div>

  );
};

export default Schools;