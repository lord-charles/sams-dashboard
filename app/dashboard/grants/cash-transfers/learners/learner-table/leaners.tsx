"use client";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export interface learnerInterface {
  _id: string;
  tranche: number;
  learner: {
    name: {
      firstName: string;
      middleName?: string;
      lastName: string;
    };
    learnerUniqueID: number;
    reference: string;
    classInfo: {
      class: string;
      classStream?: string;
    };
    gender: string;
    attendance: number;
  };
  amounts: {
    approved: {
      amount: number;
      currency: string;
    };
    paid?: {
      amount: number;
      currency: string;
    };
  };
  approval?: {
    paymentMethod?: string;
    paymentThroughDetails?: {
      bankName?: string;
      mobileMoneyName?: string;
      contactAtBank?: string;
    };
  };
  accountability: {
    // dateReceivedBySA: string;
    // signedCtef: string;
    amountAccounted: number;
    dateAccounted: string;
  };
  year: number;
  state10: string;
  county28: string;
  payam28: string;
  schoolName: string;
  schoolType: string;
  schoolOwnership: string;
  code: string;
  hasDisability: string;
}

const LearnersTable = ({ learners }: { learners: learnerInterface[] }) => {
  return (
    <Card className="p-4">
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex ">
        <div className="flex items-center justify-between space-y-2">
          <div className="space-y-2">
            <CardTitle>Learners</CardTitle>
            <CardDescription>Here&apos;s a list of learners.</CardDescription>
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
