"use client";
import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import CardSkeleton from "../CardSkeleton";
import GraphLoading from "./skeletons/graphLoading";

const StateDistributionGraphTeachers = ({
  activeYear,
  statesTeachers,
  femaleTeachers,
  maleTeachers,
}) => {
  return (
    <>
      {/* <h4 className="text-black font-bold font-serif text-end">
        Learners Enrolled {activeYear}
      </h4>
      <hr className="my-1" /> */}

      <div className="">
        {statesTeachers.length === 0 ||
        femaleTeachers.length === 0 ||
        maleTeachers.length === 0 ? (
          <GraphLoading />
        ) : (
          <div className="relative">
            <BarChart
              height={400}
              className="w-[100%]"
              series={[
                { data: maleTeachers, label: "Male", id: "pvId" },
                { data: femaleTeachers, label: "Female", id: "uvId" },
              ]}
              xAxis={[
                {
                  data: statesTeachers,
                  scaleType: "band",
                  scale: {
                    type: "band",
                    paddingInner: 100,
                    paddingOuter: 200,
                  },
                },
              ]}
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              tooltip={{ trigger: "axis", slotProps: {} }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default StateDistributionGraphTeachers;
