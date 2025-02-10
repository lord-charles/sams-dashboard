"use client";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import React from "react";
import SchoolIcon from "../components/ui/icons/sidebar/school-icon";
import UsersIcon from "../components/ui/icons/sidebar/users-icon";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import useSWR from "swr";
import CardSkeleton from "../CardSkeleton";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const ReportingCard = ({ activeYear, content }) => {
  const date = `${activeYear}-06-05`;
  const { data, isLoading } = useSWR(`/api/v1/live?date=${date}`, fetcher, {
    keepPreviousData: true,
    shouldRetryOnError: false,
  });

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <>
      <Card className="mx-5">
        <CardBody>
          <div className="gap-5 grid grid-cols-2 sm:grid-cols-4 mb-5">
            <Card shadow="sm" isPressable>
              <CardHeader className="bg-primary uppercase text-white text-sm">
                Schools Reporting
              </CardHeader>
              <CardBody className={`overflow-visible p-5 `}>
                <p>
                  {" "}
                  {Number(data?.number_of_states || 0)?.toLocaleString("en-us")}
                </p>
              </CardBody>
            </Card>
            <Card shadow="sm" isPressable>
              <CardHeader className="bg-primary uppercase text-white text-sm">
                Reported Attendance
              </CardHeader>
              <CardBody className={`overflow-visible p-5 `}>
                <p>
                  {Number(data?.total_students || 0)?.toLocaleString("en-us")}
                </p>
              </CardBody>
            </Card>
            <Card shadow="sm" isPressable>
              <CardHeader className="bg-primary uppercase text-white text-sm">
                Reached Threshold (≥5)
              </CardHeader>
              <CardBody className={`overflow-visible p-5 `}>
                <p>2,348</p>
              </CardBody>
            </Card>
            <Card shadow="sm" isPressable>
              <CardHeader className="bg-primary uppercase text-white text-sm">
                Missed Threshold
              </CardHeader>
              <CardBody className={`overflow-visible p-5 `}>
                <p>1,348</p>
              </CardBody>
            </Card>
          </div>
          <div className="flex justify-center items-center my-3">
            <Image
              as={NextImage}
              width={450}
              height={450}
              className="w-auto h-auto"
              src="http://34.122.44.159/_next/image?url=%2Fimg%2Ffp_Juba%20Model%20Primary%20school.jpeg&w=640&q=75"
              alt="Students learning for GESS South Sudan"
            />
          </div>

          <div className="!w-full h-96">
            {/* <SimpleLineChart data={pieData} /> */}
          </div>

          <div className="gap-5 grid sm:grid-cols-4 my-5">
            <Card shadow="sm" isPressable>
              <CardBody
                className={`overflow-visible p-5 bg-primary-900
                }`}
              >
                <div className="flex justify-evenly">
                  <div>
                    <p
                      className={`!uppercase text-sm text-white
                      }`}
                    >
                      Learners Present Today
                    </p>
                    <p className="text-primary">
                      {Number(data?.total_present || 0)?.toLocaleString(
                        "en-us"
                      )}
                    </p>
                  </div>
                  <div className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden bg-gray-200">
                    <span className="text-sm ">
                      <UsersIcon />
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card shadow="sm" isPressable>
              <CardBody
                className={`overflow-visible p-5 bg-primary-900
                }`}
              >
                <div className="flex justify-evenly">
                  <div>
                    <p
                      className={`!uppercase text-sm text-white
                      }`}
                    >
                      Learners Absent Today
                    </p>
                    <p className="text-primary">
                      {Number(data?.total_absent || 0)?.toLocaleString("en-us")}
                    </p>
                  </div>
                  <div className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden bg-gray-200">
                    <span className="text-sm ">
                      <UsersIcon />
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card shadow="sm" isPressable>
              <CardBody
                className={`overflow-visible p-5 bg-primary-900
                }`}
              >
                <div className="flex justify-evenly">
                  <div>
                    <p
                      className={`!uppercase text-sm text-white
                      }`}
                    >
                      Schools Reported Today
                    </p>
                    <p className="text-primary">
                      {Number(data?.number_of_states || 0)?.toLocaleString(
                        "en-us"
                      )}
                    </p>
                  </div>
                  <div className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden bg-gray-200">
                    <span className="text-sm ">
                      <SchoolIcon />
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
        {content && (
          <Card className="mt-5 mx-2">
            <CardBody className="text-sm">
              <h1>{content?.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: content?.description }} />
            </CardBody>
          </Card>
        )}
      </Card>
    </>
  );
};

export default ReportingCard;
