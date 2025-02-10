"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  School,
  CheckCircle,
  Calendar,
  Building,
  BookOpen,
  Accessibility,
  DollarSign,
  Users,
} from "lucide-react";

interface StatsCardsProps {
  data: {
    totalSchools: { value: number };
    totalLearners: { value: number; male: number; female: number };
    totalAmountDisbursed: { value: number; currency: string };
    accountabilityRate: { value: number; unit: string };
    learnersWithDisabilities: {
      value: number;
      percentageOfTotalLearners: number;
      male: number;
      female: number;
    };
    averageAttendance: { value: number; unit: string };
    publicSchools: { value: number; percentageOfTotalSchools: number };
    latestTranche: { trancheNumber: number; startDate: string | null };
  };
}

export function StatsCards({ data }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
          <School className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalSchools.value.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalLearners.value.toLocaleString()}</div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              ({data.totalLearners.male.toLocaleString()} M, {data.totalLearners.female.toLocaleString()} F)
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Amount Disbursed
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalAmountDisbursed.value.toLocaleString()} {data.totalAmountDisbursed.currency}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Accountability Rate
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.accountabilityRate.value}{data.accountabilityRate.unit}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Learners with Disabilities
          </CardTitle>
          <Accessibility className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.learnersWithDisabilities.value.toLocaleString()}</div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {data.learnersWithDisabilities.percentageOfTotalLearners}% of total learners
            </p>
            <p className="text-xs text-muted-foreground">
              ({data.learnersWithDisabilities.male.toLocaleString()} M, {data.learnersWithDisabilities.female.toLocaleString()} F)
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Attendance
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.averageAttendance.value}{data.averageAttendance.unit}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Public Schools</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.publicSchools.value.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {data.publicSchools.percentageOfTotalSchools}% of total schools
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Tranche</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Tranche {data.latestTranche.trancheNumber}</div>
          {data.latestTranche.startDate && (
            <p className="text-xs text-muted-foreground">
              Started: {new Date(data.latestTranche.startDate).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
