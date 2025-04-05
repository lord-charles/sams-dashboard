"use client";

import { useState } from "react";
import { Edit, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface EnrollmentComplete {
  year: number;
  isComplete: boolean;
  completedBy: string;
  comments: string;
  percentageComplete: number;
  _id: string;
}

interface schoolDataInterface {
  _id: string;
  name: string;
  code: string;
  location: string;
  type: string;
  level: string;
  category: string;
  isEnrollmentComplete?: EnrollmentComplete[];
}

interface HeadTeacher {
  name: string;
  email: string;
  phoneNumber: string;
  qualifications: string;
  yearsOfExperience: number;
}

interface SchoolData {
  headTeacher: HeadTeacher;
  pta: { name: string; phoneNumber: string };
  radioCoverage: {
    stations: string[];
    programme: boolean;
    programmeGroup: string;
    weeklyBroadcastHours: number;
  };
  cellphoneCoverage: {
    vivacel: boolean;
    mtn: boolean;
    zain: boolean;
    gemtel: boolean;
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
    terms: { startDate: string; endDate: string }[];
    holidays: { date: string; name: string }[];
  };
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  performanceHistory: { year: number; averageScore: number }[];
}

const initialSchoolData: SchoolData = {
  headTeacher: {
    name: "Jane Smith",
    email: "jane.smith@school.edu",
    phoneNumber: "+211 928 987 654",
    qualifications: "Ph.D. in Education, M.Ed.",
    yearsOfExperience: 15,
  },
  pta: { name: "John Doe", phoneNumber: "+211 928 123 456" },
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
  performanceHistory: [
    { year: 2020, averageScore: 68 },
    { year: 2021, averageScore: 72 },
    { year: 2022, averageScore: 75 },
    { year: 2023, averageScore: 79 },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const enrollmentData = [
  { name: "Male", value: 300 },
  { name: "Female", value: 280 },
];

export function Overview({ schoolInfo }: { schoolInfo: schoolDataInterface }) {
  const [schoolData, setSchoolData] = useState<SchoolData>(initialSchoolData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (
    section: keyof SchoolData,
    field: string,
    value: any
  ) => {
    setSchoolData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Updated data:", schoolData);
    // Here you would typically send the updated data to your API
  };

  const renderHeadTeacherInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Head Teacher Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ht-name">Name</Label>
            <Input
              id="ht-name"
              value={schoolData.headTeacher.name}
              onChange={(e) =>
                handleInputChange("headTeacher", "name", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ht-email">Email</Label>
            <Input
              id="ht-email"
              type="email"
              value={schoolData.headTeacher.email}
              onChange={(e) =>
                handleInputChange("headTeacher", "email", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ht-phone">Phone Number</Label>
            <Input
              id="ht-phone"
              value={schoolData.headTeacher.phoneNumber}
              onChange={(e) =>
                handleInputChange("headTeacher", "phoneNumber", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ht-experience">Years of Experience</Label>
            <Input
              id="ht-experience"
              type="number"
              value={schoolData.headTeacher.yearsOfExperience}
              onChange={(e) =>
                handleInputChange(
                  "headTeacher",
                  "yearsOfExperience",
                  parseInt(e.target.value)
                )
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ht-qualifications">Qualifications</Label>
            <Input
              id="ht-qualifications"
              value={schoolData.headTeacher.qualifications}
              onChange={(e) =>
                handleInputChange(
                  "headTeacher",
                  "qualifications",
                  e.target.value
                )
              }
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPTAInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>PTA Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pta-name">PTA Name</Label>
            <Input
              id="pta-name"
              value={schoolData.pta.name}
              onChange={(e) => handleInputChange("pta", "name", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pta-phone">PTA Phone Number</Label>
            <Input
              id="pta-phone"
              value={schoolData.pta.phoneNumber}
              onChange={(e) =>
                handleInputChange("pta", "phoneNumber", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSchoolOperation = () => (
    <Card>
      <CardHeader>
        <CardTitle>School Operation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(schoolData.operation).map(
              ([key, value]) =>
                key !== "feeAmount" && (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={`operation-${key}`}
                      checked={value as boolean}
                      onCheckedChange={(checked) =>
                        handleInputChange("operation", key, checked)
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor={`operation-${key}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Label>
                  </div>
                )
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee-amount">Fee Amount</Label>
            <Input
              id="fee-amount"
              type="number"
              value={schoolData.operation.feeAmount}
              onChange={(e) =>
                handleInputChange(
                  "operation",
                  "feeAmount",
                  parseInt(e.target.value)
                )
              }
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBankDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              value={schoolData.bankDetails.bankName}
              onChange={(e) =>
                handleInputChange("bankDetails", "bankName", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-name">Account Name</Label>
            <Input
              id="account-name"
              value={schoolData.bankDetails.accountName}
              onChange={(e) =>
                handleInputChange("bankDetails", "accountName", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-number">Account Number</Label>
            <Input
              id="account-number"
              value={schoolData.bankDetails.accountNumber}
              onChange={(e) =>
                handleInputChange(
                  "bankDetails",
                  "accountNumber",
                  e.target.value
                )
              }
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">School Information</h1>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
          {isEditing ? (
            <Save className="mr-2 h-4 w-4" />
          ) : (
            <Edit className="mr-2 h-4 w-4" />
          )}
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <Tabs defaultValue="academic" className="space-y-4">
        <TabsList className="h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
          <TabsTrigger className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent" value="academic">Academic</TabsTrigger>
          <TabsTrigger className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent" value="general">General Info</TabsTrigger>
          <TabsTrigger className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent" value="bank">Bank Details</TabsTrigger>
          <TabsTrigger className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent" value="enrollment">Enrollment History</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          {renderHeadTeacherInfo()}
          {renderPTAInfo()}
          {renderSchoolOperation()}
        </TabsContent>
        <TabsContent value="academic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enrollmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {enrollmentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance History</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={schoolData.performanceHistory}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          {/* {renderSchoolCalendar()} */}
        </TabsContent>
        <TabsContent value="bank" className="space-y-4">
          {renderBankDetails()}
        </TabsContent>
        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Enrollment Completion History</span>
                <Badge
                  variant={
                    schoolInfo?.isEnrollmentComplete?.some(
                      (e: EnrollmentComplete) =>
                        e.year === new Date().getFullYear() && e.isComplete
                    )
                      ? "default"
                      : "destructive"
                  }
                >
                  {schoolInfo?.isEnrollmentComplete?.some(
                    (e: EnrollmentComplete) =>
                      e.year === new Date().getFullYear() && e.isComplete
                  )
                    ? "Current Year Complete"
                    : "Current Year Incomplete"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {schoolInfo?.isEnrollmentComplete
                  ?.sort(
                    (a: EnrollmentComplete, b: EnrollmentComplete) =>
                      b.year - a.year
                  )
                  .map((enrollment: EnrollmentComplete, index: number) => (
                    <div key={enrollment._id} className="relative flex">
                      {/* Timeline connector */}
                      {index !== (schoolInfo?.isEnrollmentComplete?.length || 0) - 1 && (
                        <div className="absolute top-8 left-4 h-full w-0.5 bg-muted" />
                      )}
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 w-8 h-8 rounded-full border-4 ${
                          enrollment.isComplete
                            ? "bg-green-100 border-green-500"
                            : "bg-red-100 border-red-500"
                        } flex items-center justify-center`}
                      >
                        {enrollment.isComplete ? "✓" : "×"}
                      </div>
                      {/* Content */}
                      <div className="ml-12 pb-8 w-full">
                        <div className="bg-card w-full rounded-lg border p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold">
                              Year {enrollment.year}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={enrollment.percentageComplete}
                                className="w-24"
                              />
                              <span className="text-sm text-muted-foreground">
                                {enrollment.percentageComplete}%
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Completed by: {enrollment.completedBy}
                          </p>
                          {enrollment.comments && (
                            <div className="mt-2 text-sm bg-muted p-2 rounded">
                              <span className="font-medium">Comments:</span>{" "}
                              {enrollment.comments}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {(!schoolInfo?.isEnrollmentComplete ||
                  schoolInfo.isEnrollmentComplete.length === 0) && (
                  <div className="text-center text-muted-foreground py-8">
                    No enrollment completion records found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
