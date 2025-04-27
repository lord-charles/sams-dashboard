"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { BarChart3, Download, Globe, Search, TrendingUp, Users, X } from 'lucide-react'
import StateSummary from "./state-summary"

// Define types for our data structure
interface StateDetailItem {
  modifiedBy?: string
  totalEnrolled: number
  totalDropped: number
  totalSchools: number
  uniquePayam28: string[]
  uniqueCounty28: string[]
}

interface StateData {
  _id: string
  state10Details: StateDetailItem[]
  stats: {
    [year: string]: number
  }
}

export default function StatesDashboard({ data = [], enrollmentData }: { data?: StateData[]; enrollmentData?: any }) {
  const [activeState, setActiveState] = useState<string>(data.length > 0 ? data[0]._id : "AAA")
  const [searchTerm, setSearchTerm] = useState("")
// --- AGGREGATION LOGIC ---
// Group enrollmentData by state10
const enrollmentByState = useMemo(() => {
  if (!Array.isArray(enrollmentData)) return {};
  const grouped: Record<string, any> = {};
  enrollmentData?.filter(
    (school: any) => school.isEnrollmentComplete.some((e: any) => e.learnerEnrollmentComplete)
  ).forEach((school: any) => {
    const state = school.state10 || 'Unknown';
    if (!grouped[state]) {
      grouped[state] = {
        state,
        schools: 0,
        counties: new Set(),
        totalEnrolled: 0,
        male: 0,
        female: 0,
        withDisability: 0,
        enrollmentCompletePercentages: [],
      };
    }
    grouped[state].schools += 1;
    if (school.county28) grouped[state].counties.add(school.county28);
    // Aggregate learnerStats
    if (school.learnerStats) {
      Object.values(school.learnerStats).forEach((grade: any) => {
        if (grade && typeof grade === 'object') {
          grouped[state].totalEnrolled += grade.total || 0;
          grouped[state].male += grade.male || 0;
          grouped[state].female += grade.female || 0;
          grouped[state].withDisability += grade.withDisability || 0;
        }
      });
    }
    // Enrollment completion
    if (Array.isArray(school.isEnrollmentComplete)) {
      school.isEnrollmentComplete.forEach((rec: any) => {
        if (rec && typeof rec === 'object' && typeof rec.percentageComplete === 'number') {
          grouped[state].enrollmentCompletePercentages.push(rec.percentageComplete);
        }
      });
    }
  });
  // Convert counties Set to count and compute avg/max completion
  Object.values(grouped).forEach((state: any) => {
    state.counties = state.counties.size;
    state.enrollmentCompletion = state.enrollmentCompletePercentages.length
      ? Math.max(...state.enrollmentCompletePercentages)
      : 0;
  });
  return grouped;
}, [enrollmentData]);

const enrollmentStateRows = useMemo(() => Object.values(enrollmentByState), [enrollmentByState]);

// --- AGGREGATE OVERALL TOTALS ---
const overallTotals = useMemo(() => {
  return enrollmentStateRows.reduce(
    (acc: any, state: any) => {
      acc.schools += state.schools;
      acc.counties += state.counties;
      acc.totalEnrolled += state.totalEnrolled;
      acc.male += state.male;
      acc.female += state.female;
      acc.withDisability += state.withDisability;
      return acc;
    },
    { schools: 0, counties: 0, totalEnrolled: 0, male: 0, female: 0, withDisability: 0 }
  );
}, [enrollmentStateRows]);

  // List of all available states from the data
  const availableStates = useMemo(() => {
    return data.map(state => state._id)
  }, [data])


  // Calculate state summaries for the overview
  const stateSummaries = useMemo(() => {
    return data
      .map((state) => {
        const totals = state.state10Details.reduce(
          (acc, item) => {
            return {
              enrolled: acc.enrolled + item.totalEnrolled,
              dropped: acc.dropped + item.totalDropped,
              schools: acc.schools + item.totalSchools,
            }
          },
          { enrolled: 0, dropped: 0, schools: 0 },
        )

        const retentionRate = totals.enrolled === 0 ? 0 : ((totals.enrolled - totals.dropped) / totals.enrolled) * 100

        return {
          id: state._id,
          ...totals,
          retentionRate,
          counties: state.state10Details.reduce((acc, item) => {
            item.uniqueCounty28.forEach((county) => {
              if (!acc.includes(county)) acc.push(county)
            })
            return acc
          }, [] as string[]).length,
          yearlyTrend: Object.entries(state.stats)
            .sort(([yearA], [yearB]) => Number.parseInt(yearA) - Number.parseInt(yearB))
            .map(([year, value]) => ({ year, value })),
        }
      })
      .sort((a, b) => b.enrolled - a.enrolled) // Sort by enrollment
  }, [data])

  // Filter state summaries based on search
  const filteredStateSummaries = useMemo(() => {
    if (!searchTerm) return stateSummaries

    const searchLower = searchTerm.toLowerCase()
    return stateSummaries.filter((state) => state.id.toLowerCase().includes(searchLower))
  }, [stateSummaries, searchTerm])

  // Find the max enrollment for scaling the chart
  const maxEnrollment = useMemo(() => {
    return Math.max(...stateSummaries.map((state) => state.enrolled), 1)
  }, [stateSummaries])

  // Calculate retention rate
  const overallRetentionRate = useMemo(() => {
    if (overallTotals.enrolled === 0) return 0
    return ((overallTotals.enrolled - overallTotals.dropped) / overallTotals.enrolled) * 100
  }, [overallTotals])

  // Get top performing states
  const topPerformingStates = useMemo(() => {
    const byRetention = [...stateSummaries].sort((a, b) => b.retentionRate - a.retentionRate).slice(0, 3)
    const byEnrollment = [...stateSummaries].sort((a, b) => b.enrolled - a.enrolled).slice(0, 3)
    const bySchools = [...stateSummaries].sort((a, b) => b.schools - a.schools).slice(0, 3)

    return { byRetention, byEnrollment, bySchools }
  }, [stateSummaries])

  return (
    <div className=" py-2">
      <div className="flex flex-col gap-6">

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="states" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              States
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Enrollment</CardTitle>
                  <CardDescription>Across all states</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{overallTotals.totalEnrolled.toLocaleString()}</div>
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {(overallTotals.totalEnrolled / overallTotals.schools || 0).toFixed(0)} students per school average
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Male</CardTitle>
                  <CardDescription>Across all states</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{overallTotals.male.toLocaleString()}</div>
                    <div className="bg-blue-500/10 text-blue-500 p-2 rounded-full">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Female</CardTitle>
                  <CardDescription>Across all states</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{overallTotals.female.toLocaleString()}</div>
                    <div className="bg-pink-500/10 text-pink-500 p-2 rounded-full">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* States Comparison Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>States Comparison</CardTitle>
                    <CardDescription>Overview of all {data.length} states</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-auto max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search states..."
                      className="pl-8 pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear search</span>
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>State</TableHead>
                        <TableHead>Schools</TableHead>
                        <TableHead>Counties</TableHead>
                        <TableHead className="text-right">Enrolled</TableHead>
                        <TableHead className="text-right">Male</TableHead>
                        <TableHead className="text-right">Female</TableHead>
                        <TableHead className="text-right">With Disability</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollmentStateRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                            {searchTerm ? "No states match your search criteria" : "No state data available"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        enrollmentStateRows
                          .filter((state: any) =>
                            !searchTerm || state.state.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((state: any) => (
                            <TableRow
                              key={state.state}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => {
                                const element = document.querySelector('[data-value="states"]') as HTMLElement;
                                if (element) {
                                  setActiveState(state.state);
                                  element.click();
                                }
                              }}
                            >
                              <TableCell className="font-medium">{state.state}</TableCell>
                              <TableCell>{state.schools.toLocaleString()}</TableCell>
                              <TableCell>{state.counties}</TableCell>
                              <TableCell className="text-right">{state.totalEnrolled.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{state.male.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{state.female.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{state.withDisability.toLocaleString()}</TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* States Tab */}
          <TabsContent value="states">
            <Card>
              <CardHeader className="border-b">
                <Tabs value={activeState} onValueChange={setActiveState} className="w-full">
                  <ScrollArea className="w-full whitespace-nowrap pb-2">
                    <TabsList className="w-max">
                      {availableStates.map((stateId) => (
                        <TabsTrigger key={stateId} value={stateId}>
                          {stateId}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </ScrollArea>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-6">
                {data.find((state) => state._id === activeState) ? (
                  <StateSummary data={data.find((state) => state._id === activeState)!} />
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">No data available for {activeState}</h3>
                    <p className="text-muted-foreground">Please select another state.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
