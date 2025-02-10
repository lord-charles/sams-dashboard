"use client";
import ShapePie from "@/app/components/ui/charts/shape-pie";
import React from "react";

const LiveEnrollmentChart = ({ data, title }) => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const formatted = data?.map((item, index) => {
    return {
      name: item?.state ?? item?._id,
      value: item?.totalPupils,
      fill: getRandomColor(),
    };
  });
  return (
    <>
      {formatted?.length > 0 && (
        <div className="!w-full h-96 mb-5">
          <h4 className="text-start mb-3 font-bold">{title}</h4>
          <ShapePie data={formatted} />
        </div>
      )}
    </>
  );
};

export default LiveEnrollmentChart;
