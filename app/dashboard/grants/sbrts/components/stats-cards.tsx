"use client";

import { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { School, CheckCircle, CreditCard, AlertCircle } from "lucide-react";
import { DashboardContext } from "../contexts/dashboard-context";

export function StatsCards() {
  const { selectedYear, selectedSchoolType } = useContext(DashboardContext);

  const stats = {
    totalSchools: 529,
    schoolsApproved: 256,
    schoolsPaid: 46,
    pendingReview: 227,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
          <School className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSchools}</div>
          <p className="text-xs text-muted-foreground">
            {selectedSchoolType} in {selectedYear}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Schools Approved
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.schoolsApproved}</div>
          <p className="text-xs text-muted-foreground">Budgets Approved</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Schools Paid</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.schoolsPaid}</div>
          <p className="text-xs text-muted-foreground">Funds Disbursed</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingReview}</div>
          <p className="text-xs text-muted-foreground">Awaiting Approval</p>
        </CardContent>
      </Card>
    </div>
  );
}
