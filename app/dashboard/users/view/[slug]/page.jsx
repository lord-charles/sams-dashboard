"use client";
import { Card, CardBody } from "@nextui-org/card";
import { Spinner } from "@nextui-org/react";
import React from "react";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Page = ({ params }) => {
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/user/users/get/${params?.slug}`,
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

  return (
    <Card className="mx-5">
      <CardBody>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="gap-5 grid sm:grid-cols-3 mt-6 text-sm">
            <div className="">
              <p> Teacher Code</p>
              <p className="text-stone-500">{data?.teacherCode}</p>
            </div>
            <div className="">
              <p> Name</p>
              <p className="text-stone-500">{`${data?.firstname} ${data?.lastname}`}</p>
            </div>
            <div className="">
              <p> Position</p>
              <p className="text-stone-500">{data?.position}</p>
            </div>

            <div className="">
              <p> Category</p>
              <p className="text-stone-500">{data?.category}</p>
            </div>
            <div className="">
              <p> Gender</p>
              <p className="text-stone-500">{data?.gender}</p>
            </div>
            <div className="">
              <p> Date of Birth</p>
              <p className="text-stone-500">
                {new Date(data?.dob)?.toLocaleString("en-us", options)}
              </p>
            </div>
            <div className="">
              <p> National Number</p>
              <p className="text-stone-500">{data?.nationalNo}</p>
            </div>
            <div className="">
              <p> Salary Grade</p>
              <p className="text-stone-500">{data?.salaryGrade}</p>
            </div>

            <div className="">
              <p> First Appointment</p>
              <p className="text-stone-500">{data?.firstAppointment}</p>
            </div>
            <div className="">
              <p> Country of Origin</p>
              <p className="text-stone-500">{data?.countryOfOrigin}</p>
            </div>
            <div className="">
              <p> Active</p>
              <p className="text-stone-500">{data?.active ? "Yes" : "No"}</p>
            </div>
            <div className="">
              <p> Work Status</p>
              <p className="text-stone-500">{data?.workStatus}</p>
            </div>

            <div className="">
              <p> Training Level</p>
              <p className="text-stone-500">{data?.trainingLevel}</p>
            </div>
            <div className="">
              <p> Professional Qualifications</p>
              <p className="text-stone-500">{data?.professionalQual}</p>
            </div>
            <div className="">
              <p> Refugee</p>
              <p className="text-stone-500">{data?.refugee ? "Yes" : "No"}</p>
            </div>
            <div className="">
              <p> Notes</p>
              <p className="text-stone-500">{data?.notes}</p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Page;
