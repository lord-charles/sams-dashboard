"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip as ChartTooltip,
} from "recharts";
import {
  Calendar,
  Download,
  Info,
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  School,
} from "lucide-react";

// Enhanced mock data with 2022 data added
const ageDistributionData = {
  2023: {
    SEC: [
      { age: "11-12", count: 3000, percentage: 5 },
      { age: "13-14", count: 12000, percentage: 20 },
      { age: "15-16", count: 24000, percentage: 40 },
      { age: "17-18", count: 15000, percentage: 25 },
      { age: "19+", count: 6000, percentage: 10 },
    ],
    PRI: [
      { age: "5-6", count: 15000, percentage: 10 },
      { age: "7-8", count: 30000, percentage: 20 },
      { age: "9-10", count: 45000, percentage: 30 },
      { age: "11-12", count: 37500, percentage: 25 },
      { age: "13-14", count: 15000, percentage: 10 },
      { age: "15+", count: 7500, percentage: 5 },
    ],
    // ...other school types
  },
  2022: {
    SEC: [
      { age: "11-12", count: 3500, percentage: 6 },
      { age: "13-14", count: 11000, percentage: 18 },
      { age: "15-16", count: 23000, percentage: 38 },
      { age: "17-18", count: 16000, percentage: 27 },
      { age: "19+", count: 7000, percentage: 11 },
    ],
    PRI: [
      { age: "5-6", count: 16000, percentage: 12 },
      { age: "7-8", count: 28000, percentage: 22 },
      { age: "9-10", count: 43000, percentage: 34 },
      { age: "11-12", count: 36000, percentage: 28 },
      { age: "13-14", count: 14000, percentage: 4 },
    ],
    // ...other school types
  },
};

const genderData = {
  2023: { SEC: { male: 52, female: 48 }, PRI: { male: 51, female: 49 } },
  2022: { SEC: { male: 53, female: 47 }, PRI: { male: 52, female: 48 } },
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];



export default function AdvancedPupilAgeDistribution() {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedSchoolType, setSelectedSchoolType] =
    useState("PRI");
  const [chartType, setChartType] = useState("bar");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareYear, setCompareYear] = useState(2022);

  const currentData = useMemo(
    () => ageDistributionData[selectedYear][selectedSchoolType],
    [selectedYear, selectedSchoolType]
  );

  const compareData = useMemo(
    () => ageDistributionData[compareYear][selectedSchoolType],
    [compareYear, selectedSchoolType]
  );

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Number of Pupils" />
              <Bar dataKey="percentage" fill="#8884d8" name="Percentage" />
              {comparisonMode && (
                <Bar
                  dataKey="count"
                  data={compareData}
                  fill="#ff8084"
                  name={`Comparison (${compareYear})`}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              <Line type="monotone" dataKey="percentage" stroke="#8884d8" />
              {comparisonMode && (
                <Line
                  type="monotone"
                  dataKey="count"
                  data={compareData}
                  stroke="#ff8084"
                  name={`Comparison (${compareYear})`}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentData}
                dataKey="percentage"
                outerRadius={80}
                label
              >
                {currentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case "radar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={currentData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="age" />
              <PolarRadiusAxis />
              <Radar
                dataKey="percentage"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <ChartTooltip />
            </RadarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-8 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Learners Age Distribution Analysis
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive insights into age demographics across various
            educational programs with advanced data comparisons.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                Age Distribution Visualization
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[100px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedSchoolType}
                  onValueChange={setSelectedSchoolType}
                >
                  <SelectTrigger className="w-[150px]">
                    <School className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="School Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRI">Primary</SelectItem>
                    <SelectItem value="SEC">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              Compare and analyze age distributions by year, school type, and
              other key demographics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">{renderChart()}</div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <Button
                  variant={chartType === "bar" ? "solid" : "outline"}
                  onClick={() => setChartType("bar")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" /> Bar Chart
                </Button>
                <Button
                  variant={chartType === "line" ? "solid" : "outline"}
                  onClick={() => setChartType("line")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" /> Line Chart
                </Button>
                <Button
                  variant={chartType === "pie" ? "solid" : "outline"}
                  onClick={() => setChartType("pie")}
                >
                  <PieChartIcon className="w-4 h-4 mr-2" /> Pie Chart
                </Button>
                <Button
                  variant={chartType === "radar" ? "solid" : "outline"}
                  onClick={() => setChartType("radar")}
                >
                  <Activity className="w-4 h-4 mr-2" /> Radar Chart
                </Button>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" /> Export Data
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Export the age distribution data for offline analysis.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Comparison Mode */}
            <div className="mt-4">
              <Button
                variant={comparisonMode ? "solid" : "outline"}
                onClick={() => setComparisonMode(!comparisonMode)}
              >
                {comparisonMode ? "Disable" : "Enable"} Comparison Mode
              </Button>
              {comparisonMode && (
                <div className="flex mt-4 space-x-4">
                  <Select value={compareYear} onValueChange={setCompareYear}>
                    <SelectTrigger className="w-[100px]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Compare Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
