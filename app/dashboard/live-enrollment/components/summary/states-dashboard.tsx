"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
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

export default function StatesDashboard({ data = [] }: { data?: StateData[] }) {
  const [activeState, setActiveState] = useState<string>(data.length > 0 ? data[0]._id : "AAA")
  const [searchTerm, setSearchTerm] = useState("")

  // List of all available states from the data
  const availableStates = useMemo(() => {
    return data.map(state => state._id)
  }, [data])

  // Calculate overall totals across all states
  const overallTotals = useMemo(() => {
    return data.reduce(
      (acc, state) => {
        const stateTotals = state.state10Details.reduce(
          (stateAcc, item) => {
            return {
              enrolled: stateAcc.enrolled + item.totalEnrolled,
              dropped: stateAcc.dropped + item.totalDropped,
              schools: stateAcc.schools + item.totalSchools,
            }
          },
          { enrolled: 0, dropped: 0, schools: 0 },
        )

        return {
          enrolled: acc.enrolled + stateTotals.enrolled,
          dropped: acc.dropped + stateTotals.dropped,
          schools: acc.schools + stateTotals.schools,
        }
      },
      { enrolled: 0, dropped: 0, schools: 0 },
    )
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
                    <div className="text-3xl font-bold">{overallTotals.enrolled.toLocaleString()}</div>
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {(overallTotals.enrolled / overallTotals.schools || 0).toFixed(0)} students per school average
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Retention Rate</CardTitle>
                  <CardDescription>Students retained in program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{overallRetentionRate.toFixed(1)}%</div>
                    <div className="bg-green-500/10 text-green-500 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {(overallTotals.enrolled - overallTotals.dropped).toLocaleString()} students retained
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Schools</CardTitle>
                  <CardDescription>Across {data.length} states</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{overallTotals.schools.toLocaleString()}</div>
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <Globe className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {(overallTotals.schools / data.length || 0).toFixed(1)} schools per state average
                  </div>
                </CardContent>
              </Card> */}
                <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top States by Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingStates.byRetention.map((state, index) => (
                      <div key={state.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={index === 0 ? "default" : "outline"}
                            className="w-6 h-6 flex items-center justify-center p-0"
                          >
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{state.id}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-medium ${
                              state.retentionRate > 90
                                ? "text-green-500"
                                : state.retentionRate > 75
                                  ? "text-amber-500"
                                  : "text-destructive"
                            }`}
                          >
                            {state.retentionRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing States */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top States by Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingStates.byRetention.map((state, index) => (
                      <div key={state.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={index === 0 ? "default" : "outline"}
                            className="w-6 h-6 flex items-center justify-center p-0"
                          >
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{state.id}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-medium ${
                              state.retentionRate > 90
                                ? "text-green-500"
                                : state.retentionRate > 75
                                  ? "text-amber-500"
                                  : "text-destructive"
                            }`}
                          >
                            {state.retentionRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top States by Enrollment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingStates.byEnrollment.map((state, index) => (
                      <div key={state.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={index === 0 ? "default" : "outline"}
                            className="w-6 h-6 flex items-center justify-center p-0"
                          >
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{state.id}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{state.enrolled.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top States by Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingStates.bySchools.map((state, index) => (
                      <div key={state.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={index === 0 ? "default" : "outline"}
                            className="w-6 h-6 flex items-center justify-center p-0"
                          >
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{state.id}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{state.schools.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div> */}

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
                        <TableHead className="text-right">Retention</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStateSummaries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                            {searchTerm ? "No states match your search criteria" : "No state data available"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStateSummaries.map((state) => {
                          return (
                            <TableRow
                              key={state.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => {
                                const element = document.querySelector('[data-value="states"]') as HTMLElement;
                                if (element) {
                                  setActiveState(state.id);
                                  element.click();
                                }
                              }}
                            >
                              <TableCell className="font-medium">{state.id}</TableCell>
                              <TableCell>{state.schools.toLocaleString()}</TableCell>
                              <TableCell>{state.counties}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-24 bg-muted/50 rounded-full h-2">
                                    <div
                                      className="bg-primary rounded-full h-2"
                                      style={{ width: `${(state.enrolled / maxEnrollment) * 100}%` }}
                                    />
                                  </div>
                                  <span>{state.enrolled.toLocaleString()}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <span
                                  className={`font-medium ${
                                    state.retentionRate > 90
                                      ? "text-green-500"
                                      : state.retentionRate > 75
                                        ? "text-amber-500"
                                        : "text-destructive"
                                  }`}
                                >
                                  {state.retentionRate.toFixed(1)}%
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-end h-8 gap-1">
                                  {state.yearlyTrend.map((year, i) => {
                                    const maxValue = Math.max(...state.yearlyTrend.map((y) => y.value))
                                    const percentage = maxValue ? (year.value / maxValue) * 100 : 0

                                    return (
                                      <div key={year.year} className="flex flex-col items-center">
                                        <div
                                          className="w-4 bg-primary/80 rounded-t-sm"
                                          style={{ height: `${Math.max(percentage, 5)}%` }}
                                          title={`${year.year}: ${year.value.toLocaleString()}`}
                                        />
                                      </div>
                                    )
                                  })}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
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
