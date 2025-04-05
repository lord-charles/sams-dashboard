import React, { Suspense } from "react";
import AdvancedStatCards from "./components/AdvancedStatCards";
import SchoolsTabs from "./tabs";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { SchoolBreadcrumb } from "./components/school-breadcrumb";
import SkeletonDashboardCard from "@/components/skeletons/loading";


// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

const Schools = async () => {
  const fetchData = async () => {
    try {
      const [genderResponse, schoolsResponse, enrollmentResponse] = await Promise.all([
        axios.post(`${base_url}data-set/state/gender`),
        axios.get(`${base_url}school-data/schools`),
        axios.get(`${base_url}school-data/enrollment/completed`)
      ]);

      return {
        genderData: genderResponse.data,
        schools: schoolsResponse.data,
        enrollmentData: enrollmentResponse
      };
    } catch (error) {
      console.log(error);
      return {
        genderData: null,
        schools: null,
        enrollmentData: null
      };
    }
  };

  const { genderData, schools, enrollmentData } = await fetchData();
  return (
    <Suspense fallback={<SkeletonDashboardCard />}>
      <div className="bg-gradient-to-b from-primary/20 to-background p-2">
        <div className="mb-2 p-1 ">
          <SchoolBreadcrumb />
        </div>
        <AdvancedStatCards />
        <SchoolsTabs genderData={genderData} schools={schools?.data} enrollmentData={enrollmentData?.data} />
      </div>
    </Suspense>
  );
};

export default Schools;