"use client";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import EnrollmentChart from "../components/ui/charts/enrollment";
import ShapePie from "../components/ui/charts/shape-pie";
import StackedBarChart from "../components/ui/charts/stacked-bar";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const LearnerEnrollmentCard = ({ activeYear, content }) => {
  const { data: enrollmentData } = useSWR(
    `/api/v1/dashboard/gender?year=${activeYear}`,
    fetcher,
    {
      keepPreviousData: true,
      shouldRetryOnError: false,
    }
  );
  const { data: enrollmentBySpecialData } = useSWR(
    `/api/v1/dashboard/special?year=${activeYear}`,
    fetcher,
    {
      keepPreviousData: true,
      shouldRetryOnError: false,
    }
  );
  const { data: enrollmentByAgeData } = useSWR(
    `/api/v1/dashboard/age?year=${activeYear}`,
    fetcher,
    {
      keepPreviousData: true,
      shouldRetryOnError: false,
    }
  );
  const { data: enrollmentBySchoolData } = useSWR(
    `/api/v1/dashboard/school?year=${activeYear}`,
    fetcher,
    {
      keepPreviousData: true,
      shouldRetryOnError: false,
    }
  );

  const genderData = enrollmentData?.error
    ? []
    : enrollmentData?.map((item, index) => {
        let genderName = item?.gender === "M" ? "Male" : "Female";
        let fillColor = item?.gender === "M" ? "#B7E325" : "#57BEBB";

        return {
          name: genderName,
          value: item?.count,
          fill: fillColor,
        };
      });
  const specialData = enrollmentBySpecialData?.error
    ? []
    : enrollmentBySpecialData?.map((item, index) => {
        let genderName = item?.gender === "M" ? "Male" : "Female";
        let fillColor = item?.gender === "M" ? "#B7E325" : "#57BEBB";

        return {
          name: genderName,
          value: item?.count,
          fill: fillColor,
        };
      });

  // [
  //   { name: "Male", value: 2379, fill: "#B7E325" },
  //   { name: "Female", value: 6297, fill: "#57BEBB" },
  // ];
  return (
    <>
      <h4>Learner Enrollment</h4>
      <hr className="my-4" />
      {enrollmentByAgeData?.length > 0 && (
        <div className="flex justify-between items-center mb-5">
          <div className="!w-full h-96">
            <h4 className="text-start">Distribution by Age</h4>
            <EnrollmentChart data={enrollmentByAgeData} />
          </div>
        </div>
      )}

      {enrollmentBySchoolData?.length > 0 && (
        <div className="flex justify-between items-center mb-5">
          <div className="!w-full h-96">
            <h4 className="text-start">Distribution by Schools</h4>
            <hr className="my-3" />
            <StackedBarChart data={enrollmentBySchoolData} />
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mt-5">
        {genderData?.length > 0 && (
          <div className="!w-full h-96">
            <h4 className="text-center">Distribution by Gender</h4>
            <ShapePie data={genderData} />
          </div>
        )}
        {specialData?.length > 0 && (
          <div className="!w-full h-96">
            <h4 className="text-center">Disability by Gender</h4>
            <ShapePie data={specialData} />
          </div>
        )}
      </div>
      <div className="!h-5"></div>
      {content && (
        <Card className="mt-5">
          <CardBody className="text-sm">
            <h1>{content?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: content?.description }} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default LearnerEnrollmentCard;
