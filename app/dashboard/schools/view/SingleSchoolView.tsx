"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Radio,
  CreditCard,
  Calendar,
  Building,
  Utensils,
  MessageSquare,
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
  PieChart,
  Pie,
  Cell,
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
import { schoolDataInterface } from "../school-table/schools";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Improved dummy data
const schoolData = {
  _id: { $oid: "dummy_id" },
  code: "BUD",
  county28: "Juba",
  payam28: "Juba",
  state10: "Central Equatoria",
  schoolName: "Buluk Model Primary School",
  schoolOwnerShip: "Community",
  schoolType: "PRI",
  pta: { name: "John Doe", phoneNumber: "+211 928 123 456" },
  location: {
    gpsLng: 31.5825,
    gpsLat: 4.8517,
    gpsElev: 550,
    distanceToNearestVillage: 2,
    distanceToNearestSchool: 5,
    distanceToBank: 10,
    distanceToMarket: 3,
    distanceToCamp: 15,
  },
  subjects: [
    "Mathematics",
    "English",
    "Science",
    "Social Studies",
    "Physical Education",
    "Art",
    "Local Language",
    "Religious Education",
  ],
  mentoringProgramme: [
    {
      isAvailable: true,
      activities: [
        "Peer Tutoring",
        "Career Guidance",
        "Life Skills Training",
        "Academic Counseling",
      ],
    },
  ],
  feedingProgramme: [
    {
      name: "School Lunch Program",
      organizationalName: "World Food Programme",
      numberOfMeals: "1",
      kindStaff: "Volunteers",
      isAvailable: true,
      beneficiaries: 450,
      daysPerWeek: 5,
    },
  ],
  emisId: "PRI-000235",
  radioCoverage: {
    stations: ["Radio Miraya", "Eye Radio", "Capital FM"],
    programme: true,
    programmeGroup: "Educational Broadcasts",
    weeklyBroadcastHours: 10,
  },
  cellphoneCoverage: {
    vivacel: true,
    mtn: true,
    zain: true,
    gemtel: false,
    other: false,
  },
  operation: {
    boarding: false,
    daySchool: true,
    dayBoarding: false,
    feePaid: true,
    feeAmount: 500,
  },
  calendar: {
    year: 2024,
    terms: [
      { startDate: "2024-01-15", endDate: "2024-04-05" },
      { startDate: "2024-05-06", endDate: "2024-08-16" },
      { startDate: "2024-09-09", endDate: "2024-12-13" },
    ],
    holidays: [
      { date: "2024-05-01", name: "Labour Day" },
      { date: "2024-07-09", name: "Independence Day" },
      { date: "2024-12-25", name: "Christmas Day" },
    ],
  },
  bankDetails: {
    bankName: "Ivory Bank",
    accountName: "BULUK MODEL PRIMARY SCHOOL",
    accountNumber: "1615",
  },
  facilities: {
    classrooms: 12,
    library: true,
    computerLab: true,
    scienceLab: false,
    sportsField: true,
    waterSource: "Borehole",
    electricity: "Solar",
    internetAccess: true,
  },
  staffing: {
    teachers: 20,
    adminStaff: 5,
    supportStaff: 8,
    studentTeacherRatio: 25,
  },
  enrollment: {
    totalStudents: 500,
    maleStudents: 260,
    femaleStudents: 240,
    specialNeedsStudents: 15,
  },
  performanceHistory: [
    { year: 2020, averageScore: 68 },
    { year: 2021, averageScore: 72 },
    { year: 2022, averageScore: 75 },
    { year: 2023, averageScore: 79 },
  ],
};
const enrollmentData = [
  { name: "Male", value: schoolData.enrollment.maleStudents },
  { name: "Female", value: schoolData.enrollment.femaleStudents },
];

const performanceData = [
  { subject: "Math", score: 85 },
  { subject: "Science", score: 78 },
  { subject: "English", score: 92 },
  { subject: "Social Studies", score: 88 },
  { subject: "P.E.", score: 95 },
];

const attendanceData = [
  { month: "Jan", attendance: 95 },
  { month: "Feb", attendance: 97 },
  { month: "Mar", attendance: 94 },
  { month: "Apr", attendance: 98 },
  { month: "May", attendance: 96 },
  { month: "Jun", attendance: 93 },
];

const facilitiesData = [
  { name: "Classrooms", value: 80 },
  { name: "Library", value: 60 },
  { name: "Computer Lab", value: 40 },
  { name: "Sports Field", value: 90 },
  { name: "Water Source", value: 70 },
];

