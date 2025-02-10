"use client";
import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import CardSkeleton from "../CardSkeleton";
import GraphLoading from "./skeletons/graphLoading";

const StateDistributionCard = ({ activeYear }) => {
  const [states, setStates] = useState([]);
  const [female, setFemale] = useState([]);
  const [male, setMale] = useState([]);

  const processData = (data) => {
    const statesArray = [];
    const femaleArray = [];
    const maleArray = [];

    data.forEach((item) => {
      statesArray.push(item.state);
      femaleArray.push(item.totalFemale);
      maleArray.push(item.totalMale);
    });

    // Update states with extracted values
    setStates(statesArray);
    setFemale(femaleArray);
    setMale(maleArray);
  };

  const getData = async (current) => {
    console.log(current);
    try {
      const res = await axios.post(`${base_url}data-set/state/gender`, {
        year: activeYear,
      });
      processData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData(activeYear);
  }, [activeYear]);

  return (
    <>
      <h4 className="text-black font-bold font-serif text-end">
        Learners Enrolled {activeYear}
      </h4>
      <hr className="my-1" />

      <div className="">
        {states.length === 0 || female.length === 0 || male.length === 0 ? (
          <GraphLoading />
        ) : (
          <div className="relative">
            <BarChart
              height={400}
              className="w-[100%]"
              series={[
                { data: male, label: "Male", id: "pvId" },
                { data: female, label: "Female", id: "uvId" },
              ]}
              xAxis={[
                {
                  data: states,
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

export default StateDistributionCard;
