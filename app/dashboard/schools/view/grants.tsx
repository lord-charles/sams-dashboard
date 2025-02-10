"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface GrantsProps {
  schoolInfo: {
    bankDetails: {
      bankName: string;
      accountName: string;
    };
    schoolStatus: {
      isOpen: string;
    };
    code: string;
    payam28: string;
    state10: string;
    county28: string;
    schoolName: string;
    schoolOwnerShip: string;
    schoolType: string;
    emisId: string;
  };
}

const Grants = ({ schoolInfo }: GrantsProps) => {
  const router = useRouter();

  const handleCreateBudget = () => {
    // Store school info in localStorage or state management
    localStorage.setItem("selectedSchool", JSON.stringify(schoolInfo));

    // Navigate to budget creation page
    router.push("/dashboard/grants/sbrts/budgets/create");
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">School Grants</h2>
          <Button onClick={handleCreateBudget}>Create Budget</Button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">School Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">School Name</p>
              <p>{schoolInfo.schoolName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">EMIS ID</p>
              <p>{schoolInfo.emisId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bank Name</p>
              <p>{schoolInfo.bankDetails.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Name</p>
              <p>{schoolInfo.bankDetails.accountName}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Grants;