export default function SingleSchoolView({
  schoolInfo,
}: {
  schoolInfo: schoolDataInterface;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSchoolData, setEditedSchoolData] = useState(schoolData);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    // Here you would typically send the edited data to a server
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
    <Card className="bg-gradient-to-b from-primary/20 to-background p-6">
      <ViewSchoolBreadcrumb schoolName={schoolInfo?.schoolName} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{schoolInfo?.schoolName}</h1>
        <div className="flex space-x-2">
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
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="bog">BOG</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="geolocation">Geolocation</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="community" className="space-y-4">
          <Community
            code={schoolInfo?.code || ""}
            state10={schoolInfo?.state10 || ""}
            payam28={schoolInfo?.payam28 || ""}
            county28={schoolInfo?.county28 || ""}
            school={schoolInfo?.schoolName || ""}
            education={schoolInfo?.schoolType || ""}
            schoolData={schoolData}
            enrollmentData={enrollmentData}
          />
        </TabsContent>
        <TabsContent value="academics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
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
                <LineChart data={attendanceData}>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {editedSchoolData.subjects.map((subject, index) => (
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
                  <RadarChart data={facilitiesData}>
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
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Classrooms</span>
                    <span>{editedSchoolData.facilities.classrooms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Library</span>
                    <Badge
                      variant={
                        editedSchoolData.facilities.library
                          ? "default"
                          : "secondary"
                      }
                    >
                      {editedSchoolData.facilities.library
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Computer Lab</span>
                    <Badge
                      variant={
                        editedSchoolData.facilities.computerLab
                          ? "default"
                          : "secondary"
                      }
                    >
                      {editedSchoolData.facilities.computerLab
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Science Lab</span>
                    <Badge
                      variant={
                        editedSchoolData.facilities.scienceLab
                          ? "default"
                          : "secondary"
                      }
                    >
                      {editedSchoolData.facilities.scienceLab
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sports Field</span>
                    <Badge
                      variant={
                        editedSchoolData.facilities.sportsField
                          ? "default"
                          : "secondary"
                      }
                    >
                      {editedSchoolData.facilities.sportsField
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Water Source</span>
                    <span className="flex items-center">
                      <Droplet className="h-4 w-4 mr-2" />
                      {editedSchoolData.facilities.waterSource}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Electricity</span>
                    <span className="flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      {editedSchoolData.facilities.electricity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Internet Access</span>
                    <span className="flex items-center">
                      <Wifi className="h-4 w-4 mr-2" />
                      {editedSchoolData.facilities.internetAccess
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
                    {editedSchoolData.location.distanceToNearestVillage} km
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nearest School</span>
                  <span>
                    {editedSchoolData.location.distanceToNearestSchool} km
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nearest Bank</span>
                  <span>{editedSchoolData.location.distanceToBank} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nearest Market</span>
                  <span>{editedSchoolData.location.distanceToMarket} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nearest Camp</span>
                  <span>{editedSchoolData.location.distanceToCamp} km</span>
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
                      {editedSchoolData.feedingProgramme[0].isAvailable
                        ? "Available"
                        : "Not available"}
                    </p>
                    {editedSchoolData.feedingProgramme[0].isAvailable && (
                      <>
                        <p className="text-sm">
                          <span className="font-medium">Provider:</span>{" "}
                          {
                            editedSchoolData.feedingProgramme[0]
                              .organizationalName
                          }
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Number of meals:</span>{" "}
                          {editedSchoolData.feedingProgramme[0].numberOfMeals}{" "}
                          per day
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Beneficiaries:</span>{" "}
                          {editedSchoolData.feedingProgramme[0].beneficiaries}{" "}
                          students
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Frequency:</span>{" "}
                          {editedSchoolData.feedingProgramme[0].daysPerWeek}{" "}
                          days per week
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
                      {editedSchoolData.mentoringProgramme[0].isAvailable
                        ? "Available"
                        : "Not available"}
                    </p>
                    {editedSchoolData.mentoringProgramme[0].isAvailable && (
                      <div>
                        <p className="text-sm font-medium mb-1">Activities:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {editedSchoolData.mentoringProgramme[0].activities.map(
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
                      {editedSchoolData.radioCoverage.programme
                        ? "Available"
                        : "Not available"}
                    </p>
                    {editedSchoolData.radioCoverage.programme && (
                      <>
                        <p className="text-sm">
                          <span className="font-medium">Program Group:</span>{" "}
                          {editedSchoolData.radioCoverage.programmeGroup}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">
                            Weekly Broadcast Hours:
                          </span>{" "}
                          {editedSchoolData.radioCoverage.weeklyBroadcastHours}
                        </p>
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Available Stations:
                          </p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {editedSchoolData.radioCoverage.stations.map(
                              (station, index) => (
                                <li key={index}>{station}</li>
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
                    Academic Year: {editedSchoolData.calendar.year}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {editedSchoolData.calendar.terms.map((term, index) => (
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
                    {editedSchoolData.calendar.holidays.map(
                      (holiday, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {holiday.name}: {holiday.date}
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
                        editedSchoolData.location.distanceToNearestVillage,
                    },
                    {
                      name: "Nearest School",
                      distance:
                        editedSchoolData.location.distanceToNearestSchool,
                    },
                    {
                      name: "Nearest Bank",
                      distance: editedSchoolData.location.distanceToBank,
                    },
                    {
                      name: "Nearest Market",
                      distance: editedSchoolData.location.distanceToMarket,
                    },
                    {
                      name: "Nearest Camp",
                      distance: editedSchoolData.location.distanceToCamp,
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
                      {Object.entries(editedSchoolData.cellphoneCoverage).map(
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
                  {editedSchoolData.radioCoverage && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Compass className="h-5 w-5 mr-2" />
                        Radio Coverage
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {editedSchoolData.radioCoverage.programme
                          ? "Available"
                          : "Not available"}
                      </p>
                      {editedSchoolData.radioCoverage.programme && (
                        <div className="pl-5 space-y-1">
                          <p className="text-sm">
                            Program Group:{" "}
                            {editedSchoolData.radioCoverage.programmeGroup}
                          </p>
                          <p className="text-sm">
                            Stations:{" "}
                            {editedSchoolData.radioCoverage.stations.join(", ")}
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
    </Card>
  );
}
