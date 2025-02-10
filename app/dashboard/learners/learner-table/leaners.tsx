"use client";

import Image from "next/image";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useThemeContext } from "@/lib/themeContext";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export interface learnerInterface {
  isWithDisability?: boolean;
  _id?: string;
  CTEFReceivedAtSA?: string;
  CTEFSerialNumber?: { serial: string }[];
  CTPaid?: number;
  accountabilityCTEFReceived?: string | null;
  accountabilityCTEFSerialNumber?: string;
  age?: number;
  attendance?: any[];
  class?: string;
  code?: string;
  correctionReason?: string;
  county10?: string;
  county28?: string;
  dateApproved?: string | null;
  dateCTPaid?: string;
  dateCollectedAtSchool?: string | null;
  dateCorrectedOnSSSAMS?: string | null;
  dateValidatedAtSchool?: string;
  disabilities?: { type: string }[];
  dob?: string;
  education?: string;
  eligible?: number;
  firstName?: string;
  form?: number;
  formstream?: number;
  gender?: string;
  houseHold?: { member: string }[];
  isAlpProgram?: { program: string }[];
  isDisbursed?: boolean;
  isDroppedOut?: boolean;
  isPending?: boolean;
  isPromoted?: boolean;
  isValidated?: string | null;
  lastName?: string;
  learnerUniqueID?: number;
  middleName?: string;
  over18?: number;
  payam10?: string;
  payam28?: string;
  pregnantOrNursing?: {
    pregnant: boolean;
    nursing: boolean;
    moredetails: string;
  };
  reference?: string;
  school?: string;
  signatureOnPaymentList?: number;
  state10?: string;
  state28?: string;
  stateName10?: string;
  stateName28?: string;
  uniqueReceived?: number;
  uniqueReceivedNewSchools?: number;
  uniqueReceivedP5Girls?: number;
  year?: number;
}

const LearnersTable = ({ learners }: { learners: learnerInterface[] }) => {
  const { themeColor } = useThemeContext();
  return (
    <Card className="p-4">
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex ">
        <div className="flex items-center justify-between space-y-2">
          <div className="space-y-2">
            <CardTitle>Learners</CardTitle>
            <CardDescription>Here&apos;s a list of learners.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={{
                pathname: "/dashboard/learners/new-learner",
                query: {
                  state: learners[0]?.state10 || "",
                  payam: learners[0]?.payam28 || "",
                  county: learners[0]?.county28 || "",
                  code: learners[0]?.code || "",
                  school: learners[0]?.school || "",
                  education: learners[0]?.education || "",
                },
              }}
            >
              <Button
                className={`${
                  themeColor === "Slate" ||
                  (themeColor === "Default" && "dark:text-black text-white")
                } text-white font-semibold`}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Learner
              </Button>
            </Link>
          </div>
        </div>
        <DataTable
          data={Array.isArray(learners) ? learners : []}
          columns={columns}
        />
      </div>
    </Card>
  );
};

export default LearnersTable;
