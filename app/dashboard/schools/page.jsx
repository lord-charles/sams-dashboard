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
      const [genderResponse, schoolsResponse] = await Promise.all([
        axios.post(`${base_url}data-set/state/gender`),
        axios.get(`${base_url}school-data/schools`)
      ]);

      return {
        genderData: genderResponse.data,
        schools: schoolsResponse.data
      };
    } catch (error) {
      console.log(error);
      return {
        genderData: null,
        schools: null
      };
    }
  };

  const { genderData, schools } = await fetchData();
  return (
    <Suspense fallback={<SkeletonDashboardCard />}>
      <div className="bg-gradient-to-b from-primary/20 to-background p-4">
        <div className="mb-2 p-1 ">
          <SchoolBreadcrumb />
        </div>
        <AdvancedStatCards />
        <SchoolsTabs genderData={genderData} schools={schools?.data} />
      </div>
    </Suspense>
  );
};

export default Schools;