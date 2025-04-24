"use client"

import { useMemo } from "react"
import { School, Building, ClipboardCheck, Unlock, BookOpen, Users } from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define proper types for our data
type LearnerStats = {
  total: number
  male: number
  female: number
  withDisability: number
}

type SchoolEnrollmentStatus = {
  total: number
  started: number
  completed: number
  percentageStarted: number
  percentageCompleted: number
}

type SchoolType = {
  public: number
  private: number
  faithBased: number
  other: number
}

type OverallLearnerStats = {
  overall: {
    total: number
    male: number
    female: number
    withDisability: number
  }
  bySchoolType: Array<{
    schoolType: string
    total: number
    male: number
    female: number
    withDisability: number
  }>
}

type EnrollmentData = {
  _id: string
  code: string
  schoolName: string
  emisId: string
  schoolOwnerShip: string
  schoolType: string
  payam28: string
  state10: string
  county28: string
  isEnrollmentComplete: {
    year: number
    isComplete: boolean
    learnerEnrollmentComplete: boolean
    percentageComplete: number
  }[]
  learnerStats?: Record<
    string,
    {
      total: number
      male: number
      female: number
      withDisability: number
      currentYear: {
        total: number
        male: number
        female: number
        withDisability: number
      }
    }
  >
}

interface SchoolStatCardsProps {
  enrollmentData: EnrollmentData[]
  schools: any[]
  overallLearnerStats?: OverallLearnerStats
}


  // Map school type codes to readable names
  const schoolTypeNames: Record<string, string> = {
    PRI: "PRI",
    SEC: "SEC",
    ECD: "ECD",
    ALP: "ALP",
    CGS: "CGS",
    ASP: "ASP",
    TTI: "TTI",
  }

