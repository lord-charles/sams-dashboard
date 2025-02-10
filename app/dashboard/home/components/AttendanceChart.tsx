"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart2Icon,
  Calendar as CalendarIcon,
  Download,
  MapPinIcon,
  RefreshCw,
  UsersIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const attendanceData = [
  { month: "Jan", male: 92, female: 88, total: 90 },
  { month: "Feb", male: 91, female: 89, total: 90 },
  { month: "Mar", male: 93, female: 90, total: 91.5 },
  { month: "Apr", male: 94, female: 91, total: 92.5 },
  { month: "May", male: 95, female: 92, total: 93.5 },
  { month: "Jun", male: 96, female: 93, total: 94.5 },
  { month: "Jul", male: 94, female: 92, total: 93 },
  { month: "Aug", male: 93, female: 91, total: 92 },
  { month: "Sep", male: 95, female: 93, total: 94 },
  { month: "Oct", male: 96, female: 94, total: 95 },
  { month: "Nov", male: 97, female: 95, total: 96 },
  { month: "Dec", male: 98, female: 96, total: 97 },
];

const stateAttendanceData = [
  {
    state: "Central Equatoria",
    attendance: 94,
    maleAttendance: 95,
    femaleAttendance: 93,
  },
  {
    state: "Eastern Equatoria",
    attendance: 91,
    maleAttendance: 92,
    femaleAttendance: 90,
  },
  {
    state: "Jonglei",
    attendance: 89,
    maleAttendance: 90,
    femaleAttendance: 88,
  },
  { state: "Lakes", attendance: 92, maleAttendance: 93, femaleAttendance: 91 },
  {
    state: "Northern Bahr el Ghazal",
    attendance: 90,
    maleAttendance: 91,
    femaleAttendance: 89,
  },
  { state: "Unity", attendance: 88, maleAttendance: 89, femaleAttendance: 87 },
  {
    state: "Upper Nile",
    attendance: 87,
    maleAttendance: 88,
    femaleAttendance: 86,
  },
  { state: "Warrap", attendance: 93, maleAttendance: 94, femaleAttendance: 92 },
  {
    state: "Western Bahr el Ghazal",
    attendance: 91,
    maleAttendance: 92,
    femaleAttendance: 90,
  },
  {
    state: "Western Equatoria",
    attendance: 95,
    maleAttendance: 96,
    femaleAttendance: 94,
  },
];

