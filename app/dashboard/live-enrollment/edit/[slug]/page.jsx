"use client";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Page = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/data-set/2023_data/students/${params?.slug}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const user = Object.fromEntries(formData.entries());
    user.houseHold = [
      {
        femaleAdult: user.femaleAdult,
        femaleBelow18: user.femaleBelow18,
        femaleWithDisability: user.femaleWithDisability,
        guardianCountryOfOrigin: user.guardianCountryOfOrigin,
        guardianPhone: user.guardianPhone,
        maleAdult: user.maleAdult,
        maleBelow18: user.maleBelow18,
        maleWithDisability: user.maleWithDisability,
      },
    ];
    delete user.femaleAdult;
    delete user.femaleBelow18;
    delete user.femaleWithDisability;
    delete user.guardianCountryOfOrigin;
    delete user.guardianPhone;
    delete user.maleAdult;
    delete user.maleBelow18;
    delete user.maleWithDisability;
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/data-set/2023_data/students/${params?.slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      const message = await result.json();
      if (result.ok) {
        toast.success("Student updated successfully!");
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        toast.error(message?.error);
      }
    } catch (error) {
      toast.error("Unknown error! Please contact System Administrator.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Card className="mx-5">
        <CardBody>
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <form onSubmit={onSubmit}>
                <h4 className="font-bold mt-3 text-primary">General Details</h4>
                <div className="gap-5 grid sm:grid-cols-3 text-sm">
                  <Input
                    autoFocus
                    label="First Name"
                    name="firstName"
                    defaultValue={data?.firstName}
                    placeholder="Enter first name"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Last Name"
                    name="lastName"
                    defaultValue={data?.lastName}
                    placeholder="Enter last name"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Middle Name"
                    name="middleName"
                    defaultValue={data?.middleName}
                    placeholder="Enter middle name"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Date of birth"
                    name="dob"
                    type="date"
                    defaultValue={
                      data?.dob ? data.dob.split("/").reverse().join("-") : ""
                    }
                    placeholder="Enter date of birth"
                    variant="bordered"
                    isRequired
                  />
                  <Select
                    variant="bordered"
                    label="Select gender"
                    isRequired
                    placeholder="Select gender"
                    name="gender"
                    defaultSelectedKeys={[data?.gender]}
                  >
                    <SelectItem key={"F"} textValue={"Female"}>
                      Female
                    </SelectItem>
                    <SelectItem key={"M"} textValue={"Male"}>
                      Male
                    </SelectItem>
                  </Select>
                </div>
                <h4 className="font-bold mt-3 text-primary">HouseHold</h4>
                <div className="gap-5 grid sm:grid-cols-3 text-sm">
                  <Input
                    autoFocus
                    label="Female Adult"
                    name="femaleAdult"
                    defaultValue={data?.houseHold[0]?.femaleAdult}
                    placeholder="Female Adult"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Female Below 18"
                    name="femaleBelow18"
                    defaultValue={data?.houseHold[0]?.femaleBelow18}
                    placeholder="Female Below 18"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Female With Disability"
                    name="femaleWithDisability"
                    defaultValue={data?.houseHold[0]?.femaleWithDisability}
                    placeholder="Female With Disability"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Male Adult"
                    name="maleAdult"
                    defaultValue={data?.houseHold[0]?.maleAdult}
                    placeholder="Male Adult"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Male Below 18"
                    name="maleBelow18"
                    defaultValue={data?.houseHold[0]?.maleBelow18}
                    placeholder="Male Below 18"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Male With Disability"
                    name="maleWithDisability"
                    defaultValue={data?.houseHold[0]?.maleWithDisability}
                    placeholder="Male With Disability"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Guardian Phone"
                    name="guardianPhone"
                    type="tel"
                    defaultValue={data?.houseHold[0]?.guardianPhone}
                    placeholder="Guardian Phone"
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    autoFocus
                    label="Guardian Country Of Origin"
                    name="guardianCountryOfOrigin"
                    defaultValue={data?.houseHold[0]?.guardianCountryOfOrigin}
                    placeholder="Guardian Country Of Origin"
                    variant="bordered"
                    isRequired
                  />
                </div>
                <div className="flex justify-end items-center">
                  <Button type="submit" isLoading={loading} color="primary">
                    Submit
                  </Button>
                </div>
              </form>
              <ToastContainer />
            </>
          )}
        </CardBody>
      </Card>
      <ToastContainer />
    </>
  );
};

export default Page;
