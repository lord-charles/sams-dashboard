"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import MapComponent from "../components/maps";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSchoolData, setEditedSchoolData] = useState(schoolInfo);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: session, status } = useSession();

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    // send the edited data to a server
    setIsEditMode(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedSchoolData((prev) => ({ ...prev, [name]: value }));
  };
  const hasValidCoordinates =
    typeof schoolInfo?.location?.gpsLat === "number" &&
    typeof schoolInfo?.location?.gpsLng === "number";

  return (
    <Card className="bg-gradient-to-b from-primary/20 to-background p-2 rounded-none">
      <ViewSchoolBreadcrumb schoolName={schoolInfo?.schoolName} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{schoolInfo?.schoolName}</h1>
        <div className="flex space-x-2">
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
        Update Enrollment Status
      </Button>
          <Badge variant="secondary">{schoolInfo?.schoolType}</Badge>
          {isEditMode ? (
            <Button onClick={handleSave}>Save Changes</Button>
          ) : (
            <Button onClick={handleEdit}>Edit School Info</Button>
          )}
        </div>
      </div>

      {/* statcards  */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <Input
                name="county28"
                value={editedSchoolData.county28}
                onChange={handleInputChange}
                className="mb-2"
              />
            ) : (
              <p className="text-2xl font-bold">{schoolInfo?.state10}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {schoolInfo?.county28} county, {schoolInfo?.payam28} payam
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ownership</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <Input
                name="schoolOwnerShip"
                value={editedSchoolData.schoolOwnerShip}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-2xl font-bold">
                {schoolInfo?.schoolOwnerShip}
              </p>
            )}
            <p className="text-xs text-muted-foreground">School Management</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">School Code</CardTitle>
            <IdCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{schoolInfo?.code || "N/A"}</p>
            <p className="text-xs text-muted-foreground">Unique Identifier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EMIS ID</CardTitle>
            <IdCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{schoolInfo?.emisId || "N/A"}</p>
            <p className="text-xs text-muted-foreground">Unique Identifier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">School Status</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {schoolInfo?.schoolStatus?.isOpen || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">
              {schoolInfo?.schoolStatus?.isOpen !== "Fully Functional"
                ? schoolInfo?.schoolStatus?.closeReason
                : "School Status"}
            </p>
          </CardContent>
        </Card>
      </div>
      <Separator className="mb-4" />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="overview">Overview</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="community">Community</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="academics">Academics</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="facilities">Facilities</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="programs">Programs</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="bog">BOG</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="grants">Grants</TabsTrigger>
          <TabsTrigger className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary" value="geolocation">Geolocation</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview schoolInfo={{
            _id: schoolInfo._id,
            name: schoolInfo.schoolName,
            code: schoolInfo.code,
            location: `${schoolInfo.county28}, ${schoolInfo.payam28}`,
            type: schoolInfo.schoolType,
            level: schoolInfo.schoolCategory,
            category: schoolInfo.schoolOwnerShip,
            isEnrollmentComplete: schoolInfo.isEnrollmentComplete
          }} />
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
        <TabsContent value="academics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { subject: "Math", score: 85 },
                  { subject: "Science", score: 78 },
                  { subject: "English", score: 92 },
                  { subject: "Social Studies", score: 88 },
                  { subject: "P.E.", score: 95 },
                ]}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: "Jan", attendance: 95 },
                  { month: "Feb", attendance: 97 },
                  { month: "Mar", attendance: 94 },
                  { month: "Apr", attendance: 98 },
                  { month: "May", attendance: 96 },
                  { month: "Jun", attendance: 93 },
                ]}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subjects Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schoolInfo.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="facilities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Facilities Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { name: "Classrooms", value: 80 },
                    { name: "Library", value: 60 },
                    { name: "Computer Lab", value: 40 },
                    { name: "Sports Field", value: 90 },
                    { name: "Water Source", value: 70 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Facilities"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* <div className="flex items-center justify-between">
                    <span className="font-medium">Classrooms</span>
                    <span>{schoolInfo.facilities.classrooms}</span>
                  </div> */}
                  {/* <div className="flex items-center justify-between">
                    <span className="font-medium">Library</span>
                    <Badge
                      variant={
                        schoolInfo.facilities.library
                          ? "default"
                          : "secondary"
                      }
                    >
                      {schoolInfo.facilities.library
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div> */}
                  {/* <div className="flex items-center justify-between">
                    <span className="font-medium">Computer Lab</span>
                    <Badge
                      variant={
                        schoolInfo.facilities.computerLab
                          ? "default"
                          : "secondary"
                      }
                    >
                      {schoolInfo.facilities.computerLab
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div> */}
                  {/* <div className="flex items-center justify-between">
                    <span className="font-medium">Science Lab</span>
                    <Badge
                      variant={
                        schoolInfo.facilities.scienceLab
                          ? "default"
                          : "secondary"
                      }
                    >
                      {schoolInfo.facilities.scienceLab
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div> */}
                  {/* <div className="flex items-center justify-between">
                    <span className="font-medium">Sports Field</span>
                    <Badge
                      variant={
                        schoolInfo.facilities.sportsField
                          ? "default"
                          : "secondary"
                      }
                    >
                      {schoolInfo.facilities.sportsField
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div> */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Water Source</span>
                    <span className="flex items-center">
                      <Droplet className="h-4 w-4 mr-2" />
                      {schoolInfo.facilities.hasCleanWater
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Electricity</span>
                    <span className="flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      {schoolInfo.facilities.hasInternet
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Internet Access</span>
                    <span className="flex items-center">
                      <Wifi className="h-4 w-4 mr-2" />
                      {schoolInfo.facilities.hasInternet
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Distance to Key Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Nearest Village</span>
                  <span>
                    {schoolInfo.location.distanceToNearestVillage} km
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nearest School</span>
                  <span>
                    {schoolInfo.location.distanceToNearestSchool} km
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nearest Bank</span>
                  <span>{schoolInfo.location.distanceToBank} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nearest Market</span>
                  <span>{schoolInfo.location.distanceToMarket} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nearest Camp</span>
                  <span>{schoolInfo.location.distanceToCamp} km</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Special Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold flex items-center text-lg mb-2">
                    <Utensils className="h-5 w-5 mr-2" />
                    Feeding Program
                  </h3>
                  <div className="pl-7 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {schoolInfo.feedingProgramme[0].isAvailable
                        ? "Available"
                        : "Not available"}
                    </p>
                    {schoolInfo.feedingProgramme[0].isAvailable && (
                      <>
                        <p className="text-sm">
                          <span className="font-medium">Provider:</span>{" "}
                          {
                            schoolInfo.feedingProgramme[0]
                              .organizationName
                          }
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Number of meals:</span>{" "}
                          {schoolInfo.feedingProgramme[0].numberOfMeals}{" "}
                          per day
                        </p>
                   
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center text-lg mb-2">
                    <Users className="h-5 w-5 mr-2" />
                    Mentoring Program
                  </h3>
                  <div className="pl-7 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {schoolInfo.mentoringProgramme[0].isAvailable
                        ? "Available"
                        : "Not available"}
                    </p>
                    {schoolInfo.mentoringProgramme[0].isAvailable && (
                      <div>
                        <p className="text-sm font-medium mb-1">Activities:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {schoolInfo.mentoringProgramme[0].activities.map(
                            (activity, index) => (
                              <li key={index}>{activity}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center text-lg mb-2">
                    <Radio className="h-5 w-5 mr-2" />
                    Radio Program
                  </h3>
                  <div className="pl-7 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {schoolInfo.radioCoverage.stations.length > 0
                        ? "Available"
                        : "Not available"}
                    </p>
                    {schoolInfo.radioCoverage.stations.length > 0 && (
                      <>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Available Stations:
                          </p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {schoolInfo.radioCoverage.stations.map(
                              (station, index) => (
                                <li key={index}>{station.name}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>School Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Academic Year: {schoolInfo.calendar.year}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {schoolInfo.calendar.terms.map((term, index) => (
                      <div key={index} className="bg-primary p-4 rounded-lg">
                        <p className="font-medium text-lg mb-2">
                          Term {index + 1}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Start:</span>{" "}
                          {term.startDate}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">End:</span>{" "}
                          {term.endDate}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Holidays</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {schoolInfo.calendar.holidays.map(
                      (holiday, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {holiday.holidayName}: {holiday.startDate}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bog" className="space-y-4">
          <BOG />
        </TabsContent>

        <TabsContent value="grants" className="space-y-4">
          <Grants schoolInfo={schoolInfo} />
        </TabsContent>

        <TabsContent value="geolocation" className="space-y-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Geolocation
                </CardTitle>
                <CardDescription>
                  Geographical information about the school&apos;s location
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasValidCoordinates ? (
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Coordinates</span>
                        </div>
                        <div className="pl-7">
                          <p className="text-sm text-muted-foreground">
                            Latitude: {schoolInfo.location.gpsLat.toFixed(6)}°
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Longitude: {schoolInfo.location.gpsLng.toFixed(6)}°
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mountain className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Elevation</span>
                        </div>
                        <p className="pl-7 text-sm text-muted-foreground">
                          {schoolInfo.location.gpsElev !== undefined
                            ? `${schoolInfo.location.gpsElev} meters`
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                    <div className="aspect-video w-full h-[400px] bg-muted rounded-lg overflow-hidden">
                      <MapComponent
                        gpsLat={schoolInfo.location.gpsLat}
                        gpsLng={schoolInfo.location.gpsLng}
                      />
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Coordinates Unavailable</AlertTitle>
                    <AlertDescription>
                      The exact geographical coordinates for this school are not
                      available. We&lsquo;re working on updating our records.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Proximity to Key Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "Nearest Village",
                      distance:
                        schoolInfo.location.distanceToNearestVillage,
                    },
                    {
                      name: "Nearest School",
                      distance:
                        schoolInfo.location.distanceToNearestSchool,
                    },
                    {
                      name: "Nearest Bank",
                      distance: schoolInfo.location.distanceToBank,
                    },
                    {
                      name: "Nearest Market",
                      distance: schoolInfo.location.distanceToMarket,
                    },
                    {
                      name: "Nearest Camp",
                      distance: schoolInfo.location.distanceToCamp,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="secondary">{item.distance} km</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Connectivity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Compass className="h-5 w-5 mr-2" />
                      Cellphone Coverage
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {Object.entries(schoolInfo.cellphoneCoverage).map(
                        ([provider, available]) => (
                          <Badge
                            key={provider}
                            variant={available ? "default" : "secondary"}
                          >
                            {provider}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  {schoolInfo.radioCoverage && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Compass className="h-5 w-5 mr-2" />
                        Radio Coverage
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {schoolInfo.radioCoverage.stations.length > 0
                          ? "Available"
                          : "Not available"}
                      </p>
                      {schoolInfo.radioCoverage.stations.length > 0 && (
                        <div className="pl-5 space-y-1">
                         
                          <p className="text-sm">
                            Stations:{" "}
                            {schoolInfo.radioCoverage.stations
                              .map((station) => station.name)
                              .join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <EnrollmentCompleteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} schoolId={schoolInfo._id} session={session} schoolInfo={schoolInfo}/>
    </Card>
  );
}
