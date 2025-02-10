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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { Download, Filter, Info, RefreshCw, Settings } from "lucide-react";

const enrollmentData = [
  { year: 2020, male: 150000, female: 140000, total: 290000 },
  { year: 2021, male: 155000, female: 148000, total: 303000 },
  { year: 2022, male: 162000, female: 157000, total: 319000 },
  { year: 2023, male: 170000, female: 168000, total: 338000 },
  { year: 2024, male: 180000, female: 179000, total: 359000 },
];

const stateData = [
  {
    state: "Central Equatoria",
    enrollment: 75000,
    malePercentage: 52,
    femalePercentage: 48,
  },
  {
    state: "Eastern Equatoria",
    enrollment: 45000,
    malePercentage: 54,
    femalePercentage: 46,
  },
  {
    state: "Jonglei",
    enrollment: 55000,
    malePercentage: 53,
    femalePercentage: 47,
  },
  {
    state: "Lakes",
    enrollment: 40000,
    malePercentage: 51,
    femalePercentage: 49,
  },
  {
    state: "Northern Bahr el Ghazal",
    enrollment: 50000,
    malePercentage: 52,
    femalePercentage: 48,
  },
  {
    state: "Unity",
    enrollment: 35000,
    malePercentage: 53,
    femalePercentage: 47,
  },
  {
    state: "Upper Nile",
    enrollment: 48000,
    malePercentage: 52,
    femalePercentage: 48,
  },
  {
    state: "Warrap",
    enrollment: 42000,
    malePercentage: 51,
    femalePercentage: 49,
  },
  {
    state: "Western Bahr el Ghazal",
    enrollment: 38000,
    malePercentage: 52,
    femalePercentage: 48,
  },
  {
    state: "Western Equatoria",
    enrollment: 41000,
    malePercentage: 53,
    femalePercentage: 47,
  },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#8DD1E1",
  "#A4DE6C",
  "#D0ED57",
];

export default function EnrollmentChartComponent() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedChart, setSelectedChart] = useState("bar");
  const [filterValue, setFilterValue] = useState("");
  const [enrollmentRange, setEnrollmentRange] = useState([0, 100000]);
  const [showPercentage, setShowPercentage] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredStateData = useMemo(() => {
    return stateData.filter(
      (item) =>
        item.state.toLowerCase().includes(filterValue.toLowerCase()) &&
        item.enrollment >= enrollmentRange[0] &&
        item.enrollment <= enrollmentRange[1]
    );
  }, [filterValue, enrollmentRange]);

  const selectedYearData = enrollmentData.find(
    (d) => d.year.toString() === selectedYear
  );

  const downloadCSV = useCallback(() => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Year,Male,Female,Total\n" +
      enrollmentData
        .map((row) => `${row.year},${row.male},${row.female},${row.total}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enrollment_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    // Simulating data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  return (
    <Card className="w-full bg-gradient-to-b from-primary/20 to-background">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Enrollment Statistics</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {enrollmentData.map((d) => (
                  <SelectItem key={d.year} value={d.year.toString()}>
                    {d.year}
                  </SelectItem>
                ))}
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
          Analysis of enrollment trends across years and states in South Sudan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="states">States</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Enrollment
                  </CardTitle>
                  <Badge variant="secondary">{selectedYear}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedYearData?.total.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedYearData?.total &&
                    enrollmentData[enrollmentData.length - 2]?.total
                      ? (
                          (selectedYearData.total /
                            enrollmentData[enrollmentData.length - 2].total -
                            1) *
                          100
                        ).toFixed(1)
                      : "N/A"}
                    % from last year
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Male Students
                  </CardTitle>
                  <Badge variant="secondary">{selectedYear}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedYearData?.male.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedYearData
                      ? (
                          (selectedYearData.male / selectedYearData.total) *
                          100
                        ).toFixed(1)
                      : "N/A"}
                    % of total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Female Students
                  </CardTitle>
                  <Badge variant="secondary">{selectedYear}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedYearData?.female.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedYearData?.female && selectedYearData?.total
                      ? (
                          (selectedYearData.female / selectedYearData.total) *
                          100
                        ).toFixed(1)
                      : "N/A"}
                    % of total
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Male", value: selectedYearData?.male },
                          { name: "Female", value: selectedYearData?.female },
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
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant={selectedChart === "bar" ? "secondary" : "outline"}
                    onClick={() => setSelectedChart("bar")}
                  >
                    Bar
                  </Button>
                  <Button
                    variant={selectedChart === "line" ? "secondary" : "outline"}
                    onClick={() => setSelectedChart("line")}
                  >
                    Line
                  </Button>
                  <Button
                    variant={selectedChart === "area" ? "secondary" : "outline"}
                    onClick={() => setSelectedChart("area")}
                  >
                    Area
                  </Button>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          Chart Settings
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Customize the chart display options.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-percentage">
                            Show Percentage
                          </Label>
                          <Switch
                            id="show-percentage"
                            checked={showPercentage}
                            onCheckedChange={setShowPercentage}
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <>
                        {selectedChart === "bar" && (
                          <BarChart data={enrollmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="male" fill="#0088FE" name="Male" />
                            <Bar
                              dataKey="female"
                              fill="#00C49F"
                              name="Female"
                            />
                          </BarChart>
                        )}
                        {selectedChart === "line" && (
                          <LineChart data={enrollmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <RechartsTooltip />
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
                              stroke="#FFBB28"
                              name="Total"
                            />
                          </LineChart>
                        )}
                        {selectedChart === "area" && (
                          <AreaChart data={enrollmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="male"
                              stackId="1"
                              stroke="#0088FE"
                              fill="#0088FE"
                              name="Male"
                            />
                            <Area
                              type="monotone"
                              dataKey="female"
                              stackId="1"
                              stroke="#00C49F"
                              fill="#00C49F"
                              name="Female"
                            />
                          </AreaChart>
                        )}
                      </>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="states">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Filter states..."
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="max-w-sm"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter states by name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          Enrollment Range
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Set the min and max enrollment to display
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="width">Range</Label>
                          <Input
                            id="width"
                            defaultValue={enrollmentRange[0]}
                            className="col-span-2 h-8"
                          />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="max">Max</Label>
                          <Input
                            id="max"
                            defaultValue={enrollmentRange[1]}
                            className="col-span-2 h-8"
                          />
                        </div>
                      </div>
                    </div>
                    <Slider
                      max={100000}
                      step={1000}
                      value={enrollmentRange}
                      onValueChange={setEnrollmentRange}
                      className="mt-6"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment by State</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredStateData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="state" type="category" width={150} />
                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background p-2 border rounded shadow-sm">
                                  <p className="font-bold">{data.state}</p>
                                  <p>
                                    Enrollment:{" "}
                                    {data.enrollment.toLocaleString()}
                                  </p>
                                  <p>Male: {data.malePercentage}%</p>
                                  <p>Female: {data.femalePercentage}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="enrollment" fill="#8884d8">
                          {filteredStateData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
