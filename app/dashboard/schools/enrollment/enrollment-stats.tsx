"use client"

import { useState } from "react"
import { BarChart3, School, TrendingUp, AlertTriangle, Building2, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the data types based on the provided JSON
interface EnrollmentStatus {
  year?: number
  isComplete: boolean
  completedBy: string
  comments?: string
  percentageComplete?: number
  _id: string
}

interface SchoolData {
  _id: string
  code: string
  payam28: string
  state10: string
  county28: string
  schoolName: string
  schoolOwnerShip: string
  schoolType: string
  emisId: string
  isEnrollmentComplete: EnrollmentStatus[]
}

export default function EnrollmentStats({ allSchools,schoolsData }: { allSchools: SchoolData[] ,schoolsData:SchoolData[]}) {
  // Current year for filtering
  const currentYear = new Date().getFullYear()

  // Total schools in the country (count from allSchools)
  const totalSchoolsInCountry = allSchools.length

  // Total schools by ownership type (count dynamically from allSchools)
  const totalSchoolsByOwnership = allSchools.reduce((acc, school) => {
    const ownership = school.schoolOwnerShip;
    if (ownership && ownership !== "undefined" && ownership !== "null") {
      if (ownership in acc) {
        acc[ownership] += 1;
      } else {
        acc[ownership] = 1;
      }
    }
    return acc;
  }, {} as Record<string, number>);

  // Get the list of unique ownership types
  const ownershipTypes = Object.keys(totalSchoolsByOwnership);

  // Filter out any invalid ownership types
  const validOwnershipTypes = ownershipTypes.filter(ownership => 
    ownership && ownership !== "undefined" && ownership !== "null"
  );



  // Filter schools by valid ownership types
  const schoolsWithValidOwnership = allSchools.filter(school => 
    school.schoolOwnerShip && 
    school.schoolOwnerShip !== "undefined" && 
    school.schoolOwnerShip !== "null"
  );

  // Update total schools count to only include valid ownership types
  const totalSchoolsInCountryWithValidOwnership = schoolsWithValidOwnership.length;

  // Filter schools that have started enrollment for the current year
  const schoolsWithStartedEnrollment = schoolsData.filter((school) =>
    school.isEnrollmentComplete.some((status) => status.year === currentYear),
  )

  // Calculate key metrics
  const totalStartedEnrollment = schoolsWithStartedEnrollment.length

  const completedEnrollment = schoolsWithStartedEnrollment.filter((school) =>
    school.isEnrollmentComplete.some((status) => status.year === currentYear && status.isComplete === true),
  ).length

  const inProgressEnrollment = schoolsWithStartedEnrollment.filter((school) =>
    school.isEnrollmentComplete.some((status) => status.year === currentYear && status.isComplete === false),
  ).length

  // Completion rate (percentage of schools that completed enrollment out of those that started)
  const completionRate =
    totalStartedEnrollment > 0 ? Math.round((completedEnrollment / totalStartedEnrollment) * 100) : 0

  // Schools with low completion percentage (below 30%)
  const lowCompletionSchools = schoolsWithStartedEnrollment.filter((school) => {
    const status = school.isEnrollmentComplete.find(
      (s) => s.year === currentYear && s.isComplete === false && s.percentageComplete !== undefined,
    )
    return status && (status?.percentageComplete || 0) < 30
  }).length

  // Calculate average completion percentage for in-progress schools
  const inProgressSchools = schoolsWithStartedEnrollment.filter((school) =>
    school.isEnrollmentComplete.some(
      (status) => status.year === currentYear && status.isComplete === false && status.percentageComplete !== undefined,
    ),
  )

  const totalPercentage = inProgressSchools.reduce((sum, school) => {
    const status = school.isEnrollmentComplete.find(
      (s) => s.year === currentYear && s.isComplete === false && s.percentageComplete !== undefined,
    )
    return sum + (status?.percentageComplete || 0)
  }, 0)

  const averageCompletion = inProgressSchools.length > 0 ? Math.round(totalPercentage / inProgressSchools.length) : 0

  // Calculate percentages relative to total schools in country
  const startedPercentOfTotal = Math.round((totalStartedEnrollment / totalSchoolsInCountryWithValidOwnership) * 100)
  const completedPercentOfTotal = Math.round((completedEnrollment / totalSchoolsInCountryWithValidOwnership) * 100)

  // Group by school ownership
  const ownershipStats = validOwnershipTypes.map((ownerType) => {
    const schoolsOfType = schoolsWithStartedEnrollment.filter((school) => school.schoolOwnerShip === ownerType)

    const totalOfType = schoolsOfType.length

    const completedOfType = schoolsOfType.filter((school) =>
      school.isEnrollmentComplete.some((status) => status.year === currentYear && status.isComplete === true),
    ).length

    const completionPercentage = totalOfType > 0 ? Math.round((completedOfType / totalOfType) * 100) : 0

    // Calculate percentage of total schools of this type that have started enrollment
    const totalSchoolsOfThisType = totalSchoolsByOwnership[ownerType as keyof typeof totalSchoolsByOwnership] || 0
    const startedPercentOfTypeTotal =
      totalSchoolsOfThisType > 0 ? Math.round((totalOfType / totalSchoolsOfThisType) * 100) : 0

    // Calculate percentage of total schools of this type that have completed enrollment
    const completedPercentOfTypeTotal =
      totalSchoolsOfThisType > 0 ? Math.round((completedOfType / totalSchoolsOfThisType) * 100) : 0

    // Calculate how many schools of this type still need to start enrollment
    const remainingToStart = totalSchoolsOfThisType - totalOfType

    return {
      type: ownerType,
      total: totalOfType,
      completed: completedOfType,
      percentage: completionPercentage,
      totalInCountry: totalSchoolsOfThisType,
      startedPercentOfTotal: startedPercentOfTypeTotal,
      completedPercentOfTotal: completedPercentOfTypeTotal,
      remainingToStart: remainingToStart,
    }
  })

  // Color mapping for ownership types
  const ownershipColors: Record<string, string> = {
    Public: "bg-blue-500",
    "Faith-Based": "bg-purple-500",
    Private: "bg-orange-500",
    Community: "bg-teal-500",
  }

  // Calculate remaining schools to start enrollment
  const remainingToStartEnrollment = totalSchoolsInCountryWithValidOwnership - totalStartedEnrollment

  return (
    <div className="w-full p-6 bg-background">
      <h2 className="text-3xl font-bold mb-2">Enrollment Progress For {currentYear}</h2>
      <p className="text-muted-foreground mb-6">Tracking enrollment progress across {totalSchoolsInCountryWithValidOwnership} schools nationwide</p>

      <div className="grid gap-6">
        {/* First row - 4 main stat cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Started Enrollment Card */}
          <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Started Enrollment</CardTitle>
              <School className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStartedEnrollment}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                  <p className="text-xs text-muted-foreground">Schools in the enrollment process</p>
                </div>
                <p className="text-xs font-medium">{startedPercentOfTotal}% of total</p>
              </div>
              <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${startedPercentOfTotal}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="font-medium text-red-500">{remainingToStartEnrollment.toLocaleString()}</span> schools
                still need to start
              </p>
            </CardContent>
          </Card>

          {/* Completion Rate Card */}
          <Card className="overflow-hidden border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-500">{completionRate}%</div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-xs text-muted-foreground">
                    {completedEnrollment} of {totalStartedEnrollment} completed
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${completionRate}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="font-medium text-green-500">{completedPercentOfTotal}%</span> of all schools nationwide
              </p>
            </CardContent>
          </Card>

          {/* Average Completion Card */}
          <Card className="overflow-hidden border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-500">{averageCompletion}%</div>
              <div className="flex items-center mt-2">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                <p className="text-xs text-muted-foreground">For {inProgressEnrollment} in-progress schools</p>
              </div>
              <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${averageCompletion}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="font-medium">{inProgressEnrollment}</span> schools still in progress
              </p>
            </CardContent>
          </Card>

          {/* At-Risk Schools Card */}
          <Card className="overflow-hidden border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At-Risk Schools</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-500">{lowCompletionSchools}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <p className="text-xs text-muted-foreground">Schools with &lt;30% completion</p>
                </div>
                <p className="text-xs font-medium text-red-600 dark:text-red-500">
                  {inProgressEnrollment > 0 ? Math.round((lowCompletionSchools / inProgressEnrollment) * 100) : 0}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                <span className="font-medium text-red-500">{lowCompletionSchools}</span> schools need immediate
                attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Second row - 2 additional stat cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Completion by School Ownership Card */}
          <Card className="overflow-hidden border-t-4 border-t-cyan-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrollment by School Ownership</CardTitle>
              <Building2 className="h-5 w-5 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {ownershipStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${ownershipColors[stat.type] || 'bg-gray-500'} mr-2`}></div>
                        <span className="text-sm font-medium">{stat.type}</span>
                      </div>
                      <span className="text-sm font-medium">{stat.totalInCountry.toLocaleString()} schools total</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Started</span>
                          <span className="text-xs font-medium">{stat.startedPercentOfTotal}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${ownershipColors[stat.type] || 'bg-gray-500'} rounded-full`}
                            style={{ width: `${stat.startedPercentOfTotal}%`, opacity: 0.7 }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.total} of {stat.totalInCountry}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Completed</span>
                          <span className="text-xs font-medium">{stat.completedPercentOfTotal}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${ownershipColors[stat.type] || 'bg-gray-500'} rounded-full`}
                            style={{ width: `${stat.completedPercentOfTotal}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.completed} of {stat.totalInCountry}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground flex justify-between border-t border-gray-100 dark:border-gray-800 pt-1 mt-1">
                      <span>Remaining to start:</span>
                      <span className="font-medium text-red-500">{stat.remainingToStart.toLocaleString()} schools</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* National Progress Card */}
          <Card className="overflow-hidden border-t-4 border-t-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">National Enrollment Summary</CardTitle>
              <Globe className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm font-medium">Started Enrollment</span>
                    </div>
                    <span className="text-sm font-medium">{startedPercentOfTotal}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${startedPercentOfTotal}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalStartedEnrollment.toLocaleString()} of {totalSchoolsInCountryWithValidOwnership.toLocaleString()} schools
                    nationwide
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm font-medium">Completed Enrollment</span>
                    </div>
                    <span className="text-sm font-medium">{completedPercentOfTotal}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${completedPercentOfTotal}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedEnrollment.toLocaleString()} of {totalSchoolsInCountryWithValidOwnership.toLocaleString()} schools
                    nationwide
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Enrollment Status Summary</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-center">
                      <div className="text-lg font-bold text-green-600">{completedEnrollment.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-center">
                      <div className="text-lg font-bold text-amber-600">{inProgressEnrollment.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">In Progress</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-center">
                      <div className="text-lg font-bold text-red-600">
                        {remainingToStartEnrollment.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Not Started</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
