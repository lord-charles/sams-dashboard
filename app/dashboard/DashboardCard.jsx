import { Card, CardBody } from "@nextui-org/card";
import React, { useState } from "react";
import GraduateIcon from "../components/ui/icons/sidebar/graduate-icon";
import SchoolIcon from "../components/ui/icons/sidebar/school-icon";
import UsersIcon from "../components/ui/icons/sidebar/users-icon";
import TeacherIcon from "../components/ui/icons/sidebar/teacher-icon";
import UpShortIcon from "../components/ui/icons/sidebar/up-short-icon";
import DownShortIcon from "../components/ui/icons/sidebar/down-short-icon";

const DashboardCard = ({
  UniqueSchoolsPerState10,
  totalStudentsPerSelectedYear,
  TeachersStateMaleFemaleStat,
  selected,
  setSelected,
}) => {
  const list = [
    {
      key: 1,
      title: "Number of Schools",
      quantity:
        UniqueSchoolsPerState10.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.numberOfUniqueSchools,
          0
        ) || "0",
      other: `0 schools approved expenditure`,
      percentage: 9,
      logo: <SchoolIcon />,
      end: <UpShortIcon />,
    },
    {
      key: 2,
      title: "Enrolled Learners",
      quantity:
        totalStudentsPerSelectedYear.reduce(
          (total, item) => total + item.totalPupils,
          0
        ) || "0",
      percentage: 3.48,
      other: `${
        Number(0)?.toLocaleString("en-us") || "NA"
      } learners with disability`,
      logo: <GraduateIcon />,
      end: <DownShortIcon />,
    },
    {
      key: 3,
      title: "Number of Teachers",
      quantity:
        TeachersStateMaleFemaleStat.reduce(
          (total, item) => total + item.totalFemale + item.totalMale,
          0
        ) || "0",
      other: `${Number(0)?.toLocaleString("en-us") || "NA"} new teachers`,
      percentage: 12,
      logo: <TeacherIcon />,
      end: <UpShortIcon />,
    },

    {
      key: 4,
      title: "Eligible girls for CT",
      quantity: Number(0)?.toLocaleString("en-us") || "NA",
      other: `${
        Number(0)?.toLocaleString("en-us") || "NA"
      } girls validated for CT`,
      percentage: 9,
      logo: <UsersIcon />,
      end: <UpShortIcon />,
    },
  ];

  return (
    <>
      <div className="gap-5 grid sm:grid-cols-4 mt-5 mb-3">
        {list.map((item, index) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            onPress={() => {
              setSelected(item.key);
            }}
            className={selected == item.key && `bg-primary-900`}
          >
            <CardBody className={`overflow-visible p-5`}>
              <div className="flex justify-evenly">
                <div>
                  <p
                    className={`${
                      selected == item.key && "text-gray-300"
                    } !uppercase text-sm`}
                  >
                    {item.title}
                  </p>
                  <p className="text-primary">{item.quantity}</p>
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
                  className={`w-10 h-10 flex justify-center items-center rounded-full overflow-hidden ${
                    selected == item.key ? `bg-gray-300` : `bg-primary-900`
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

export default DashboardCard;
