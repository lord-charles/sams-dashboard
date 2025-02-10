import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import { Chip } from "@nextui-org/chip";
import ShapePie from "../components/ui/charts/shape-pie";
import { pieData } from "../lib/data";
const getEnrollmentBySpecial = async (year) => {
  try {
    const response = await fetch(`/api/v1/dashboard/special?year=${year}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
  }
};
const getStates = async (year) => {
  try {
    const response = await fetch(`/api/v1/dashboard/disability?year=${year}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
  }
};

const DisabilityMatrixCard = async ({ activeYear, content }) => {
  const disability = await getEnrollmentBySpecial(activeYear);
  const specialData = disability?.map((item, index) => {
    let genderName = item?.gender === "M" ? "Male" : "Female";
    let fillColor = item?.gender === "M" ? "#B7E325" : "#57BEBB";

    return {
      name: genderName,
      value: item?.count,
      fill: fillColor,
    };
  });
  const states = await getStates(activeYear);
  const getRandomColorClass = () => {
    const colors = ["primary", "success", "danger", "warning", "secondary"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const data = (states ?? []).map((item, index) => {
    return {
      name: item?.state_name,
      value: item?.total,
      fill: getRandomColor(),
    };
  });
  return (
    <>
      <Card className="mx-5">
        <CardBody>
          <h4>DISABILITY MATRIX</h4>
          <hr className="my-3" />
          {specialData?.length > 0 && (
            <div className="!w-full h-96 mb-5">
              <h4>Distribution by state</h4>
              <ShapePie data={specialData} />
            </div>
          )}
          {states?.length > 0 && (
            <div className="w-full">
              <div className="grid md:grid-cols-4 gap-4">
                {states?.map((item, key) => (
                  <Card key={key}>
                    <CardBody>
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          <Chip
                            className="capitalize border-none m-0 p-0 text-xs"
                            color={getRandomColorClass()}
                            size="xs"
                            variant="dot"
                          >
                            {item?.state_name}
                          </Chip>
                        </div>
                        <div className="w-full border-l border-gray-400 pl-4">
                          <p className="text-xs">
                            Male {Number(item?.male)?.toLocaleString("en-us")}
                          </p>
                          <p className="text-xs">
                            Female{" "}
                            {Number(item?.female)?.toLocaleString("en-us")}
                          </p>
                          <p className="text-xs bg-gray-500 text-white">
                            Total {item?.total?.toLocaleString("en-us")}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardBody>
        {content && 
      <Card className="mt-5">
        <CardBody className="text-sm">
          <h1>{content?.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content?.description }} />
        </CardBody>
      </Card>
      }
      </Card>
    </>
  );
};

export default DisabilityMatrixCard;
