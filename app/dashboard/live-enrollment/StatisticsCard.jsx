import { Card, CardBody } from "@nextui-org/card";
import React, { useEffect, useState } from "react";
import SchoolIcon from "@/app/components/ui/icons/sidebar/school-icon";
import UpShortIcon from "@/app/components/ui/icons/sidebar/up-short-icon";

import useSWR from "swr";
import CardSkeleton from "@/app/CardSkeleton";
import GraduateIcon from "@/app/components/ui/icons/sidebar/graduate-icon";
import UsersIcon from "@/app/components/ui/icons/sidebar/users-icon";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const StatisticsCard = ({
  isLoading,
  totalLearnersPerState,
  selected,
  setSelected,
  totalNewLearnersPerState,
  totalDroppedLearnersPerState,
  totalDisabledLearnersPerState,
}) => {
  const data = [];

  const list = [
    {
      key: 1,
      title: "Total learners",
      quantity:
        totalLearnersPerState.reduce(
          (total, current) => total + current.schoolCount,
          0
        ) || 0,
      other: `Total enrolled`,
      percentage: 9,
      logo: <SchoolIcon />,
      end: <UpShortIcon />,
    },

    {
      key: 2,
      title: "New Learners",
      quantity:
        totalNewLearnersPerState.reduce(
          (total, current) => total + current.count,
          0
        ) || 0,
      other: `New students`,
      percentage: 9,
      logo: <UsersIcon />,
      end: <UpShortIcon />,
    },
    {
      key: 3,
      title: "Dropped out Learners",
      quantity:
        totalDroppedLearnersPerState.reduce(
          (total, current) => total + current.count,
          0
        ) || 0,
      other: `Dropped out learners`,
      percentage: 9,
      logo: <GraduateIcon />,
      end: <UpShortIcon />,
    },
    {
      key: 4,
      title: "LEARNERS WITH DISABILITY",
      quantity:
        totalDisabledLearnersPerState.reduce(
          (total, current) => total + current.count,
          0
        ) || 0,
      other: `Total Learners With Disabilities`,
      percentage: 9,
      logo: <GraduateIcon />,
      end: <UpShortIcon />,
    },
  ];
  const handlePress = (item) => {
    setSelected(item);
    // if (item === 2) {
    //   fetchTotalNewLearnersPerState();
    // }
  };

  return (
    <>
      <div className="gap-5 grid sm:grid-cols-4 mt-6">
        {list.map((item, index) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            onPress={() => handlePress(item.key)}
            className={selected === item.key && `bg-primary-900`}
          >
            <CardBody className={`overflow-visible p-5`}>
              <div className="flex justify-evenly">
                <div>
                  <p
                    className={`${selected == item.key && "text-gray-300"
                      } !uppercase text-sm`}
                  >
                    {item.title}
                  </p>
                  <p className="text-primary">
                    {Number(item.quantity)?.toLocaleString("en-us")}
                  </p>
                  <div className="flex justify-between items-center">
                    <small
                      style={{
                        color: "#C9DD81",
                      }}
                    >
                      {item.other}
                    </small>
                  </div>
                </div>
                <div
                  className={`w-10 h-10 flex justify-center items-center rounded-full overflow-hidden ${selected == item.key ? `bg-gray-300` : `bg-primary-900`
                    }`}
                >
                  {item?.logo}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
};

export default StatisticsCard;
