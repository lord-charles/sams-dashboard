"use client";

import { useState } from "react";
import { Edit, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function Overview() {
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

  const renderRadioCoverage = () => (
    <Card>
      <CardHeader>
        <CardTitle>Radio Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="radio-stations">Radio Stations</Label>
            <Input
              id="radio-stations"
              value={schoolData.radioCoverage.stations.join(", ")}
              onChange={(e) =>
                handleInputChange(
                  "radioCoverage",
                  "stations",
                  e.target.value.split(", ")
                )
              }
              disabled={!isEditing}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="radio-programme"
              checked={schoolData.radioCoverage.programme}
              onCheckedChange={(checked) =>
                handleInputChange("radioCoverage", "programme", checked)
              }
              disabled={!isEditing}
            />
            <Label htmlFor="radio-programme">Has Radio Programme</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="programme-group">Programme Group</Label>
            <Input
              id="programme-group"
              value={schoolData.radioCoverage.programmeGroup}
              onChange={(e) =>
                handleInputChange(
                  "radioCoverage",
                  "programmeGroup",
                  e.target.value
                )
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="broadcast-hours">Weekly Broadcast Hours</Label>
            <Input
              id="broadcast-hours"
              type="number"
              value={schoolData.radioCoverage.weeklyBroadcastHours}
              onChange={(e) =>
                handleInputChange(
                  "radioCoverage",
                  "weeklyBroadcastHours",
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

  const renderCellphoneCoverage = () => (
    <Card>
      <CardHeader>
        <CardTitle>Cellphone Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(schoolData.cellphoneCoverage).map(
            ([provider, covered]) => (
              <div key={provider} className="flex items-center space-x-2">
                <Switch
                  id={`cellphone-${provider}`}
                  checked={covered}
                  onCheckedChange={(checked) =>
                    handleInputChange("cellphoneCoverage", provider, checked)
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor={`cellphone-${provider}`}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </Label>
              </div>
            )
          )}
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

  const renderSchoolCalendar = () => (
    <Card>
      <CardHeader>
        <CardTitle>School Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calendar-year">Year</Label>
            <Input
              id="calendar-year"
              type="number"
              value={schoolData.calendar.year}
              onChange={(e) =>
                handleInputChange("calendar", "year", parseInt(e.target.value))
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>Terms</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolData.calendar.terms.map((term, index) => (
                  <TableRow key={index}>
                    <TableCell>Term {index + 1}</TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={term.startDate}
                        onChange={(e) => {
                          const newTerms = [...schoolData.calendar.terms];
                          newTerms[index].startDate = e.target.value;
                        }}
                        disabled={!isEditing}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={term.endDate}
                        onChange={(e) => {
                          const newTerms = [...schoolData.calendar.terms];
                          newTerms[index].endDate = e.target.value;
                          handleInputChange("calendar", "terms", newTerms);
                        }}
                        disabled={!isEditing}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-2">
            <Label>Holidays</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Holiday Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolData.calendar.holidays.map((holiday, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        type="date"
                        value={holiday.date}
                        onChange={(e) => {
                          const newHolidays = [...schoolData.calendar.holidays];
                          newHolidays[index].date = e.target.value;
                          handleInputChange(
                            "calendar",
                            "holidays",
                            newHolidays
                          );
                        }}
                        disabled={!isEditing}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={holiday.name}
                        onChange={(e) => {
                          const newHolidays = [...schoolData.calendar.holidays];
                          newHolidays[index].name = e.target.value;
                          handleInputChange(
                            "calendar",
                            "holidays",
                            newHolidays
                          );
                        }}
                        disabled={!isEditing}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
