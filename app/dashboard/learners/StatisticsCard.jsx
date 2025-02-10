import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import SchoolIcon from "@/app/components/ui/icons/sidebar/school-icon";
import UpShortIcon from "@/app/components/ui/icons/sidebar/up-short-icon";
import GraduateIcon from "@/app/components/ui/icons/sidebar/graduate-icon";
import UsersIcon from "@/app/components/ui/icons/sidebar/users-icon";

const StatisticsCard = ({
  LearnerCountByLocation,
  promotedLearnersCountByLocation,
  disabledLearnersCountByLocation,
  newLearnersCountByLocation,
  selected,
  setSelected,
}) => {
  const handlePress = (key) => {
    setSelected(key);
    // Add logic here if needed when a card is pressed
  };

  return (
    <div className="gap-5 grid sm:grid-cols-4 mt-6">
      <Card
        shadow="sm"
        isPressable
        onPress={() => handlePress(1)}
        className={selected === 1 ? `bg-primary-900` : ``}
      >
        <CardBody className={`overflow-visible p-5`}>
          <div className="flex justify-evenly">
            <div>
              <p
                className={`${selected === 1 ? "text-gray-300" : ""
                  } !uppercase text-sm`}
              >
                Total learners
              </p>
              <p className="text-primary">
                {LearnerCountByLocation?.toLocaleString("en-us")}
              </p>
              <div className="flex justify-between items-center">
                <small style={{ color: "#C9DD81" }}>Total enrolled</small>
              </div>
            </div>
            <div
              className={`w-10 h-10 flex justify-center items-center rounded-full overflow-hidden ${selected === 1 ? "bg-gray-300" : "bg-primary-900"
                }`}
            >
              <SchoolIcon />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card
        shadow="sm"
        isPressable
        onPress={() => handlePress(2)}
        className={selected === 2 ? `bg-primary-900` : ``}
      >
        <CardBody className={`overflow-visible p-5`}>
          <div className="flex justify-evenly">
            <div>
              <p
                className={`${selected === 2 ? "text-gray-300" : ""
                  } !uppercase text-sm`}
              >
                New Learners
              </p>
              <p className="text-primary">
                {newLearnersCountByLocation?.toLocaleString("en-us")}
              </p>
              <div className="flex justify-between items-center">
                <small style={{ color: "#C9DD81" }}>New students</small>
              </div>
            </div>
            <div
              className={`w-10 h-10 flex justify-center items-center rounded-full overflow-hidden ${selected === 2 ? "bg-gray-300" : "bg-primary-900"
                }`}
            >
              <UsersIcon />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card
        shadow="sm"
        isPressable
        onPress={() => handlePress(3)}
        className={selected === 3 ? `bg-primary-900` : ``}
      >
        <CardBody className={`overflow-visible p-5`}>
          <div className="flex justify-evenly">
            <div>
              <p
                className={`${selected === 3 ? "text-gray-300" : ""
                  } !uppercase text-sm`}
              >
                Promoted Learners
              </p>
              <p className="text-primary">
                {promotedLearnersCountByLocation?.toLocaleString("en-us")}
              </p>
              <div className="flex justify-between items-center">
                <small style={{ color: "#C9DD81" }}>Dropped out learners</small>
              </div>
            </div>
            <div
              className={`w-10 h-10 flex justify-center items-center rounded-full overflow-hidden ${selected === 3 ? "bg-gray-300" : "bg-primary-900"
                }`}
            >
              <GraduateIcon />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card
        shadow="sm"
        isPressable
        onPress={() => handlePress(4)}
        className={selected === 4 ? `bg-primary-900` : ``}
      >
        <CardBody className={`overflow-visible p-5`}>
          <div className="flex justify-evenly">
            <div>
              <p
                className={`${selected === 4 ? "text-gray-300" : ""
                  } !uppercase text-sm`}
              >
                Disabled Learners
              </p>
              <p className="text-primary">
                {disabledLearnersCountByLocation?.toLocaleString("en-us")}
              </p>
              <div className="flex justify-between items-center">
                <small style={{ color: "#C9DD81" }}>Disabled learners</small>
              </div>
            </div>
            <div
              className={`w-10 h-10 flex justify-center items-center rounded-full overflow-hidden ${selected === 4 ? "bg-gray-300" : "bg-primary-900"
                }`}
            >
              <GraduateIcon />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StatisticsCard;
