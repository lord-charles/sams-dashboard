"use client";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Spinner } from "@nextui-org/spinner";
import React from "react";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Page = ({ params }) => {
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/data-set/2023_data/students/${params?.slug}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  console.log(data);
  return (
    <Card className="mx-5">
      <CardBody>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <h4 className="font-bold mt-3 text-primary">General Details</h4>
            <div className="gap-5 grid sm:grid-cols-3 text-sm">
              <div className="">
                <p> Name</p>
                <p className="text-stone-500">
                  {data?.firstName +
                    " " +
                    data?.middleName +
                    " " +
                    data?.lastName}
                </p>
              </div>
              <div className="">
                <p> Learner Unique Id</p>
                <p className="text-stone-500">{data?.learnerUniqueID}</p>
              </div>
              <div className="">
                <p> Date of Birth</p>
                <p className="text-stone-500">
                  {new Date(data?.dob)?.toLocaleString("en-us", options)}
                </p>
              </div>
              <div className="">
                <p> Gender</p>
                <p className="text-stone-500">
                  {data.gender.toLowerCase().includes("f") ? "Female" : "Male"}
                </p>
              </div>

              <div className="">
                <p> Dropped Out</p>
                <Chip
                  className="capitalize text-xs p-3"
                  color={data?.isDroppedOut ? "danger" : "success"}
                  size="sm"
                  variant="flat"
                >
                  {data?.isDroppedOut ? "Yes" : "No"}
                </Chip>
              </div>
              <div className="">
                <p> Promoted</p>
                <Chip
                  className="capitalize text-xs p-3"
                  color={data?.isPromoted ? "success" : "danger"}
                  size="sm"
                  variant="flat"
                >
                  {data?.isPromoted ? "Yes" : "No"}
                </Chip>
              </div>
              <div className="">
                <p> Age</p>
                <p className="text-stone-500">{data?.age}</p>
              </div>
              <div className="">
                <p> Class</p>
                <p className="text-stone-500">{data?.class}</p>
              </div>
              <div className="">
                <p> Code</p>
                <p className="text-stone-500">{data?.code}</p>
              </div>
              <div className="">
                <p> Form</p>
                <p className="text-stone-500">{data?.form}</p>
              </div>
              <div className="">
                <p> Education</p>
                <p className="text-stone-500">{data?.education}</p>
              </div>
              <div className="">
                <p> School</p>
                <p className="text-stone-500">{data?.school}</p>
              </div>
              <div className="">
                <p> Pregnant</p>
                <Chip
                  className="capitalize text-xs p-3"
                  color={
                    data?.pregantOrNursing?.pregnant ? "success" : "danger"
                  }
                  size="sm"
                  variant="flat"
                >
                  {data?.pregantOrNursing?.pregnant ? "Yes" : "No"}
                </Chip>
              </div>
              <div className="">
                <p> Nursing</p>
                <Chip
                  className="capitalize text-xs p-3"
                  color={data?.pregantOrNursing?.nursing ? "success" : "danger"}
                  size="sm"
                  variant="flat"
                >
                  {data?.pregantOrNursing?.nursing ? "Yes" : "No"}
                </Chip>
              </div>
            </div>
            <h4 className="font-bold mt-3 text-primary">Difficulties</h4>
            <div className="gap-5 grid sm:grid-cols-3 text-sm">
              {data?.disabilities?.map((item) => {
                return (
                  <>
                    <div className="">
                      <p> Difficulty Seeing</p>
                      <Chip
                        className="capitalize text-xs p-3"
                        color={
                          item?.difficultySeeing > 1 ? "success" : "danger"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {item?.difficultySeeing > 1 ? "Yes" : "No"}
                      </Chip>
                    </div>
                    <div className="">
                      <p> Difficulty Hearing</p>
                      <Chip
                        className="capitalize text-xs p-3"
                        color={
                          item?.item?.disabilities?.difficultyHearing > 1
                            ? "success"
                            : "danger"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {item?.item?.disabilities?.difficultyHearing > 1
                          ? "Yes"
                          : "No"}
                      </Chip>
                    </div>
                    <div className="">
                      <p> Difficulty Self Care</p>
                      <Chip
                        className="capitalize text-xs p-3"
                        color={
                          item?.item?.disabilities?.difficultySelfCare > 1
                            ? "success"
                            : "danger"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {item?.item?.disabilities?.difficultySelfCare > 1
                          ? "Yes"
                          : "No"}
                      </Chip>
                    </div>
                    <div className="">
                      <p> Difficulty Talking</p>
                      <Chip
                        className="capitalize text-xs p-3"
                        color={
                          item?.item?.disabilities?.difficultyTalking > 1
                            ? "success"
                            : "danger"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {item?.item?.disabilities?.difficultyTalking > 1
                          ? "Yes"
                          : "No"}
                      </Chip>
                    </div>
                    <div className="">
                      <p> Difficulty Walking</p>
                      <Chip
                        className="capitalize text-xs p-3"
                        color={
                          item?.item?.disabilities?.difficultyWalking > 1
                            ? "success"
                            : "danger"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {item?.item?.disabilities?.difficultyWalking > 1
                          ? "Yes"
                          : "No"}
                      </Chip>
                    </div>
                    <div className="">
                      <p> Difficulty Recalling</p>
                      <Chip
                        className="capitalize text-xs p-3"
                        color={
                          item?.item?.disabilities?.difficultyRecalling > 1
                            ? "success"
                            : "danger"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {item?.item?.disabilities?.difficultyRecalling > 1
                          ? "Yes"
                          : "No"}
                      </Chip>
                    </div>
                  </>
                );
              })}
            </div>
            <h4 className="font-bold mt-3 text-primary">HouseHold</h4>
            <div className="gap-5 grid sm:grid-cols-3 text-sm">
              {data?.houseHold?.map((item) => {
                return (
                  <>
                    <div className="">
                      <p> Female Adult</p>
                      <p className="text-stone-500">{item?.femaleAdult}</p>
                    </div>
                    <div className="">
                      <p> Female Below 18</p>
                      <p className="text-stone-500">{item?.femaleBelow18}</p>
                    </div>
                    <div className="">
                      <p> Female With Disability</p>
                      <p className="text-stone-500">
                        {item?.femaleWithDisability}
                      </p>
                    </div>
                    <div className="">
                      <p> Male Adult</p>
                      <p className="text-stone-500">{item?.maleAdult}</p>
                    </div>
                    <div className="">
                      <p> Male Below 18</p>
                      <p className="text-stone-500">{item?.maleBelow18}</p>
                    </div>
                    <div className="">
                      <p> Male With Disability</p>
                      <p className="text-stone-500">
                        {item?.maleWithDisability}
                      </p>
                    </div>
                    <div className="">
                      <p> Guardian Phone</p>
                      <p className="text-stone-500">{item?.guardianPhone}</p>
                    </div>
                    <div className="">
                      <p> Guardian Country Of Origin</p>
                      <p className="text-stone-500">
                        {item?.guardianCountryOfOrigin}
                      </p>
                    </div>
                  </>
                );
              })}
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default Page;
