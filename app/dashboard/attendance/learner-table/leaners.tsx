"use client";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, PlusCircle } from "lucide-react";
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

const LearnersTable = ({ learners, setShowLearners, setSelectedIds, selectedIds, markStudentsAbsent, setLearners }: { learners: learnerInterface[]; setShowLearners: (show: boolean) => void; setSelectedIds?: (ids: string[]) => void; selectedIds?: string[]; markStudentsAbsent?: (reason: string) => void; setLearners:any }) => {

  // Check if all learners have attendance unmarked
  const allAttendanceUnmarked = Array.isArray(learners) && learners.length > 0 && learners.every(l => !l.attendance || l.attendance === null || (Array.isArray(l.attendance) && l.attendance.length === 0));

  return (
    <Card className="p-4">
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex ">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => { setShowLearners(false), setLearners([]) }}
              className="text-white font-semibold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <CardTitle>Learners</CardTitle>
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
        {allAttendanceUnmarked && (
          <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-200 p-4 text-yellow-800 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Attendance for this class has not been marked today.
          </div>
        )}
        <DataTable
          data={Array.isArray(learners) ? learners : []}
          columns={columns}
          setSelectedIds={setSelectedIds}
          selectedIds={selectedIds}
          markStudentsAbsent={markStudentsAbsent}
        />
      </div>
    </Card>
  );
};

export default LearnersTable;