export default function AdvancedAttendanceChart() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const averageAttendance = useMemo(() => {
    const total = attendanceData.reduce((sum, item) => sum + item.total, 0);
    return (total / attendanceData.length).toFixed(1);
  }, []);

  const downloadCSV = useCallback(() => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Month,Male,Female,Total\n" +
      attendanceData
        .map((row) => `${row.month},${row.male},${row.female},${row.total}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    setIsLoading(true);
    setError(null);
    // Simulating data refresh with error handling
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        setIsRefreshing(false);
        setIsLoading(false);
      } else {
        setError("Failed to refresh data. Please try again.");
        setIsRefreshing(false);
        setIsLoading(false);
      }
    }, 1500);
  }, []);

  const genderComparisonData = useMemo(() => {
    const maleAvg =
      attendanceData.reduce((sum, d) => sum + d.male, 0) /
      attendanceData.length;
    const femaleAvg =
      attendanceData.reduce((sum, d) => sum + d.female, 0) /
      attendanceData.length;
    return [
      { name: "Male", value: maleAvg },
      { name: "Female", value: femaleAvg },
    ];
  }, [attendanceData]);

  return (
    <div className="w-full bg-gradient-to-b from-primary/20 to-background">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Attendance Statistics</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={downloadCSV}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={refreshData}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh Data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>
          Comprehensive analysis of student attendance patterns across South
          Sudan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-4 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Attendance
              </CardTitle>
              <Badge variant="secondary">{selectedYear}</Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{averageAttendance}%</div>
                  <p className="text-xs text-muted-foreground">
                    Across all students
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Male Attendance
              </CardTitle>
              <Badge variant="secondary">{selectedYear}</Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {attendanceData[attendanceData.length - 1].male}%
                  </div>
                  <p className="text-xs text-muted-foreground">Latest month</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Female Attendance
              </CardTitle>
              <Badge variant="secondary">{selectedYear}</Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {attendanceData[attendanceData.length - 1].female}%
                  </div>
                  <p className="text-xs text-muted-foreground">Latest month</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-2">
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-[200px]" />
                  <Skeleton className="h-[200px]" />
                  <Skeleton className="h-[200px]" />
                  <Skeleton className="h-[200px]" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Overall Statistics
                      </CardTitle>
                      <BarChart2Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                              Average Attendance
                            </div>
                            <div>{averageAttendance}%</div>
                          </div>
                          <Progress
                            value={parseFloat(averageAttendance)}
                            className="h-2"
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>Highest Monthly</div>
                          <div>
                            {Math.max(...attendanceData.map((d) => d.total))}%
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>Lowest Monthly</div>
                          <div>
                            {Math.min(...attendanceData.map((d) => d.total))}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Gender Comparison
                      </CardTitle>
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={genderComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Bar dataKey="value" fill="#8884d8">
                              {genderComparisonData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={index === 0 ? "#0088FE" : "#00C49F"}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <div>
                          Male: {genderComparisonData[0].value.toFixed(1)}%
                        </div>
                        <div>
                          Female: {genderComparisonData[1].value.toFixed(1)}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        State Performance
                      </CardTitle>
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <div className="flex items-center">
                                  <ArrowUpIcon className="mr-2 h-4 w-4 text-green-500" />
                                  <div className="text-sm font-medium">
                                    Highest Performing State
                                  </div>
                                </div>
                                <div className="font-bold">
                                  {
                                    stateAttendanceData.reduce((max, state) =>
                                      max.attendance > state.attendance
                                        ? max
                                        : state
                                    ).state
                                  }
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Attendance:{" "}
                                {
                                  stateAttendanceData.reduce((max, state) =>
                                    max.attendance > state.attendance
                                      ? max
                                      : state
                                  ).attendance
                                }
                                %
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <div className="flex items-center">
                                  <ArrowDownIcon className="mr-2 h-4 w-4 text-red-500" />
                                  <div className="text-sm font-medium">
                                    Lowest Performing State
                                  </div>
                                </div>
                                <div className="font-bold">
                                  {
                                    stateAttendanceData.reduce((min, state) =>
                                      min.attendance < state.attendance
                                        ? min
                                        : state
                                    ).state
                                  }
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Attendance:{" "}
                                {
                                  stateAttendanceData.reduce((min, state) =>
                                    min.attendance < state.attendance
                                      ? min
                                      : state
                                  ).attendance
                                }
                                %
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Attendance Distribution
                      </CardTitle>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <Skeleton className="h-64 w-64 rounded-full" />
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  {
                                    name: "Present",
                                    value: parseFloat(averageAttendance),
                                  },
                                  {
                                    name: "Absent",
                                    value: 100 - parseFloat(averageAttendance),
                                  },
                                ]}
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
                                <Cell fill="#4CAF50" />
                                <Cell fill="#FF5252" />
                              </Pie>
                              <RechartsTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>
                  Monthly attendance patterns and year-over-year comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="male"
                        stroke="#0088FE"
                        name="Male"
                      />
                      <Line
                        type="monotone"
                        dataKey="female"
                        stroke="#00C49F"
                        name="Female"
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        name="Total"
                      />
                      <RechartsTooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>
                  Detailed breakdown of attendance by gender
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderComparisonData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) =>
                            `${name}: ${value.toFixed(1)}%`
                          }
                        >
                          <Cell fill="#0088FE" />
                          <Cell fill="#00C49F" />
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {/* Add more demographic details here */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Regional Analysis</CardTitle>
                <CardDescription>
                  State-wise attendance distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stateAttendanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="state" type="category" width={150} />
                      <Legend />
                      <Bar dataKey="attendance" fill="#8884d8" name="Total" />
                      <Bar
                        dataKey="maleAttendance"
                        fill="#0088FE"
                        name="Male"
                      />
                      <Bar
                        dataKey="femaleAttendance"
                        fill="#00C49F"
                        name="Female"
                      />
                      <RechartsTooltip />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
}
