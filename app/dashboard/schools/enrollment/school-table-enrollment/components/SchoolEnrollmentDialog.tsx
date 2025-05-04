
"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  Calendar
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface SchoolStats {
  total: number;
  male: number;
  female: number;
  withDisability: number;
  currentYear?: {
    total: number;
    male: number;
    female: number;
    withDisability: number;
  };
}

interface EnrollmentInfo {
  year: number;
  isComplete: boolean;
  completedBy: string;
  comments: string;
  percentageComplete: number;
  learnerEnrollmentComplete: boolean;
  _id: string;
}

interface School {
  _id: string;
  code: string;
  payam28: string;
  state10: string;
  county28: string;
  schoolName: string;
  schoolOwnerShip: string;
  schoolType: string;
  emisId: string;
  isEnrollmentComplete: EnrollmentInfo[];
  learnerStats: Record<string, SchoolStats>;
}

interface SchoolEnrollmentDialogProps {
  school: School;
}

export function SchoolEnrollmentDialog({ school }: SchoolEnrollmentDialogProps) {
  const currentYear = new Date().getFullYear();
  const enrollment = school.isEnrollmentComplete?.find((e) => e.year === currentYear) || school.isEnrollmentComplete?.[0];

  // Sort grades numerically (P1, P2, P3, etc.)
  const grades = Object.keys(school.learnerStats || {}).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    return numA - numB;
  });

  // Calculate totals for all metrics
  const totalCurrentStudents = grades.reduce((sum, grade) => {
    const currentYearTotal = school.learnerStats[grade]?.currentYear?.total;
    return sum + (typeof currentYearTotal === 'number' ? currentYearTotal : 0);
  }, 0);

  const totalMaleStudents = grades.reduce((sum, grade) => {
    const currentYearMale = school.learnerStats[grade]?.currentYear?.male;
    return sum + (typeof currentYearMale === 'number' ? currentYearMale : 0);
  }, 0);

  const totalFemaleStudents = grades.reduce((sum, grade) => {
    const currentYearFemale = school.learnerStats[grade]?.currentYear?.female;
    return sum + (typeof currentYearFemale === 'number' ? currentYearFemale : 0);
  }, 0);

  const totalWithDisability = grades.reduce((sum, grade) => {
    const currentYearWithDisability = school.learnerStats[grade]?.currentYear?.withDisability;
    return sum + (typeof currentYearWithDisability === 'number' ? currentYearWithDisability : 0);
  }, 0);

  // Only allow valid metrics (not currentYear)
  type LearnerMetric = "total" | "male" | "female" | "withDisability";
  const getChangeStatus = (grade: string, metric: LearnerMetric): { icon: JSX.Element; percent: number } => {
    const current = school?.learnerStats[grade]?.currentYear?.[metric] ?? 0;
    const historical = school.learnerStats[grade]?.[metric] ?? 0;

    if (current === historical) return { icon: <Minus className="w-3 h-3 text-gray-500" />, percent: 0 };
    if (current > historical) return { icon: <ArrowUp className="w-3 h-3 text-green-500" />, percent: historical === 0 ? 100 : Math.round((current / historical - 1) * 100) };
    return { icon: <ArrowDown className="w-3 h-3 text-red-500" />, percent: historical === 0 ? 0 : Math.round((1 - current / historical) * 100) };
  };

  // Prepare data for charts
  const genderDistributionData = [
    { name: 'Male', value: totalMaleStudents, color: '#6366f1' },
    { name: 'Female', value: totalFemaleStudents, color: '#ec4899' },
  ];

  const gradeDistributionData = grades.map(grade => ({
    grade,
    Male: school.learnerStats[grade]?.currentYear?.male || 0,
    Female: school.learnerStats[grade]?.currentYear?.female || 0,
    WithDisability: school.learnerStats[grade]?.currentYear?.withDisability || 0,
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary hover:bg-muted" title="View Details">
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-primary/5 px-4 sm:px-6 py-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <DialogTitle className="flex flex-wrap items-center gap-2 text-xl font-semibold">
              {school.schoolName}
              <Badge variant="outline" className="bg-primary/10 text-primary font-medium">
                {school.schoolType}
              </Badge>
            </DialogTitle>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="font-semibold text-foreground">EMIS:</span> {school.emisId}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold text-foreground">Code:</span> {school.code}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold text-foreground">Ownership:</span> {school.schoolOwnerShip}
              </span>
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <span className="flex items-center gap-1">
                <span className="font-semibold text-foreground">Payam:</span> {school.payam28}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold text-foreground">County:</span> {school.county28}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold text-foreground">State:</span> {school.state10}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:ml-auto">
            <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-md text-xs">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                <span className="font-medium">{enrollment?.year || currentYear}</span> Enrollment
              </span>
              <Badge variant={enrollment?.isComplete ? "default" : "destructive"} className={enrollment?.isComplete ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                {enrollment?.isComplete ? "Complete" : "Incomplete"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Enrollment Status & Comments */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Completion:</span>
                <Progress value={enrollment?.percentageComplete || 0} className="h-2 w-28 bg-muted" />
                <span className="text-xs font-mono">{enrollment?.percentageComplete || 0}%</span>
              </div>
              {enrollment?.completedBy && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Completed by:</span> <span className="font-medium">{enrollment.completedBy}</span>
                </div>
              )}
            </div>

            {enrollment?.comments && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-md">
                <h4 className="text-amber-800 text-sm font-medium">Comments:</h4>
                <p className="text-sm text-amber-700">{enrollment.comments}</p>
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
                <div className="text-xl md:text-3xl font-bold">{totalCurrentStudents}</div>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">Total Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
                <div className="text-xl md:text-3xl font-bold text-blue-600">{totalMaleStudents}</div>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">Male Students</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalCurrentStudents > 0 ? `${Math.round((totalMaleStudents / totalCurrentStudents) * 100)}%` : '0%'} of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
                <div className="text-xl md:text-3xl font-bold text-pink-600">{totalFemaleStudents}</div>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">Female Students</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalCurrentStudents > 0 ? `${Math.round((totalFemaleStudents / totalCurrentStudents) * 100)}%` : '0%'} of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
                <div className="text-xl md:text-3xl font-bold text-amber-600">{totalWithDisability}</div>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">Students with Disability</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalCurrentStudents > 0 ? `${Math.round((totalWithDisability / totalCurrentStudents) * 100)}%` : '0%'} of total
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid grid-cols-3 max-w-sm mb-4">
              <TabsTrigger value="table">Enrollment Table</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60">
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Male</TableHead>
                      <TableHead className="text-right">Female</TableHead>
                      <TableHead className="text-right">With Disability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map(grade => {
                      const stats: SchoolStats['currentYear'] | undefined = school.learnerStats[grade]?.currentYear;
                      const totalChange = getChangeStatus(grade, 'total');
                      const maleChange = getChangeStatus(grade, 'male');
                      const femaleChange = getChangeStatus(grade, 'female');

                      return (
                        <TableRow key={grade} className="border-t border-muted hover:bg-muted/20">
                          <TableCell className="font-medium">{grade}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span>{stats?.total ?? 0}</span>
                              {totalChange.icon}


                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-blue-600 font-medium">{stats?.male ?? 0}</span>
                              {maleChange.icon}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-pink-600 font-medium">{stats?.female ?? 0}</span>
                              {femaleChange.icon}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-amber-600 font-medium">{stats?.withDisability ?? 0}</span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/30 font-medium">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{totalCurrentStudents}</TableCell>
                      <TableCell className="text-right text-blue-600">{totalMaleStudents}</TableCell>
                      <TableCell className="text-right text-pink-600">{totalFemaleStudents}</TableCell>
                      <TableCell className="text-right text-amber-600">{totalWithDisability}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="charts">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-4">Gender Distribution</h3>
                    <div className="h-[200px] md:h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genderDistributionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={50}
                            dataKey="value"
                            nameKey="name"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {genderDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend />
                          <RechartsTooltip formatter={(value) => [`${value} students`, 'Count']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-4">Grade Distribution</h3>
                    <div className="h-[200px] md:h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={gradeDistributionData}
                          margin={{ top: 5, right: 30, left: 0, bottom: 15 }}
                        >
                          <XAxis dataKey="grade" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="Male" fill="#6366f1" />
                          <Bar dataKey="Female" fill="#ec4899" />
                          {totalWithDisability > 0 && (
                            <Bar dataKey="WithDisability" fill="#d97706" />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-4">Enrollment Changes from Previous Records</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/60">
                            <TableHead>Grade</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">New Total</TableHead>
                            <TableHead className="text-right">Change</TableHead>
                            <TableHead className="text-right">Male Change</TableHead>
                            <TableHead className="text-right">Female Change</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {grades.map(grade => {
                            const historical: Partial<SchoolStats> = school.learnerStats[grade] ?? {};
                            const current: Partial<SchoolStats["currentYear"]> = historical.currentYear ?? {};
                            const totalChange = getChangeStatus(grade, 'total');
                            const maleChange = getChangeStatus(grade, 'male');
                            const femaleChange = getChangeStatus(grade, 'female');

                            return (
                              <TableRow key={grade} className="border-t border-muted hover:bg-muted/20">
                                <TableCell className="font-medium">{grade}</TableCell>
                                <TableCell className="text-right">{historical.total ?? 0}</TableCell>
                                <TableCell className="text-right">{current?.total ?? 0}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {totalChange.icon}
                                    <span className={totalChange.percent > 0 ? "text-green-600" : totalChange.percent < 0 ? "text-red-600" : ""}>
                                      {totalChange.percent}%
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {maleChange.icon}
                                    <span className={maleChange.percent > 0 ? "text-green-600" : maleChange.percent < 0 ? "text-red-600" : ""}>
                                      {maleChange.percent}%
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {femaleChange.icon}
                                    <span className={femaleChange.percent > 0 ? "text-green-600" : femaleChange.percent < 0 ? "text-red-600" : ""}>
                                      {femaleChange.percent}%
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t px-4 sm:px-6 py-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>

        {/* Adding DialogDescription to fix accessibility warning */}
        <DialogDescription className="sr-only">School enrollment details</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
