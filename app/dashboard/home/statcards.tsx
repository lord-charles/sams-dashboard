"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { School, Users, BarChart3, PieChart, Building2, ClipboardCheck } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

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

// Classroom data (realistic dummy data for South Sudan)
const classroomsData = [
  { state10: "AAA", total: 120, permanent: 45, temporary: 65, outdoor: 10 },
  { state10: "CES", total: 3850, permanent: 1540, temporary: 1890, outdoor: 420 },
  { state10: "EES", total: 1420, permanent: 570, temporary: 710, outdoor: 140 },
  { state10: "JGL", total: 1980, permanent: 790, temporary: 990, outdoor: 200 },
  { state10: "LKS", total: 1560, permanent: 620, temporary: 780, outdoor: 160 },
  { state10: "NBG", total: 1840, permanent: 740, temporary: 920, outdoor: 180 },
  { state10: "PAA", total: 240, permanent: 95, temporary: 120, outdoor: 25 },
  { state10: "RAA", total: 320, permanent: 130, temporary: 160, outdoor: 30 },
  { state10: "State X", total: 5, permanent: 2, temporary: 2, outdoor: 1 },
  { state10: "UNS", total: 1680, permanent: 670, temporary: 840, outdoor: 170 },
  { state10: "UTY", total: 1420, permanent: 570, temporary: 710, outdoor: 140 },
  { state10: "WBG", total: 1560, permanent: 620, temporary: 780, outdoor: 160 },
  { state10: "WES", total: 1980, permanent: 790, temporary: 990, outdoor: 200 },
  { state10: "WRP", total: 2240, permanent: 900, temporary: 1120, outdoor: 220 },
]

// Attendance data (realistic dummy data for South Sudan)
const attendanceData = [
  { state10: "AAA", average: 78, male: 80, female: 76 },
  { state10: "CES", average: 82, male: 84, female: 80 },
  { state10: "EES", average: 79, male: 81, female: 77 },
  { state10: "JGL", average: 75, male: 77, female: 73 },
  { state10: "LKS", average: 77, male: 79, female: 75 },
  { state10: "NBG", average: 76, male: 78, female: 74 },
  { state10: "PAA", average: 73, male: 75, female: 71 },
  { state10: "RAA", average: 74, male: 76, female: 72 },
  { state10: "State X", average: 70, male: 72, female: 68 },
  { state10: "UNS", average: 78, male: 80, female: 76 },
  { state10: "UTY", average: 80, male: 82, female: 78 },
  { state10: "WBG", average: 76, male: 78, female: 74 },
  { state10: "WES", average: 81, male: 83, female: 79 },
  { state10: "WRP", average: 79, male: 81, female: 77 },
]