export default function SchoolStatCards({ enrollmentData, schools, overallLearnerStats }: SchoolStatCardsProps) {
  const currentYear = new Date().getFullYear()

  // Calculate learner statistics
  const learnerStats = useMemo(() => {
    const stats: { total: LearnerStats } = {
      total: {
        total: 0,
        male: 0,
        female: 0,
        withDisability: 0,
      },
    }

    // Process each school
    enrollmentData?.filter(school => 
      school.isEnrollmentComplete?.some(e => e.learnerEnrollmentComplete)
    ).forEach((school) => {
      if (school.learnerStats) {
        // Process each grade
        Object.values(school.learnerStats).forEach((data: any) => {
          // Add to total stats (using total numbers, not currentYear)
          stats.total.total += data?.total || 0
          stats.total.male += data?.male || 0
          stats.total.female += data?.female || 0
          stats.total.withDisability += data?.withDisability || 0
        })
      }
    })

    return stats
  }, [enrollmentData])

  // Calculate enrollment status for current year
  const enrollmentStatus = useMemo(() => {
    const status: SchoolEnrollmentStatus = {
      total: schools?.length || 0,
      started: 0,
      completed: 0,
      percentageStarted: 0,
      percentageCompleted: 0,
    }

    enrollmentData?.forEach((school) => {
      const currentYearEnrollment = school.isEnrollmentComplete?.find((item) => item.year === currentYear)

      if (currentYearEnrollment?.isComplete) {
        status.started++
      }

      if (currentYearEnrollment?.learnerEnrollmentComplete) {
        status.completed++
      }
    })

    status.percentageStarted = status.total > 0 ? (status.started / status.total) * 100 : 0
    status.percentageCompleted = status.total > 0 ? (status.completed / status.total) * 100 : 0

    return status
  }, [enrollmentData, schools, currentYear])

  // Gender ratio calculation
  const genderRatio = useMemo(() => {
    const malePercentage = learnerStats.total.total > 0 ? (learnerStats.total.male / learnerStats.total.total) * 100 : 0

    return {
      malePercentage: Math.round(malePercentage),
      femalePercentage: Math.round(100 - malePercentage),
    }
  }, [learnerStats])

  // Disability percentage
  const disabilityPercentage = useMemo(() => {
    return learnerStats.total.total > 0 ? (learnerStats.total.withDisability / learnerStats.total.total) * 100 : 0
  }, [learnerStats])

  // Dummy data for opened and closed schools
  const schoolStatusData = {
    opened: 41,
    closed: 15,
    reopened: 8,
    temporarilyClosed: 7,
    openedPercentChange: 8.1,
    closedPercentChange: -2.3,
  }

  // Calculate enrollment progress over time (mock data for demonstration)
  const enrollmentProgress = useMemo(() => {
    // This would normally come from historical data
    return {
      previousYear: enrollmentStatus.total * 0.85,
      currentYear: enrollmentStatus.total,
      growthRate: 17.6, // Percentage growth
      targetCompletion: 95, // Target percentage for completion
    }
  }, [enrollmentStatus.total])

  function countSchoolsByOwnership(schools: any[]) {
    // Initialize counters for each ownership type
    const counts = {
      Public: 0,
      Community: 0,
      "Faith-Based": 0,
      Private: 0,
      Other: 0, // For any unexpected values
    }

    // Iterate through each school
    schools?.forEach((school: any) => {
      const ownership = school.schoolOwnerShip

      // If ownership type exists in our counts object, increment it
      if (counts.hasOwnProperty(ownership)) {
        counts[ownership as keyof typeof counts]++
      } else {
        // If it's an unexpected value, count it as "Other"
        counts["Other"]++
      }
    })

    return counts
  }

  const ownershipCounts = countSchoolsByOwnership(schools)

  // Process school type data for the new card
  const schoolTypeData = useMemo(() => {
    if (!overallLearnerStats?.bySchoolType) return []

    // Filter only the specified school types
    const validSchoolTypes = overallLearnerStats.bySchoolType.filter(
      (type) => schoolTypeNames[type?.schoolType]
    )

    // Sort by total learners
    const sortedSchoolTypes = validSchoolTypes.sort((a, b) => b.total - a.total)

    // Calculate percentages
    const totalLearners = overallLearnerStats.overall.total || 1
    return sortedSchoolTypes.map((type) => ({
      ...type,
      percentage: (type.total / totalLearners) * 100,
      malePercentage: (type.male / type.total) * 100,
      femalePercentage: (type.female / type.total) * 100,
    }))
  }, [overallLearnerStats])


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
      {/* Card 1: Total Schools with Learner Stats */}
      <Card className="border-t-4 border-t-blue-600 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-row items-center justify-between p-3">
          <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <School className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="pb-2 px-3">
          <div className="text-3xl font-bold">{schools?.length.toLocaleString()}</div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-muted-foreground">Across all regions</p>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium">{learnerStats.total.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>M: {learnerStats.total.male.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                <span>F: {learnerStats.total.female.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <span>With Disability:</span>
                <span className="font-medium">
                  {learnerStats.total.withDisability.toLocaleString()} (
                  {(
                    (learnerStats.total.withDisability / learnerStats.total.total) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
              <Progress 
                value={(learnerStats.total.withDisability / learnerStats.total.total) * 100} 
                className="h-1.5 bg-blue-100 mt-1" 
              />
            </div>

            <div className="mt-2 pt-3 border-t">
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-[10px]">Public: {ownershipCounts["Public"]}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-[10px]">Private: {ownershipCounts["Private"]}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[10px]">Faith-B: {ownershipCounts["Faith-Based"]}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span className="text-[10px]">Community: {ownershipCounts["Community"]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>



      {/* Card 5: School Types (NEW) - Replacing Enrollment Growth */}
      <TooltipProvider>
        <Card className="border-t-4 border-t-teal-600 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
            <CardTitle className="text-sm font-medium">7 School Types</CardTitle>
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-teal-600" />
            </div>
          </div>
          <div className="pb-2 px-3">
          

            <div className="mt-1 space-y-1">
              {schoolTypeData.map((type, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{schoolTypeNames[type.schoolType] || type.schoolType}</span>
                        <span>
                          {type.total.toLocaleString()} ({type.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={type.percentage} className="h-1 bg-teal-100" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p>
                        <strong>{schoolTypeNames[type.schoolType] || type.schoolType}</strong>:{" "}
                        {type.total.toLocaleString()} learners
                      </p>
                      <p>
                        Male: {type.male.toLocaleString()} ({type.malePercentage.toFixed(1)}%)
                      </p>
                      <p>
                        Female: {type.female.toLocaleString()} ({type.femalePercentage.toFixed(1)}%)
                      </p>
                      <p>With Disability: {type.withDisability.toLocaleString()}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

        
          </div>
        </Card>
      </TooltipProvider>

      {/* Card 2: Enrollment Started */}
      <Card className="border-t-4 border-t-green-600 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
          <CardTitle className="text-sm font-medium">Enrollment Started</CardTitle>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <ClipboardCheck className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="pb-2 px-3">
          <div className="text-3xl font-bold">{enrollmentStatus.started.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {enrollmentStatus.percentageStarted.toFixed(1)}% of schools ({currentYear})
          </p>
          <div className="mt-4">
            <Progress value={enrollmentStatus.percentageStarted} className="h-2 bg-green-100" />
            <p className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span className="text-green-600">
                {enrollmentStatus.started} of {enrollmentStatus.total} schools
              </span>
              <span className="text-green-600 font-medium">↑ 12.5%</span>
            </p>
          </div>

          <div className="mt-3 pt-3 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="text-sm font-semibold">{genderRatio.malePercentage}%</div>
                <div className="text-xs text-muted-foreground">Male</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold">{genderRatio.femalePercentage}%</div>
                <div className="text-xs text-muted-foreground">Female</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-green-500 h-full" style={{ width: `${genderRatio.malePercentage}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Card 3: Enrollment Completed */}
      <Card className="border-t-4 border-t-purple-600 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
          <CardTitle className="text-sm font-medium">Enrollment Completed</CardTitle>
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Building className="h-5 w-5 text-purple-600" />
          </div>
        </div>
        <div className="pb-2 px-3">
          <div className="text-3xl font-bold">{enrollmentStatus.completed.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {enrollmentStatus.percentageCompleted.toFixed(1)}% of schools ({currentYear})
          </p>
          <div className="mt-4">
            <Progress value={enrollmentStatus.percentageCompleted} className="h-2 bg-purple-100" />
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted-foreground">Target: {enrollmentProgress.targetCompletion}%</p>
              <p className="text-xs text-purple-600 font-medium">{enrollmentStatus.completed} complete</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span>With Disability:</span>
              <span className="font-medium">{learnerStats.total.withDisability.toLocaleString()} learners</span>
            </div>
            <Progress value={disabilityPercentage} className="h-1.5 bg-purple-100 mt-1" />
            <p className="mt-2 text-xs text-muted-foreground">
              {disabilityPercentage.toFixed(1)}% of total learner population
            </p>
          </div>
        </div>
      </Card>

      {/* Card 4: Opened and Closed Schools */}
      <Card className="border-t-4 border-t-amber-600 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
          <CardTitle className="text-sm font-medium">School Status</CardTitle>
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Unlock className="h-5 w-5 text-amber-600" />
          </div>
        </div>
        <div className="pb-2 px-3">
          <div className="flex justify-between">
            <div>
              <div className="text-3xl font-bold">{schoolStatusData.opened}</div>
              <p className="text-xs text-muted-foreground">Newly Opened</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{schoolStatusData.closed}</div>
              <p className="text-xs text-muted-foreground">Closed</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Newly Opened Schools</span>
                <span className="text-green-600">↑ {schoolStatusData.openedPercentChange}%</span>
              </div>
              <Progress
                value={(schoolStatusData.opened / (schools?.length || 100)) * 100}
                className="h-1.5 bg-green-100"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Closed Schools</span>
                <span className="text-red-600">↓ {Math.abs(schoolStatusData.closedPercentChange)}%</span>
              </div>
              <Progress
                value={(schoolStatusData.closed / (schools?.length || 100)) * 100}
                className="h-1.5 bg-red-100"
              />
            </div>

            <div className="pt-2 border-t grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-sm font-semibold">{schoolStatusData.reopened}</div>
                <div className="text-xs text-muted-foreground">Reopened</div>
              </div>
              <div>
                <div className="text-sm font-semibold">{schoolStatusData.temporarilyClosed}</div>
                <div className="text-xs text-muted-foreground">Temp. Closed</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

    </div>
  )
}

