//

"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  Download,
  Info,
  Eye,
  FileSpreadsheet,
  FileText,
  FileJson,
} from "lucide-react";

// Enhanced sample data for the rollout
const rolloutData = [
  {
    name: "County Rollout",
    progress: 98,
    details: "79 of 81 Counties reported, only 2 counties remaining",
    targetDate: "2024-12-01",
  },
  {
    name: "School Discovery",
    progress: 97,
    details: "280 schools closed, 5915 still active, all scheduled by Q1 2025",
    targetDate: "2025-03-01",
  },
  {
    name: "EMIS 2014 Mapping",
    progress: 26,
    details: "2489 schools mapped, 75% still remaining, goal by Q4 2025",
    targetDate: "2025-10-01",
  },
  {
    name: "School Set up",
    progress: 63,
    details: "5915 schools set up, 4500 more expected by next quarter",
    targetDate: "2025-06-01",
  },
  {
    name: "School Data Entry",
    progress: 93,
    details: "1,166,003 learners entered, 83138 pending, closing end of 2024",
    targetDate: "2024-12-31",
  },
];

// Enhanced data for model links
const dataLinksInfo = [
  { year: "2023 End", model10: true, model3: true, model28: true },
  { year: "2022 End", model10: true, model3: false, model28: false },
  { year: "2021 End", model10: true, model3: false, model28: true },
  { year: "2020 End", model10: true, model3: true, model28: true },
  { year: "2019 End", model10: false, model3: false, model28: false },
];

// Advanced colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function ProjectStatus() {
  const [activeTab, setActiveTab] = useState("rollout");

  const renderProgressDetails = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {rolloutData.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{item.name}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="text-lg">
                    {item.progress}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{`Target Date: ${item.targetDate}`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress value={item.progress} className="h-3" />
          <p className="text-sm text-muted-foreground">{item.details}</p>
        </div>
      ))}
    </div>
  );

  const renderCompletionChart = () => {
    const totalProgress =
      rolloutData.reduce((acc, curr) => acc + curr.progress, 0) /
      rolloutData.length;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { name: "Completed", value: totalProgress },
              { name: "Remaining", value: 100 - totalProgress },
            ]}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            dataKey="value"
          >
            <Cell fill="#00C49F" />
            <Cell fill="#FF8042" />
          </Pie>
          <RechartsTooltip formatter={(value) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderDataLinksTable = () => (
    <ScrollArea className="h-[400px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>10 State Model</TableHead>
            <TableHead>3 Region Model</TableHead>
            <TableHead>28 State Model</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataLinksInfo.map((row, index) => (
            <TableRow
              key={index}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{row.year}</TableCell>
              <TableCell>
                {row.model10 ? (
                  <DataButton />
                ) : (
                  <Badge variant="outline">No data</Badge>
                )}
              </TableCell>
              <TableCell>
                {row.model3 ? (
                  <DataButton />
                ) : (
                  <Badge variant="outline">No data</Badge>
                )}
              </TableCell>
              <TableCell>
                {row.model28 ? (
                  <DataButton />
                ) : (
                  <Badge variant="outline">No data</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );

  const DataButton = () => (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
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
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              TSV
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download TSV</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download JSON</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <section className="py-8 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground py-4 text-center">
          Project Status
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="rollout">Rollout Progress</TabsTrigger>
            <TabsTrigger value="completion">Completion Stats</TabsTrigger>
            <TabsTrigger value="data-links">Data Links</TabsTrigger>
          </TabsList>

          <TabsContent value="rollout">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Detailed Rollout Progress</CardTitle>
                <CardDescription>
                  An overview of the progress for various projects, including
                  counties, schools, and data entry.
                </CardDescription>
              </CardHeader>
              <CardContent>{renderProgressDetails()}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completion">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Completion Stats</CardTitle>
                <CardDescription>
                  Overall completion status of the rollout programs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">{renderCompletionChart()}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-links">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Data Links</CardTitle>
                <CardDescription>
                  Access various data models for review and download.
                </CardDescription>
              </CardHeader>
              <CardContent>{renderDataLinksTable()}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
