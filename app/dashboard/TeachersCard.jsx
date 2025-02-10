"use client";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import ShapePie from "../components/ui/charts/shape-pie";
import useSWR from "swr";
import CardSkeleton from "../CardSkeleton";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const TeachersCard = ({ activeYear, content }) => {
  const { data, isLoading } = useSWR(
    `/api/v1/dashboard/teacher?year=${activeYear}`,
    fetcher,
    {
      keepPreviousData: true,
      shouldRetryOnError: false,
    }
  );

  if (isLoading) {
    return <CardSkeleton />;
  }

  const teacherData = data?.error
    ? []
    : data?.map((item, index) => {
        let fillColor =
          item?.gender === "Male"
            ? "#B7E325"
            : item?.gender === "Female"
            ? "#57BEBB"
            : "#008080";
        return {
          name: item?.gender,
          value: item?.count,
          fill: fillColor,
        };
      });
  return (
    <>
      <h4>Teachers</h4>
      <hr className="my-3" />
      {teacherData?.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="!w-full h-96">
            <h4>Distribution By Gender</h4>
            <ShapePie data={teacherData} />
          </div>
          <div className="!h-2"></div>
        </div>
      )}
      <div className="!h-2"></div>
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

export default TeachersCard;
