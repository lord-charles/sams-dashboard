"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  Search,
  UserPlus,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NoLearnersAvailable({
  state10,
  payam28,
  county28,
  code,
  school,
  education,
}: {
  state10: string;
  payam28: string;
  county28: string;
  code: string;
  school: string;
  education: string;
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          No Learners Enrolled
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Users className="h-24 w-24 text-muted-foreground" />
        </div>
        <Alert>
          <AlertTitle className="text-lg font-semibold">Information</AlertTitle>
          <AlertDescription>
            There are currently no learners enrolled in this school. This could
            be due to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>New school year not yet started</li>
              <li>Recent administrative changes</li>
              <li>Ongoing enrollment process</li>
              <li>Data synchronization issues</li>
            </ul>
          </AlertDescription>
        </Alert>
        <div className="text-center text-muted-foreground">
          <p>
            If you believe this is an error, please try refreshing the page or
            contact the system administrator.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center gap-4">
        <Link
          href={{
            pathname: "/dashboard/learners/new-learner",
            query: {
              state: state10 || "",
              payam: payam28 || "",
              county: county28 || "",
              code: code || "",
              school: school || "",
              education: education || "",
            },
          }}
        >
          <Button variant="outline" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Enroll New Learner
          </Button>
        </Link>
        <Button variant="outline" className="flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </CardFooter>
    </Card>
  );
}
