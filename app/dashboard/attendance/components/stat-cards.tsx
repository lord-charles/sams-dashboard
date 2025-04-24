"use client"

import { BarChart3, Calendar, ChevronDown, ChevronUp, MapPin, School, TrendingUp, Users } from "lucide-react"
import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// API response data
const data = {
  yearToDate: {
    totalEntries: 140,
    totalStudents: 70,
    dateRange: {
      start: "2025-04-20T00:00:00.000Z",
      end: "2025-04-21T00:00:00.000Z",
    },
  },
  todaySnapshot: {
    recordsLogged: 70,
    absent: 4,
    present: 66,
    absenteeRate: "5.7",
  },
  averageAttendance: {
    overallRate: "95.7",
    peakDay: {
      date: "2025-04-21",
      rate: 94.28571428571428,
    },
    lowestDay: {
      date: "2025-04-20",
      rate: 97.14285714285714,
    },
  },
  demographics: {
    male: {
      percentage: "100.0",
      count: 6,
    },
    female: {
      percentage: "0.0",
      count: 0,
    },
    disability: {
      percentage: "0.0",
      count: 0,
    },
  },
  regionalDistribution: {
    topCounties: [
      {
        name: "Aweil East",
        percentage: "100.0",
        count: 6,
      },
    ],
    topStates: [
      {
        name: "NBG",
        percentage: "100.0",
        count: 6,
      },
    ],
  },
  engagement: {
    schoolsReporting: 1,
    averageAttendancePerSchool: 70,
  },
}

// Format large numbers with K/M suffix
const formatNumber = (num: number | undefined | null) => {
  if (!num) return '0'
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

// Format date to readable format with safety checks
const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return format(date, "MMM d, yyyy")
  } catch {
    return 'Invalid Date'
  }
}

// Progress bar component
const ProgressBar = ({ value, max = 100, className, children }: { 
  value: number | undefined | null; 
  max?: number; 
  className?: string;
  children?: React.ReactNode;
}) => {
  const percentage = Math.min(Math.max(((value || 0) / max) * 100, 0), 100)
  return (
    <div className={cn("w-full h-1.5 bg-muted rounded-full overflow-hidden", className)}>
      {children ? (
        children
      ) : (
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
          style={{ width: `${percentage}%` }}
        />
      )}
    </div>
  )
}

// Trend indicator component
const TrendIndicator = ({ value, isPositive }: { value: number; isPositive: boolean }) => {
  return (
    <div className={cn("flex items-center text-xs font-medium", isPositive ? "text-emerald-600" : "text-rose-600")}>
      {isPositive ? <ChevronUp className="h-3 w-3 mr-0.5" /> : <ChevronDown className="h-3 w-3 mr-0.5" />}
      {value.toFixed(1)}%
    </div>
  )
}

export default function AttendanceStatCards({ statsData = {} }: { statsData?: any }) {
  const startDate = formatDate(statsData?.yearToDate?.dateRange?.start)
  const endDate = formatDate(statsData?.yearToDate?.dateRange?.end)


  return (
    <TooltipProvider>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {/* Card 1: Total Attendance Summary */}
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-background/80">
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">Total Attendance Summary</CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full p-1 hover:bg-muted cursor-help">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Shows system coverage and usage at scale.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-muted-foreground font-medium">Total Attendance Entries</p>
                    <TrendIndicator value={2.5} isPositive={true} />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{formatNumber(statsData?.yearToDate?.totalEntries ?? 0)}</p>
                    <p className="text-sm text-muted-foreground">entries</p>
                  </div>
                  <ProgressBar value={statsData?.yearToDate?.totalEntries ?? 0} max={200} className="mt-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1.5">Total Learners Covered</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{formatNumber(statsData?.yearToDate?.totalStudents ?? 0)}</p>
                    <p className="text-sm text-muted-foreground">Learners</p>
                  </div>
                  <ProgressBar value={statsData?.yearToDate?.totalStudents || 0} max={100} className="mt-2" />
                </div>
                <div className="pt-1">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Data Range</p>
                  <div className="flex items-center space-x-2 bg-muted/50 rounded-md px-3 py-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {startDate} – {endDate}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Daily Attendance Snapshot */}
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-background/80">
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">Daily Attendance Snapshot</CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full p-1 hover:bg-muted cursor-help">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Useful for daily monitoring, spikes, and anomalies.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1.5">Records Logged</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{formatNumber(statsData?.todaySnapshot?.recordsLogged)}</p>
                    <p className="text-sm text-muted-foreground">records</p>
                  </div>
                  <ProgressBar value={statsData?.todaySnapshot?.recordsLogged || 0} max={100} className="mt-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Present</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-bold text-emerald-600">{formatNumber(statsData?.todaySnapshot?.present)}</p>
                    </div>
                    <ProgressBar
                      value={statsData?.todaySnapshot?.present || 0}
                      max={statsData.todaySnapshot.recordsLogged}
                      className="mt-2 bg-emerald-100 dark:bg-emerald-900/20"
                    >
                      <div className="h-full bg-emerald-500 rounded-full" />
                    </ProgressBar>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-950/20 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Absent</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-bold text-rose-600">{formatNumber(statsData?.todaySnapshot?.absent)}</p>
                    </div>
                    <ProgressBar
                      value={statsData?.todaySnapshot?.absent || 0}
                      max={statsData.todaySnapshot.recordsLogged}
                      className="mt-2 bg-rose-100 dark:bg-rose-900/20"
                    >
                      <div className="h-full bg-rose-500 rounded-full" />
                    </ProgressBar>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1.5">Absentee Rate</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold">{statsData?.todaySnapshot?.absenteeRate || '0'}%</p>
                    </div>
                    <TrendIndicator value={0.3} isPositive={false} />
                  </div>
                  <ProgressBar
                    value={Number.parseFloat(statsData?.todaySnapshot?.absenteeRate || '0')}
                    max={100}
                    className="mt-2 bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Average Daily Attendance Rate */}
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-background/80">
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">Average Daily Attendance</CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full p-1 hover:bg-muted cursor-help">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>
                      Offers a consistent performance view over time, highlights seasonal dips/spikes, and reflects the
                      general health of school attendance.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-muted-foreground font-medium">Overall Avg Attendance Rate</p>
                    <TrendIndicator value={1.2} isPositive={true} />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{statsData?.averageAttendance?.overallRate || '0'}%</p>
                  </div>
                  <ProgressBar
                    value={Number.parseFloat(statsData?.averageAttendance?.overallRate || '0')}
                    max={100}
                    className="mt-2 h-2"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-950/20 dark:to-emerald-950/5 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground font-medium mb-2">Peak Attendance Day</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        <p className="text-sm font-medium">
                          {statsData?.averageAttendance?.peakDay?.date ? format(new Date(statsData.averageAttendance.peakDay.date), "MMM d") : 'N/A'}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-emerald-600">
                        {(statsData?.averageAttendance?.peakDay?.rate || 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-amber-950/5 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground font-medium mb-2">Lowest Attendance Day</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-amber-500" />
                        <p className="text-sm font-medium">
                          {statsData?.averageAttendance?.lowestDay?.date ? format(new Date(statsData.averageAttendance.lowestDay.date), "MMM d") : 'N/A'}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-amber-600">
                        {(statsData?.averageAttendance?.lowestDay?.rate || 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
