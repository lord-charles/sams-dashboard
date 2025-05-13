"use client"

import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowUpDown, BarChart2Icon, Book, BookOpen, GraduationCap, LayoutDashboard, Map, School, Search, Users } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


export default function OverviewDashboard({
  data
}: {
  data: {
    overall: {
      total: number;
      male: number;
      female: number;
      maleWithDisability: number;
      femaleWithDisability: number;
    };
    byEducation: {
      SEC: {
        total: number;
        male: number;
        female: number;
        maleWithDisability: number;
        femaleWithDisability: number;
      };
      PRI: {
        total: number;
        male: number;
        female: number;
        maleWithDisability: number;
        femaleWithDisability: number;
      };
      ALP: {
        total: number;
        male: number;
        female: number;
        maleWithDisability: number;
        femaleWithDisability: number;
      };
    };
    totalSchools: number;
    states: {
      total: number;
      male: number;
      female: number;
      state: string;
      lwd: number;
      schools: number;
    }[];
  };
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string>("total")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Calculate percentages
  const calculatePercentage = (part: number, total: number) => {
    return ((part / total) * 100).toFixed(2)
  }

  // Sort states by total Learnerss
  const sortedStates = [...data.states].sort((a, b) => b.total - a.total)

  const topStates = sortedStates

  // State name mapping (for demonstration)
  const stateNames: Record<string, string> = {
    JGL: "Jonglei",
    CES: "Central Equatoria",
    EES: "Eastern Equatoria",
    UNS: "Upper Nile",
    WRP: "Western Region",
    NBG: "Northern Bahr el Ghazal",
    LKS: "Lakes",
    WES: "Western Equatoria",
    WBG: "Western Bahr el Ghazal",
    PAA: "Pibor Administrative Area",
    RAA: "Ruweng Administrative Area",
    UTY: "Unity",
    AAA: "Abyei Administrative Area",
  }


  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  // Sort and filter states for table
  const filteredAndSortedStates = [...data.states]
    .filter(
      (state) =>
        state.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stateNames[state.state] && stateNames[state.state].toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a] as number
      const bValue = b[sortColumn as keyof typeof b] as number

      if (sortDirection === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

  // Prepare data for gender distribution chart
  const genderData = [
    { name: "Male", value: data.overall.male, color: "#3b82f6" },
    { name: "Female", value: data.overall.female, color: "#ec4899" },
  ]

  // Prepare data for state chart
  const stateData = data.states.map((state) => ({
    name: state.state,
    fullName: stateNames[state.state] || state.state,
    total: state.total,
    male: state.male,
    female: state.female,
    lwd: state.lwd,
    schools: state.schools,
  }))


  return (
    <div className="">
      <Tabs defaultValue="dashboard" className="space-y-2">
        <TabsList className="grid grid-cols-5 h-16 mb-2 p-1 bg-muted/40 rounded-xl">
          <TabsTrigger
            value="dashboard"
            className="flex flex-col items-center justify-center space-y-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="alp"
            className="flex flex-col items-center justify-center space-y-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Book className="h-4 w-4" />
            <span className="text-xs">ALP</span>
          </TabsTrigger>
          <TabsTrigger
            value="pri"
            className="flex flex-col items-center justify-center space-y-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">Primary</span>
          </TabsTrigger>
          <TabsTrigger
            value="sec"
            className="flex flex-col items-center justify-center space-y-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="text-xs">Secondary</span>
          </TabsTrigger>
          <TabsTrigger
            value="states"
            className="flex flex-col items-center justify-center space-y-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Map className="h-4 w-4" />
            <span className="text-xs">States</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-2">
          {/* Overall Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 text-blue-600 dark:text-blue-300">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overall.total)}</div>
                <p className="text-xs text-muted-foreground">Across {formatNumber(data.totalSchools)} schools</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
                <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-2 text-pink-600 dark:text-pink-300">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculatePercentage(data.overall.female, data.overall.total)}% Female
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(data.overall.female)} female, {formatNumber(data.overall.male)} male
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learners with Disabilities</CardTitle>
                <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2 text-amber-600 dark:text-amber-300">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.overall.maleWithDisability + data.overall.femaleWithDisability)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(
                    data.overall.maleWithDisability + data.overall.femaleWithDisability,
                    data.overall.total,
                  )}
                  % of total Learners
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schools</CardTitle>
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 text-green-600 dark:text-green-300">
                  <School className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.totalSchools)}</div>
                <p className="text-xs text-muted-foreground">
                  Avg. {formatNumber(Math.round(data.overall.total / data.totalSchools))} Learners per school
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Education Level Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ALP Learners</CardTitle>
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2 text-purple-600 dark:text-purple-300">
                  <Book className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.byEducation.ALP.total)}</div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(data.byEducation.ALP.total, data.overall.total)}% of total Learners
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Primary Learners</CardTitle>
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2 text-indigo-600 dark:text-indigo-300">
                  <BookOpen className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.byEducation.PRI.total)}</div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(data.byEducation.PRI.total, data.overall.total)}% of total Learners
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Secondary Learners</CardTitle>
                <div className="rounded-full bg-teal-100 dark:bg-teal-900 p-2 text-teal-600 dark:text-teal-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.byEducation.SEC.total)}</div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(data.byEducation.SEC.total, data.overall.total)}% of total Learners
                </p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="topStates" className="space-y-2">

            {/* Charts & Top States Tabs (matching style) */}
            <TabsList className="grid grid-cols-2 h-14 mb-2 p-1 bg-muted/40 rounded-xl">
              <TabsTrigger
                value="topStates"
                className="flex flex-col items-center justify-center space-y-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {/* Map Lucide icon */}
                <Map className="h-4 w-4" />
                <span className="text-xs">Top States</span>
              </TabsTrigger>
              <TabsTrigger
                value="charts"
                className="flex flex-col items-center justify-center space-y-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {/* BarChart Lucide icon */}
                <BarChart2Icon className="h-4 w-4" />
                <span className="text-xs">Charts</span>
              </TabsTrigger>

            </TabsList>

            <TabsContent value="charts" className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Education Level Distribution</CardTitle>
                    <CardDescription>Learners distribution across education levels</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ChartContainer
                      config={{
                        alp: { label: "ALP", color: "hsl(265, 89%, 78%)" },
                        pri: { label: "Primary", color: "hsl(217, 91%, 60%)" },
                        sec: { label: "Secondary", color: "hsl(168, 84%, 67%)" },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "ALP", alp: data.byEducation.ALP.total },
                            { name: "Primary", pri: data.byEducation.PRI.total },
                            { name: "Secondary", sec: data.byEducation.SEC.total },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="alp" fill="var(--color-alp)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="pri" fill="var(--color-pri)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="sec" fill="var(--color-sec)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Gender Distribution</CardTitle>
                    <CardDescription>Male vs Female student distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatNumber(Number(value))} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="topStates" className="space-y-2">
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Learners Population By State</CardTitle>
                  <CardDescription>Distribution of Learners across all states</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topStates.map((state) => ({
                        ...state,
                        fullName: state.state,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="fullName" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatNumber(Number(value))}
                        labelFormatter={(label) => `State: ${label}`}
                      />
                      <Legend />
                      <Bar name="Total Learners" dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar name="Learners with Disabilities" dataKey="lwd" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </TabsContent>

        <TabsContent value="alp" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total ALP Learners</CardTitle>
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2 text-purple-600 dark:text-purple-300">
                  <Book className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.byEducation.ALP.total)}</div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(data.byEducation.ALP.total, data.overall.total)}% of all Learners
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ALP Gender Distribution</CardTitle>
                <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-2 text-pink-600 dark:text-pink-300">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculatePercentage(data.byEducation.ALP.female, data.byEducation.ALP.total)}% Female
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(data.byEducation.ALP.female)} female, {formatNumber(data.byEducation.ALP.male)} male
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ALP Learners with Disabilities</CardTitle>
                <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2 text-amber-600 dark:text-amber-300">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.byEducation.ALP.maleWithDisability + data.byEducation.ALP.femaleWithDisability)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(
                    data.byEducation.ALP.maleWithDisability + data.byEducation.ALP.femaleWithDisability,
                    data.byEducation.ALP.total,
                  )}
                  % of ALP Learners
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>ALP Gender Distribution</CardTitle>
              <CardDescription>Male vs Female Learners distribution in ALP</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Male", value: data.byEducation.ALP.male, color: "#3b82f6" },
                      { name: "Female", value: data.byEducation.ALP.female, color: "#ec4899" },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ec4899" />
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pri" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Primary Learners</CardTitle>
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2 text-indigo-600 dark:text-indigo-300">
                  <BookOpen className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.byEducation.PRI.total)}</div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(data.byEducation.PRI.total, data.overall.total)}% of all Learners
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Primary Gender Distribution</CardTitle>
                <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-2 text-pink-600 dark:text-pink-300">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculatePercentage(data.byEducation.PRI.female, data.byEducation.PRI.total)}% Female
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(data.byEducation.PRI.female)} female, {formatNumber(data.byEducation.PRI.male)} male
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Primary Learners with Disabilities</CardTitle>
                <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2 text-amber-600 dark:text-amber-300">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.byEducation.PRI.maleWithDisability + data.byEducation.PRI.femaleWithDisability)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(
                    data.byEducation.PRI.maleWithDisability + data.byEducation.PRI.femaleWithDisability,
                    data.byEducation.PRI.total,
                  )}
                  % of Primary Learners
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Primary Gender Distribution</CardTitle>
              <CardDescription>Male vs Female Learners distribution in Primary</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Male", value: data.byEducation.PRI.male, color: "#3b82f6" },
                      { name: "Female", value: data.byEducation.PRI.female, color: "#ec4899" },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ec4899" />
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sec" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Secondary Learners</CardTitle>
                <div className="rounded-full bg-teal-100 dark:bg-teal-900 p-2 text-teal-600 dark:text-teal-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.byEducation.SEC.total)}</div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(data.byEducation.SEC.total, data.overall.total)}% of all Learners
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Secondary Gender Distribution</CardTitle>
                <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-2 text-pink-600 dark:text-pink-300">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculatePercentage(data.byEducation.SEC.female, data.byEducation.SEC.total)}% Female
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(data.byEducation.SEC.female)} female, {formatNumber(data.byEducation.SEC.male)} male
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Secondary Learners with Disabilities</CardTitle>
                <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2 text-amber-600 dark:text-amber-300">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.byEducation.SEC.maleWithDisability + data.byEducation.SEC.femaleWithDisability)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {calculatePercentage(
                    data.byEducation.SEC.maleWithDisability + data.byEducation.SEC.femaleWithDisability,
                    data.byEducation.SEC.total,
                  )}
                  % of Secondary Learners
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Secondary Gender Distribution</CardTitle>
              <CardDescription>Male vs Female Learners distribution in Secondary</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Male", value: data.byEducation.SEC.male, color: "#3b82f6" },
                      { name: "Female", value: data.byEducation.SEC.female, color: "#ec4899" },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ec4899" />
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states" className="space-y-6">
          <Card className="p-2 bg-transparent">
            <Tabs defaultValue="table" className="space-y-2">
              <TabsList className="grid grid-cols-2 h-12 mb-4 p-1 bg-muted/40 rounded-xl">
                <TabsTrigger
                  value="table"
                  className="flex flex-col items-center justify-center space-y-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-xs">Table</span>
                </TabsTrigger>
                <TabsTrigger
                  value="charts"
                  className="flex flex-col items-center justify-center space-y-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <BarChart2Icon className="h-4 w-4" />
                  <span className="text-xs">Charts</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="table" className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">State Statistics</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search states..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Card className="border-none shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                                  <span>State</span>
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handleSort("state")}>Sort by State Code</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableHead>
                          <TableHead>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                                  <span>Total Learners</span>
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handleSort("total")}>Sort by Total Learners</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableHead>
                          <TableHead>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                                  <span>Male</span>
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handleSort("male")}>Sort by Male Learners</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableHead>
                          <TableHead>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                                  <span>Female</span>
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handleSort("female")}>Sort by Female Learners</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableHead>
                          <TableHead>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                                  <span>Disabilities</span>
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handleSort("lwd")}>Sort by Learners with Disabilities</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableHead>
                          <TableHead>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                                  <span>Schools</span>
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handleSort("schools")}>Sort by Number of Schools</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableHead>
                          <TableHead className="text-right">Learners per School</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedStates.map((state) => (
                          <TableRow key={state.state} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <Badge variant="outline" className="w-fit mb-1">
                                  {state.state}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{stateNames[state.state] || "Unknown"}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatNumber(state.total)}</TableCell>
                            <TableCell>{formatNumber(state.male)}</TableCell>
                            <TableCell>{formatNumber(state.female)}</TableCell>
                            <TableCell>{formatNumber(state.lwd)}</TableCell>
                            <TableCell>{formatNumber(state.schools)}</TableCell>
                            <TableCell className="text-right">
                              {formatNumber(Math.round(state.total / state.schools))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="charts" className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>State Distribution</CardTitle>
                      <CardDescription>Learners distribution across states</CardDescription>
                    </CardHeader>
                    <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                          <XAxis type="number" />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            interval={0}
                            tick={({ x, y, payload }) => (
                              <text x={x} y={y} dy={4} textAnchor="end" fontSize={12} >
                                {payload.value}
                              </text>
                            )}
                          />
                          <Tooltip
                            formatter={(value) => formatNumber(Number(value))}
                            labelFormatter={(label) => `State: ${stateNames[label] || label}`}
                          />
                          <Legend />
                          <Bar name="Total Learners" dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>Learners with Disabilities by State</CardTitle>
                      <CardDescription>Distribution of Learners with disabilities</CardDescription>
                    </CardHeader>
                    <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                          <XAxis type="number" />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            interval={0}
                            tick={({ x, y, payload }) => (
                              <text x={x} y={y} dy={4} textAnchor="end" fontSize={12} >
                                {payload.value}
                              </text>
                            )}
                          />
                          <Tooltip
                            formatter={(value) => formatNumber(Number(value))}
                            labelFormatter={(label) => `State: ${stateNames[label] || label}`}
                          />
                          <Legend />
                          <Bar name="Learners with Disabilities" dataKey="lwd" fill="#ec4899" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
