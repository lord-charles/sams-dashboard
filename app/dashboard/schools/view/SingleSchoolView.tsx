"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  Radio,
  Calendar,
  Building,
  Utensils,
  Wifi,
  Droplet,
  Zap,
  MapPin,
  AlertTriangle,
  Compass,
  Mountain,
  Info,
  IdCard,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,

  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

import { Separator } from "@/components/ui/separator";
import { ViewSchoolBreadcrumb } from "../components/view-school-breadcrumb";
import MapComponent from "./maps";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Community from "./community";
import BOG from "./bog";
import { Overview } from "./overview";
import Grants from "./grants";
import { EnrollmentCompleteModal } from "../components/enrollment-complete-modal";
import { useSession } from "next-auth/react";
import { SchoolSubjects } from "./school-subjects";
import { SchoolFacilities } from "./school-facilities";
import { SchoolPrograms } from "./school-programs";
import { SchoolLocationConnectivity } from "./school-location-connectivity";
import SchoolStats from "./school-stats";

interface SchoolDataInterface {
  _id: string;
  code: string;
  county28: string;
  payam28: string;
  state10: string;
  schoolName: string;
  schoolOwnerShip: string;
  schoolType: string;
  headTeacher: {
    name: string;
    phoneNumber: string;
  };
  pta: {
    name: string;
  };
  reporter: {
    name: string;
    phoneNumber: string;
  };
  location: {
    gpsLng: number;
    gpsLat: number;
    gpsElev: number;
    distanceToNearestVillage: number;
    distanceToNearestSchool: number;
    distanceToBank: number;
    distanceToMarket: number;
    distanceToCamp: number;
  };
  subjects: string[];
  mentoringProgramme: Array<{
    isAvailable: boolean;
    activities: string[];
  }>;
  feedingProgramme: Array<{
    name: string;
    organizationName: string;
    numberOfMeals: number;
    kindStaff: string;
    isAvailable: boolean;
  }>;
  emisId: string;
  radioCoverage: {
    stations: Array<{
      _id: string;
      name: string;
      isActive: boolean;
    }>;
  };
  cellphoneCoverage: {
    vivacel: boolean;
    mtn: boolean;
    zain: boolean;
    gemtel: boolean;
    digitel: boolean;
    other: boolean;
  };
  operation: {
    boarding: boolean;
    daySchool: boolean;
    dayBoarding: boolean;
    feePaid: boolean;
    feeAmount: number;
  };
  calendar: {
    year: number;
    terms: Array<{
      _id: string;
      termNumber: number;
      startDate: string;
      endDate: string;
    }>;
    holidays: Array<{
      _id: string;
      holidayName: string;
      startDate: string;
      endDate: string;
    }>;
  };
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: number;
    bankBranch: string;
  };
  facilities: {
    hasKitchen: boolean;
    hasFoodStorage: boolean;
    hasTextbookStorage: boolean;
    hasCleanWater: boolean;
    hasInternet: boolean;
    hasRecreationalActivities: boolean;
  };
  schoolStatus: {
    isOpen: string;
    closeReason: string;
    closedDate: string | null;
  };
  schoolCategory: string;
  lastVisited: Array<{
    _id: string;
    date: string;
    byWho: string;
    comments: string;
  }>;
  isEnrollmentComplete: Array<{
    year: number;
    isComplete: boolean;
    completedBy: string;
    comments: string;
    percentageComplete: number;
    learnerEnrollmentComplete: boolean;
    _id: string;
  }>;
  updatedAt: string;
}

export default function SingleSchoolView({
  schoolInfo,
}: {
  schoolInfo: SchoolDataInterface;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();

  // Get tab from URL or default to "overview"
  const tab = searchParams.get("tab") || "overview";

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Card className="bg-gradient-to-b from-primary/20 to-background p-1 rounded-none">
      {/* statcards  */}
      <SchoolStats schoolData={schoolInfo} setIsModalOpen={setIsModalOpen} />
      <Separator className="mb-4" />

      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList className="h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="overview">Overview</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="community">Community</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="academics">Academics</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="facilities">Facilities</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="programs">Programs</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="bog">BOG</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="geolocation">Geolocation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Overview schoolInfo={schoolInfo} />
        </TabsContent>
        <TabsContent value="community" className="space-y-4">
          <Community
            code={schoolInfo?.code || ""}
            state10={schoolInfo?.state10 || ""}
            payam28={schoolInfo?.payam28 || ""}
            county28={schoolInfo?.county28 || ""}
            school={schoolInfo?.schoolName || ""}
            education={schoolInfo?.schoolType || ""}
            schoolData={schoolInfo}
          />
        </TabsContent>
        <TabsContent value="academics">
          <SchoolSubjects schoolInfo={schoolInfo} />
        </TabsContent>
        <TabsContent value="facilities">
          <SchoolFacilities schoolInfo={schoolInfo} />
        </TabsContent>
        <TabsContent value="programs">
          <SchoolPrograms schoolInfo={schoolInfo} />
        </TabsContent>
        <TabsContent value="bog">
          <BOG code={schoolInfo.code} _id={schoolInfo._id} />
        </TabsContent>
        <TabsContent value="geolocation">
          <SchoolLocationConnectivity schoolInfo={schoolInfo} />
        </TabsContent>
      </Tabs>
      <EnrollmentCompleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schoolId={schoolInfo._id}
        session={session}
        schoolInfo={schoolInfo}
      />
    </Card>
  );
}