// Simple Stat Card Component
const StatCard = ({ icon, label, value, color = "bg-primary", description = '' }: { icon: React.ReactNode, label: string, value: string, color?: string, description?: string }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`rounded-full ${color}/15 p-3`}>{icon}</div>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function EducationStatsDashboard({ learnersData, schoolsData, enrollmentData }: { learnersData: any; schoolsData: any; enrollmentData: EnrollmentData[] }) {
  console.log(enrollmentData)

  // Calculate totals
  const calculateLearnerTotals = () => {
    let totalMale = 0;
    let totalFemale = 0;
    let totalNew = 0;
    let totalWithDisability = 0;

    // Iterate through each school in the array
    enrollmentData?.forEach((school) => {
      // Only process if enrollment is complete
      if (school?.isEnrollmentComplete?.some((item) => item.learnerEnrollmentComplete === true)) {
        // Loop through each grade level in learnerStats
        Object.values(school?.learnerStats || {}).forEach((gradeStats: any) => {
          totalMale += gradeStats.male || 0;
          totalFemale += gradeStats.female || 0;
          totalWithDisability += gradeStats.withDisability || 0;
          // For new students, we'll use currentYear totals
          totalNew += gradeStats.currentYear?.total || 0;
        });
      }
    });

    return {
      totalLearners: totalMale + totalFemale,
      totalMale,
      totalFemale,
      totalNew,
      totalWithDisability,
    };
  }

  const calculateSchoolTotals = () => {
    let totalPrimary = 0
    let totalSecondary = 0
    let totalECD = 0
    let totalCGS = 0
    let totalALP = 0
    let totalASP = 0

    schoolsData.forEach((state: any) => {
      totalPrimary += state.PRI
      totalSecondary += state.SEC
      totalECD += state.ECD
      totalCGS += state.CGS
      totalALP += state.ALP
      totalASP += state.ASP
    })

    const totalSchools = totalPrimary + totalSecondary + totalECD + totalCGS + totalALP + totalASP

    return {
      totalSchools,
      totalPrimary,
      totalSecondary,
      totalECD,
      totalCGS,
      totalALP,
      totalASP,
    }
  }

  const calculateClassroomTotals = () => {
    let totalClassrooms = 0
    let totalPermanent = 0
    let totalTemporary = 0
    let totalOutdoor = 0

    classroomsData.forEach((state) => {
      totalClassrooms += state.total
      totalPermanent += state.permanent
      totalTemporary += state.temporary
      totalOutdoor += state.outdoor
    })

    return {
      totalClassrooms,
      totalPermanent,
      totalTemporary,
      totalOutdoor,
    }
  }

  const calculateAverageAttendance = () => {
    let totalAverage = 0
    let totalMale = 0
    let totalFemale = 0
    let count = 0

    attendanceData.forEach((state) => {
      if (state.state10 !== "State X") {
        // Exclude test data
        totalAverage += state.average
        totalMale += state.male
        totalFemale += state.female
        count++
      }
    })

    return {
      averageAttendance: Math.round(totalAverage / count),
      averageMale: Math.round(totalMale / count),
      averageFemale: Math.round(totalFemale / count),
    }
  }

  const learnerTotals = calculateLearnerTotals()
  const schoolTotals = calculateSchoolTotals()
  const classroomTotals = calculateClassroomTotals()
  const attendanceAverages = calculateAverageAttendance()
  return (
    <div className="py-4">
      <div className="px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">South Sudan Education Statistics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive data on schools, learners, classrooms and attendance across all states
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full"> 
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview"  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="schools"  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none">
              <span className="flex items-center gap-2">
                <School className="h-4 w-4" />
                <span className="hidden sm:inline">Schools</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="learners"  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Learners</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="classrooms"  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Classrooms</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="attendance"  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none">
              <span className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Attendance</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="distribution"  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none">
              <span className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Distribution</span>
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<School className="h-5 w-5 text-primary" />}
                label="Total Schools"
                value={schoolTotals.totalSchools.toLocaleString()}
                description="Across all states"
              />
              <StatCard
                icon={<Users className="h-5 w-5 text-primary" />}
                label="Total Learners"
                value={learnerTotals.totalLearners.toLocaleString()}
                description="Enrolled students"
              />
              <StatCard
                icon={<Building2 className="h-5 w-5 text-emerald-500" />}
                label="Total Classrooms"
                value={classroomTotals.totalClassrooms.toLocaleString()}
                color="bg-emerald-500"
                description="All types combined"
              />
              <StatCard
                icon={<ClipboardCheck className="h-5 w-5 text-amber-500" />}
                label="Average Attendance"
                value={`${attendanceAverages.averageAttendance}%`}
                color="bg-amber-500"
                description="National average"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Gender Distribution</h4>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">
                            Male ({Math.round((learnerTotals.totalMale / learnerTotals.totalLearners) * 100)}%)
                          </span>
                          <span className="text-xs">{learnerTotals.totalMale.toLocaleString()}</span>
                        </div>
                        <Progress
                          value={(learnerTotals.totalMale / learnerTotals.totalLearners) * 100}
                          className="h-2"
                        />

                        <div className="flex justify-between mb-1 mt-3">
                          <span className="text-xs">
                            Female ({Math.round((learnerTotals.totalFemale / learnerTotals.totalLearners) * 100)}%)
                          </span>
                          <span className="text-xs">{learnerTotals.totalFemale.toLocaleString()}</span>
                        </div>
                        <Progress
                          value={(learnerTotals.totalFemale / learnerTotals.totalLearners) * 100}
                          className="h-2 bg-muted [&>div]:bg-rose-500"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">New Enrollments</h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">{learnerTotals.totalNew.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round((learnerTotals.totalNew / learnerTotals.totalLearners) * 100)}% of total)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">School Types</h4>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Primary</span>
                          <span className="text-xs">{schoolTotals.totalPrimary.toLocaleString()}</span>
                        </div>
                        <Progress
                          value={(schoolTotals.totalPrimary / schoolTotals.totalSchools) * 100}
                          className="h-2"
                        />

                        <div className="flex justify-between mb-1 mt-3">
                          <span className="text-xs">Secondary</span>
                          <span className="text-xs">{schoolTotals.totalSecondary.toLocaleString()}</span>
                        </div>
                        <Progress
                          value={(schoolTotals.totalSecondary / schoolTotals.totalSchools) * 100}
                          className="h-2 bg-muted [&>div]:bg-emerald-500"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Classroom Types</h4>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Permanent</span>
                          <span className="text-xs">{classroomTotals.totalPermanent.toLocaleString()}</span>
                        </div>
                        <Progress
                          value={(classroomTotals.totalPermanent / classroomTotals.totalClassrooms) * 100}
                          className="h-2 bg-muted [&>div]:bg-cyan-500"
                        />

                        <div className="flex justify-between mb-1 mt-3">
                          <span className="text-xs">Temporary</span>
                          <span className="text-xs">{classroomTotals.totalTemporary.toLocaleString()}</span>
                        </div>
                        <Progress
                          value={(classroomTotals.totalTemporary / classroomTotals.totalClassrooms) * 100}
                          className="h-2 bg-muted [&>div]:bg-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Top 5 States by Enrollment</h3>
                  <div className="space-y-4">
                    {enrollmentData
                      // Group schools by state and calculate totals
                      .reduce((acc: any[], school) => {
                        // Only include schools with complete enrollment
                        if (!school?.isEnrollmentComplete?.some((item) => item.learnerEnrollmentComplete === true)) {
                          return acc;
                        }

                        const stateIndex = acc.findIndex(item => item.state10 === school.state10);
                        const schoolTotals = Object.values(school.learnerStats || {}).reduce(
                          (total: any, grade: any) => ({
                            male: (total.male || 0) + (grade.male || 0),
                            female: (total.female || 0) + (grade.female || 0),
                          }),
                          { male: 0, female: 0 }
                        );

                        if (stateIndex === -1) {
                          acc.push({
                            state10: school.state10,
                            male: schoolTotals.male,
                            female: schoolTotals.female,
                          });
                        } else {
                          acc[stateIndex].male += schoolTotals.male;
                          acc[stateIndex].female += schoolTotals.female;
                        }
                        return acc;
                      }, [])
                      .filter((state: any) => state.state10 !== "State X")
                      .sort((a: any, b: any) => (b.male + b.female) - (a.male + a.female))
                      .slice(0, 5)
                      .map((state: any, index: any) => {
                        const total = state.male + state.female;
                        const percentage = (total / learnerTotals.totalLearners) * 100;

                        return (
                          <div key={state.state10} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                                >
                                  {index + 1}
                                </Badge>
                                <span className="font-medium">{state.state10}</span>
                              </div>
                              <span className="text-sm">{total.toLocaleString()} learners</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Male: {state.male.toLocaleString()}</span>
                              <span>Female: {state.female.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">School Statistics</h2>
                    <p className="text-muted-foreground">Distribution of schools across states</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-sm">Primary: {schoolTotals.totalPrimary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm">Secondary: {schoolTotals.totalSecondary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">ECD: {schoolTotals.totalECD}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm">ALP: {schoolTotals.totalALP}</span>
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">Primary</TableHead>
                      <TableHead className="text-right">Secondary</TableHead>
                      <TableHead className="text-right">ECD</TableHead>
                      <TableHead className="text-right">ALP</TableHead>
                      <TableHead className="text-right">ASP</TableHead>
                      <TableHead className="text-right">CGS</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schoolsData.map((state: any) => {
                      const total = state.PRI + state.SEC + state.ECD + state.ALP + state.ASP + state.CGS
                      return (
                        <TableRow key={state.state10}>
                          <TableCell className="font-medium">{state.state10}</TableCell>
                          <TableCell className="text-right">{state.PRI}</TableCell>
                          <TableCell className="text-right">{state.SEC}</TableCell>
                          <TableCell className="text-right">{state.ECD}</TableCell>
                          <TableCell className="text-right">{state.ALP}</TableCell>
                          <TableCell className="text-right">{state.ASP}</TableCell>
                          <TableCell className="text-right">{state.CGS}</TableCell>
                          <TableCell className="text-right font-semibold">{total}</TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">{schoolTotals.totalPrimary}</TableCell>
                      <TableCell className="text-right font-bold">{schoolTotals.totalSecondary}</TableCell>
                      <TableCell className="text-right font-bold">{schoolTotals.totalECD}</TableCell>
                      <TableCell className="text-right font-bold">{schoolTotals.totalALP}</TableCell>
                      <TableCell className="text-right font-bold">{schoolTotals.totalASP}</TableCell>
                      <TableCell className="text-right font-bold">{schoolTotals.totalCGS}</TableCell>
                      <TableCell className="text-right font-bold">{schoolTotals.totalSchools}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learners Tab */}
          <TabsContent value="learners">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Learner Statistics</h2>
                    <p className="text-muted-foreground">Distribution of learners across states</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-sm">Male: {learnerTotals.totalMale.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span className="text-sm">Female: {learnerTotals.totalFemale.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">New: {learnerTotals.totalNew.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">Male</TableHead>
                      <TableHead className="text-right">Female</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">New</TableHead>
                      <TableHead className="text-right">With Disability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      "AAA", "CES", "EES", "JGL", "LKS", "NBG", "PAA", 
                      "RAA", "UNS", "UTY", "WBG", "WES", "WRP"
                    ].map((stateCode) => {
                      // Get all schools for this state with complete enrollment
                      const stateSchools = enrollmentData.filter(
                        school => school.state10 === stateCode && 
                        school.isEnrollmentComplete?.some(item => item.learnerEnrollmentComplete === true)
                      );

                      // Calculate state totals
                      const stateTotals = stateSchools.reduce((total, school) => {
                        const schoolTotals = Object.values(school.learnerStats || {}).reduce(
                          (gradeTotal: any, grade: any) => ({
                            male: (gradeTotal.male || 0) + (grade.male || 0),
                            female: (gradeTotal.female || 0) + (grade.female || 0),
                            withDisability: (gradeTotal.withDisability || 0) + (grade.withDisability || 0),
                            new: (gradeTotal.new || 0) + (grade.currentYear?.total || 0),
                          }),
                          { male: 0, female: 0, withDisability: 0, new: 0 }
                        );
                        return {
                          male: total.male + schoolTotals.male,
                          female: total.female + schoolTotals.female,
                          withDisability: total.withDisability + schoolTotals.withDisability,
                          new: total.new + schoolTotals.new,
                        };
                      }, { male: 0, female: 0, withDisability: 0, new: 0 });

                      const total = stateTotals.male + stateTotals.female;

                      return (
                        <TableRow key={stateCode}>
                          <TableCell className="font-medium">{stateCode}</TableCell>
                          <TableCell className="text-right">{stateTotals.male.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{stateTotals.female.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">{total.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{stateTotals.new.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{stateTotals.withDisability.toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        {learnerTotals.totalMale.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {learnerTotals.totalFemale.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {learnerTotals.totalLearners.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {learnerTotals.totalNew.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {learnerTotals.totalWithDisability.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classrooms Tab */}
          <TabsContent value="classrooms">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Classroom Statistics</h2>
                    <p className="text-muted-foreground">Distribution of classrooms by type across states</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                      <span className="text-sm">Permanent: {classroomTotals.totalPermanent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Temporary: {classroomTotals.totalTemporary.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm">Outdoor: {classroomTotals.totalOutdoor.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* statcards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-cyan-500/15 p-2">
                          <Building2 className="h-5 w-5 text-cyan-500" />
                        </div>
                        <h3 className="text-lg font-semibold">Permanent Classrooms</h3>
                      </div>
                      <p className="text-3xl font-bold mb-1">{classroomTotals.totalPermanent.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {Math.round((classroomTotals.totalPermanent / classroomTotals.totalClassrooms) * 100)}% of total
                        classrooms
                      </p>
                      <Progress
                        value={(classroomTotals.totalPermanent / classroomTotals.totalClassrooms) * 100}
                        className="h-2 bg-muted [&>div]:bg-cyan-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-amber-500/15 p-2">
                          <Building2 className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-semibold">Temporary Classrooms</h3>
                      </div>
                      <p className="text-3xl font-bold mb-1">{classroomTotals.totalTemporary.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {Math.round((classroomTotals.totalTemporary / classroomTotals.totalClassrooms) * 100)}% of total
                        classrooms
                      </p>
                      <Progress
                        value={(classroomTotals.totalTemporary / classroomTotals.totalClassrooms) * 100}
                        className="h-2 bg-muted [&>div]:bg-amber-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-emerald-500/15 p-2">
                          <Building2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-semibold">Outdoor Learning Spaces</h3>
                      </div>
                      <p className="text-3xl font-bold mb-1">{classroomTotals.totalOutdoor.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {Math.round((classroomTotals.totalOutdoor / classroomTotals.totalClassrooms) * 100)}% of total
                        classrooms
                      </p>
                      <Progress
                        value={(classroomTotals.totalOutdoor / classroomTotals.totalClassrooms) * 100}
                        className="h-2 bg-muted [&>div]:bg-emerald-500"
                      />
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Permanent</TableHead>
                      <TableHead className="text-right">Temporary</TableHead>
                      <TableHead className="text-right">Outdoor</TableHead>
                      <TableHead className="text-right">Permanent %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classroomsData.map((state) => {
                      const permanentPercent = Math.round((state.permanent / state.total) * 100)
                      return (
                        <TableRow key={state.state10}>
                          <TableCell className="font-medium">{state.state10}</TableCell>
                          <TableCell className="text-right font-semibold">{state.total.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{state.permanent.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{state.temporary.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{state.outdoor.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Progress value={permanentPercent} className="h-2 w-16" />
                              <span>{permanentPercent}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        {classroomTotals.totalClassrooms.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {classroomTotals.totalPermanent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {classroomTotals.totalTemporary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {classroomTotals.totalOutdoor.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {Math.round((classroomTotals.totalPermanent / classroomTotals.totalClassrooms) * 100)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Attendance Statistics</h2>
                    <p className="text-muted-foreground">Average attendance rates across states</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-sm">Male: {attendanceAverages.averageMale}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span className="text-sm">Female: {attendanceAverages.averageFemale}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Average: {attendanceAverages.averageAttendance}%</span>
                    </div>
                  </div>
                </div>

                {/* statcards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-amber-500/15 p-2">
                          <ClipboardCheck className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-semibold">National Average</h3>
                      </div>
                      <p className="text-3xl font-bold mb-1">{attendanceAverages.averageAttendance}%</p>
                      <p className="text-sm text-muted-foreground mb-4">Overall attendance rate</p>
                      <Progress
                        value={attendanceAverages.averageAttendance}
                        max={100}
                        className="h-2 bg-muted [&>div]:bg-amber-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-primary/15 p-2">
                          <ClipboardCheck className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">Male Attendance</h3>
                      </div>
                      <p className="text-3xl font-bold mb-1">{attendanceAverages.averageMale}%</p>
                      <p className="text-sm text-muted-foreground mb-4">Average male attendance</p>
                      <Progress value={attendanceAverages.averageMale} max={100} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-rose-500/15 p-2">
                          <ClipboardCheck className="h-5 w-5 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-semibold">Female Attendance</h3>
                      </div>
                      <p className="text-3xl font-bold mb-1">{attendanceAverages.averageFemale}%</p>
                      <p className="text-sm text-muted-foreground mb-4">Average female attendance</p>
                      <Progress
                        value={attendanceAverages.averageFemale}
                        max={100}
                        className="h-2 bg-muted [&>div]:bg-rose-500"
                      />
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">Average</TableHead>
                      <TableHead className="text-right">Male</TableHead>
                      <TableHead className="text-right">Female</TableHead>
                      <TableHead className="text-right">Gender Gap</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData
                      .filter((state) => state.state10 !== "State X")
                      .map((state) => {
                        const genderGap = state.male - state.female
                        return (
                          <TableRow key={state.state10}>
                            <TableCell className="font-medium">{state.state10}</TableCell>
                            <TableCell className="text-right font-semibold">{state.average}%</TableCell>
                            <TableCell className="text-right">{state.male}%</TableCell>
                            <TableCell className="text-right">{state.female}%</TableCell>
                            <TableCell className="text-right">
                              <span className={genderGap > 0 ? "text-primary" : "text-rose-500"}>
                                {genderGap > 0 ? "+" : ""}
                                {genderGap}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="w-full flex items-center gap-2">
                                <Progress value={state.average} max={100} className="h-2" />
                                <span className="text-xs w-8">{state.average}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Gender Distribution by State</h3>
                  <div className="space-y-6">
                    {learnersData
                      .filter((state: any) => state.state10 !== "State X")
                      .sort((a: any, b: any) => b.male + b.female - (a.male + a.female))
                      .map((state: any) => {
                        const total = state.male + state.female
                        const malePercent = total > 0 ? (state.male / total) * 100 : 0
                        const femalePercent = total > 0 ? (state.female / total) * 100 : 0

                        return (
                          <div key={state.state10} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{state.state10}</span>
                              <span className="text-sm text-muted-foreground">{total.toLocaleString()} learners</span>
                            </div>
                            <div className="flex h-4 rounded-full overflow-hidden">
                              <div
                                className="bg-primary"
                                style={{ width: `${malePercent}%` }}
                                aria-label={`Male: ${Math.round(malePercent)}%`}
                              ></div>
                              <div
                                className="bg-rose-500"
                                style={{ width: `${femalePercent}%` }}
                                aria-label={`Female: ${Math.round(femalePercent)}%`}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>Male: {Math.round(malePercent)}%</span>
                              <span>Female: {Math.round(femalePercent)}%</span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">School Type Distribution by State</h3>
                  <div className="space-y-6">
                    {schoolsData
                      .filter((state: any) => state.state10 !== "State X")
                      .sort((a: any, b: any) => {
                        const totalA = a.PRI + a.SEC + a.ECD + a.ALP + a.ASP + a.CGS
                        const totalB = b.PRI + b.SEC + b.ECD + b.ALP + b.ASP + b.CGS
                        return totalB - totalA
                      })
                      .map((state: any) => {
                        const total = state.PRI + state.SEC + state.ECD + state.ALP + state.ASP + state.CGS
                        if (total === 0) return null

                        const primaryPercent = (state.PRI / total) * 100
                        const secondaryPercent = (state.SEC / total) * 100
                        const ecdPercent = (state.ECD / total) * 100
                        const alpPercent = (state.ALP / total) * 100
                        const otherPercent = ((state.ASP + state.CGS) / total) * 100

                        return (
                          <div key={state.state10} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{state.state10}</span>
                              <span className="text-sm text-muted-foreground">{total} schools</span>
                            </div>
                            <div className="flex h-4 rounded-full overflow-hidden">
                              <div
                                className="bg-primary"
                                style={{ width: `${primaryPercent}%` }}
                                aria-label={`Primary: ${Math.round(primaryPercent)}%`}
                              ></div>
                              <div
                                className="bg-emerald-500"
                                style={{ width: `${secondaryPercent}%` }}
                                aria-label={`Secondary: ${Math.round(secondaryPercent)}%`}
                              ></div>
                              <div
                                className="bg-amber-500"
                                style={{ width: `${ecdPercent}%` }}
                                aria-label={`ECD: ${Math.round(ecdPercent)}%`}
                              ></div>
                              <div
                                className="bg-purple-500"
                                style={{ width: `${alpPercent}%` }}
                                aria-label={`ALP: ${Math.round(alpPercent)}%`}
                              ></div>
                              <div
                                className="bg-gray-500"
                                style={{ width: `${otherPercent}%` }}
                                aria-label={`Other: ${Math.round(otherPercent)}%`}
                              ></div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span>
                                  Primary: {state.PRI} ({Math.round(primaryPercent)}%)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span>
                                  Secondary: {state.SEC} ({Math.round(secondaryPercent)}%)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span>
                                  ECD: {state.ECD} ({Math.round(ecdPercent)}%)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                <span>
                                  ALP: {state.ALP} ({Math.round(alpPercent)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
