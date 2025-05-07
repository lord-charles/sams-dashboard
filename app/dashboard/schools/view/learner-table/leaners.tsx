"use client";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const position = searchParams.get('position');

  // Convert position from camelCase to Title Case with spaces
  const formattedPosition = position
    ? position.replace(/([A-Z])/g, ' $1').trim()
    : '';

  return (
    <Card className="p-4">
      {position && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700">
            To appoint a {formattedPosition}, click the <strong>Actions</strong> button on a learner&apos;s row and select <strong>&quot;Appoint&quot;</strong>
          </p>
        </div>
      )}
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
                className={`text-white font-semibold`}
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
