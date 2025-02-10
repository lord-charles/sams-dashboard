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
import { UserX, Search, UserPlus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NoTeachersAvailable({
  fetchData,
  state10,
  payam28,
  county28,
  school,
  code,
}: {
  fetchData: () => void;
  state10: string;
  payam28: string;
  county28: string;
  school: string;
  code: string;
}) {
  const router = useRouter();
  return (
    <Card className="w-full justify-center items-center flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          No Teachers Available
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <UserX className="h-24 w-24 text-muted-foreground" />
        </div>
        <Alert>
          <AlertTitle className="text-lg font-semibold">Information</AlertTitle>
          <AlertDescription>
            There are currently no teachers assigned to this school. This could
            be due to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Recent staff changes or transfers</li>
              <li>Ongoing recruitment process</li>
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
      <CardFooter className="flex justify-center space-x-4">
        <Link
          href={{
            pathname: "/dashboard/teachers/new-teacher",
            query: {
              state: state10,
              payam: payam28,
              county: county28,
              code: code,
              school: school,
            },
          }}
        >
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => {
              router.push("/dashboard/teachers/add");
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Teacher
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => {
            fetchData();
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </CardFooter>
    </Card>
  );
}
