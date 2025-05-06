"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, X, Users, School, TrendingUp, ArrowDownRight, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export default function StateSummary({ data }: { data: StateData }) {
  const [searchTerm, setSearchTerm] = useState("")
  // Calculate totals
  const currentYear = new Date().getFullYear().toString();

  const totals = useMemo(() => {
    if (!data?.state10Details) return { enrolled: 0, dropped: 0, schools: 0 }

    return data.state10Details.reduce(
      (acc, item) => {
        return {
          enrolled: acc.enrolled + item.totalEnrolled,
          dropped: acc.dropped + item.totalDropped,
          schools: acc.schools + item.totalSchools,
        }
      },
      { enrolled: 0, dropped: 0, schools: 0 },
    )
  }, [data])

  // Filter state details based on search
  const filteredDetails = useMemo(() => {
    if (!data?.state10Details || !searchTerm) return data?.state10Details || []

    const searchLower = searchTerm.toLowerCase()
    return data.state10Details.filter(
      (item) =>
        (item.modifiedBy && item.modifiedBy.toLowerCase().includes(searchLower)) ||
        item.uniquePayam28.some((p) => p.toLowerCase().includes(searchLower)) ||
        item.uniqueCounty28.some((c) => c.toLowerCase().includes(searchLower)),
    )
  }, [data, searchTerm])

  // Get years sorted in ascending order
  const years = useMemo(() => {
    if (!data?.stats) return []
    return Object.keys(data.stats).sort()
  }, [data])

  // Find the max value for the chart scaling
  const maxYearValue = useMemo(() => {
    if (!data?.stats) return 0
    return Math.max(...Object.values(data.stats))
  }, [data])


  // Calculate retention rate using stats data (current year and previous year)
  const retentionRateStats = useMemo(() => {
    if (!data?.stats) return 0;
    const prevYear = (new Date().getFullYear() - 1).toString();
    const currentYearEnrolled = data.stats[currentYear] || 0;
    const prevYearEnrolled = data.stats[prevYear] || 0;
    if (prevYearEnrolled === 0 || currentYearEnrolled === 0) return 0;
    return (currentYearEnrolled / prevYearEnrolled) * 100;
  }, [data]);

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>No State Data Available</CardTitle>
          <CardDescription>State information could not be loaded</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {/* State Overview */}
      <div className="grid grid-cols-1">
        <Card >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{data._id} State Overview</CardTitle>
                <CardDescription>Summary of enrollment data across {totals.schools} schools</CardDescription>
              </div>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Enrolled</div>
                  <div className="bg-primary/10 text-primary p-1.5 rounded-full">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{data.stats[currentYear].toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">Students across all programs</div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Dropped</div>
                  <div className="bg-destructive/10 text-destructive p-1.5 rounded-full">
                    <ArrowDownRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{totals.dropped.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((totals.dropped / totals.enrolled) * 100).toFixed(1)}% dropout rate
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-muted-foreground">Retention Rate</div>
                  <div className="bg-green-500/10 text-green-500 p-1.5 rounded-full">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{retentionRateStats.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(() => {
                    const currentYear = new Date().getFullYear().toString();
                    const prevYear = (new Date().getFullYear() - 1).toString();
                    const currentYearEnrolled = data.stats?.[currentYear] || 0;
                    const prevYearEnrolled = data.stats?.[prevYear] || 0;
                    return `${currentYearEnrolled} enrolled vs ${prevYearEnrolled} last year`;
                  })()}
                </div>
              </div>
            </div>

            {/* Yearly Stats Chart */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Enrollment by Year</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total student enrollment by year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="h-[120px] flex items-end gap-2">
                {years.map((year) => {
                  const value = data.stats[year] || 0
                  const percentage = maxYearValue ? (value / maxYearValue) * 100 : 0

                  return (
                    <div key={year} className="flex flex-col items-center flex-1">
                      <div className="w-full flex justify-center items-end h-[80px]">
                        <div
                          className="w-full max-w-[50px] bg-primary/80 rounded-t-sm hover:bg-primary transition-all"
                          style={{ height: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium mt-2">{year}</div>
                      <div className="text-xs text-muted-foreground">{value.toLocaleString()}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Detailed Breakdown</CardTitle>
              <CardDescription>Enrollment data by contributor</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search enumerator..."
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
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enumerator</TableHead>
                  <TableHead>Schools</TableHead>
                  <TableHead>Counties</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                  <TableHead className="text-right">Dropped</TableHead>
                  <TableHead className="text-right">Retention</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDetails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      {searchTerm ? "No enumerator match your search criteria" : "No contributor data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDetails.map((item, index) => {
                    const retentionRate =
                      item.totalEnrolled === 0
                        ? 0
                        : ((item.totalEnrolled - item.totalDropped) / item.totalEnrolled) * 100

                    return (
                      <TableRow key={`${item.modifiedBy || "unknown"}-${index}`}>
                        <TableCell className="font-medium">{item.modifiedBy || "Unspecified"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <School className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{item.totalSchools}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.uniqueCounty28.map((county) => (
                              <Badge key={county} variant="outline" className="text-xs">
                                {county}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.totalEnrolled.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {item.totalDropped > 0 && <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />}
                            <span>{item.totalDropped.toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`text-sm font-medium ${Math.max(0, retentionRate) > 90
                              ? "text-green-500"
                              : Math.max(0, retentionRate) > 75
                                ? "text-amber-500"
                                : "text-destructive"
                              }`}
                          >
                            {Math.max(0, retentionRate).toFixed(1)}%
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <div>
              Showing {filteredDetails.length} of {data.state10Details.length} enumerators
            </div>
            <div>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
