"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ChevronUp, MapPin, School, Users } from "lucide-react"


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



export default function Overview({ statsData = {} }: { statsData?: any }) {



  return (
    <TooltipProvider>
      <div >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">

          {/* Card 4: Demographic Breakdown */}
          <Card className="overflow-hidden border-none shadow-md ">
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">Demographic Breakdown</CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full p-1 hover:bg-muted cursor-help">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Gives insights into potential inequalities or support needs.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Absent (Male)</p>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold">{statsData?.demographics?.male?.percentage || '0'}%</p>
                      <p className="text-sm text-muted-foreground">({statsData?.demographics?.male?.count || 0})</p>
                    </div>
                  </div>
                  <ProgressBar
                    value={Number.parseFloat(statsData?.demographics?.male?.percentage || '0')}
                    max={100}
                    className="mt-1 bg-sky-100 dark:bg-sky-900/20"
                  >
                    <div className="h-full bg-sky-500 rounded-full" />
                  </ProgressBar>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Absent (Female)</p>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold">{statsData?.demographics?.female?.percentage || '0'}%</p>
                      <p className="text-sm text-muted-foreground">({statsData?.demographics?.female?.count || 0})</p>
                    </div>
                  </div>
                  <ProgressBar
                    value={Number.parseFloat(statsData?.demographics?.female?.percentage || 0)}
                    max={100}
                    className="mt-1 bg-pink-100 dark:bg-pink-900/20"
                  >
                    <div className="h-full bg-pink-500 rounded-full" />
                  </ProgressBar>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Learners with Disabilities</p>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold">{statsData?.demographics?.disability?.percentage || '0'}%</p>
                      <p className="text-sm text-muted-foreground">({statsData?.demographics?.disability?.count || 0})</p>
                    </div>
                  </div>
                  <ProgressBar
                    value={Number.parseFloat(statsData?.demographics?.disability?.percentage || '0')}
                    max={100}
                    className="mt-1 bg-violet-100 dark:bg-violet-900/20"
                  >
                    <div className="h-full bg-violet-500 rounded-full" />
                  </ProgressBar>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Regional Distribution */}
          <Card className="overflow-hidden border-none shadow-md ">
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">Regional Distribution</CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full p-1 hover:bg-muted cursor-help">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Supports targeted education policy or program response.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-3">Top Counties by Absences</p>
                  <div className="space-y-3">
                    {(statsData?.regionalDistribution?.topCounties || []).map((county:any, index:any) => (
                      <div key={index} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{county?.name}</p>
                          <div className="flex items-center">
                            <p className="text-sm font-semibold">{county?.percentage}%</p>
                            <p className="text-xs text-muted-foreground ml-1">({county?.count})</p>
                          </div>
                        </div>
                        <ProgressBar
                          value={Number.parseFloat(county?.percentage)}
                          max={100}
                          className="h-1.5 bg-gradient-to-r from-muted/50 to-muted"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-3">Top States</p>
                  <div className="space-y-3">
                    {(statsData?.regionalDistribution?.topStates || []).map((state:any, index:any) => (
                      <div key={index} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{state?.name}</p>
                          <div className="flex items-center">
                            <p className="text-sm font-semibold">{state?.percentage}%</p>
                            <p className="text-xs text-muted-foreground ml-1">({state?.count})</p>
                          </div>
                        </div>
                        <ProgressBar
                          value={Number.parseFloat(state?.percentage)}
                          max={100}
                          className="h-1.5 bg-gradient-to-r from-muted/50 to-muted"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 6: Engagement Metrics */}
          <Card className="overflow-hidden border-none shadow-md ">
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <School className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">Engagement Metrics</CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full p-1 hover:bg-muted cursor-help">
                      <School className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Tracks reporting compliance and helps identify gaps.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-5">
                <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Schools Reporting Today</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{statsData?.engagement?.schoolsReporting || 0}</p>
                    <p className="text-sm text-muted-foreground">school</p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                    <span>Active reporting</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1.5">Avg Attendance per School</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{statsData?.engagement?.averageAttendancePerSchool || 0}</p>
                    <p className="text-sm text-muted-foreground">Learners</p>
                  </div>
                  <ProgressBar
                    value={statsData?.engagement?.averageAttendancePerSchool || 0}
                    max={100}
                    className="mt-2 bg-gradient-to-r from-muted/50 to-muted"
                  />
                </div>
                {/* <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1.5">Missing Submissions</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">schools</p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-emerald-600">
                    <ChevronUp className="h-3 w-3 mr-0.5" />
                    <span>100% compliance rate</span>
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
