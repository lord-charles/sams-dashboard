import { Metadata } from "next";
import React, { Suspense } from "react";
import SingleSchoolView from "../view/SingleSchoolView";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import SkeletonDashboardCard from "@/components/skeletons/loading";

async function getSchoolInfo(school: string) {
  try {
    // Check if it's a MongoDB ID (24 characters, hexadecimal)
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(school);

    const response = await axios.get(
      `${base_url}school-data/school${isMongoId ? "" : "/code"}/${school}`
    );
    console.log(response.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching school:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; school: string };
}): Promise<Metadata> {
  const schoolInfo = await getSchoolInfo(params.school);
  return {
    title: `${schoolInfo?.schoolName || "School"} - School Details`,
    description: `Details and information about ${
      schoolInfo?.schoolName || "the school"
    }`,
  };
}

export default async function ViewSchool({
  params,
}: {
  params: { slug: string; school: string };
}) {
  const schoolInfo = await getSchoolInfo(params.school);
  // console.log(schoolInfo);
  return (
    <Suspense fallback={<SkeletonDashboardCard />}>
      <SingleSchoolView schoolInfo={schoolInfo} />
    </Suspense>
  );
}
