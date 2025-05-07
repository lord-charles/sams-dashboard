"use client";

import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Users,
  GraduationCap,
  UserCheck,
  UserPlus,
  Book,
  Clock,
  Award,
} from "lucide-react";

import { base_url } from "@/app/utils/baseUrl";

import axios from "axios";

import LearnersTable from "./learner-table/leaners";

import { TableSkeleton } from "@/components/skeletons/table-loading";

import TeachersTable from "./teacher-table/teachers";

import NoTeachersAvailable from "./NoTeachersAvailable";

import NoLearnersAvailable from "./NoLearnersAvailable";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,

} from "recharts";
import { useRouter, useSearchParams } from "next/navigation";

interface Stats {
  totalFemale: number;
  totalMale: number;
  femaleWithDisabilities: number;
  maleWithDisabilities: number;
  droppedOutFemale: number;
  droppedOutMale: number;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  subtext?: string[];
}

const calculatePercentage = (value: number, total: number): string => {
  if (!total || total <= 0) return "0.0";
  return ((value / total) * 100).toFixed(1);
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  subtext,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {subtext && (
        <div className="mt-2 space-y-1">
          {subtext.map((text, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              {text}
            </p>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default function Community({
  code,
  state10,
  payam28,
  county28,
  school,
  education,
  schoolData,
}: {
  code: string;
  state10: string;
  payam28: string;
  county28: string;
  school: string;
  education: string;
  schoolData: any;
}) {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [teachers, setteachers] = useState<any[]>([]);
  const [stats, setstats] = useState<Stats>({
    totalFemale: 0,
    totalMale: 0,
    femaleWithDisabilities: 0,
    maleWithDisabilities: 0,
    droppedOutFemale: 0,
    droppedOutMale: 0,
  });

  const [activeTab, setActiveTab] = useState("learners");

  const searchParams = useSearchParams();
  const router = useRouter();

  // Get tab from URL or default to "overview"
  const tab2 = searchParams.get("tab2") || "learners";

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab2", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const fetchData = async (code: string) => {
    try {
      setIsloading(true);

      const [studentsRes, teachersRes, stats] = await Promise.all([
        axios.post(`${base_url}data-set/2023_data/get/learnersv2`, {
          code,
        }),

        axios.post(`${base_url}user/getTeachersByCode`, { code }),

        axios.post(`${base_url}data-set/overallMaleFemaleStat`, { code }),
      ]);

      setStudents(studentsRes.data);

      setteachers(teachersRes.data);

      setstats(stats.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchData(code);
  }, [code]);

  function calculateTeacherStatistics(teachers: any[]) {
    const stats = {
      male: 0,

      female: 0,

      trained: 0,

      untrained: 0,
    };

    teachers.forEach((teacher) => {
      // Count gender

      if (teacher.gender === "M") {
        stats.male += 1;
      } else if (teacher.gender === "F") {
        stats.female += 1;
      }

      // Count training level

      if (teacher.professionalQual === "Trained") {
        stats.trained += 1;
      } else if (teacher.professionalQual === "Untrained") {
        stats.untrained += 1;
      }
    });

    return stats;
  }

  const teacherStats = calculateTeacherStatistics(teachers);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];


  return (
    <div className=" space-y-8">
      <Tabs value={tab2} onValueChange={handleTabChange}>
        <TabsList className="h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
          <TabsTrigger className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent" value="learners">Learners</TabsTrigger>

          <TabsTrigger className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent" value="teachers">Teachers</TabsTrigger>

          <TabsTrigger className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent" value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="learners" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Learners"
              value={String(stats.totalMale + stats.totalFemale)}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              description="Total enrolled learners"
              subtext={[
                `With Disabilities: ${stats.maleWithDisabilities + stats.femaleWithDisabilities
                } learners`,
                `${calculatePercentage(
                  stats.maleWithDisabilities + stats.femaleWithDisabilities,
                  stats.totalMale + stats.totalFemale
                )}% of total learners`,
              ]}
            />
            <StatCard
              title="Male Learners"
              value={`${calculatePercentage(
                stats.totalMale,
                stats.totalMale + stats.totalFemale
              )}%`}
              icon={<Users className="h-8 w-8 text-blue-500" />}
              subtext={[
                `Total: ${stats.totalMale?.toLocaleString()} learners`,
                `With Disabilities: ${calculatePercentage(
                  stats.maleWithDisabilities,
                  stats.totalMale
                )}% (${stats.maleWithDisabilities?.toLocaleString()})`,
              ]}
            />
            <StatCard
              title="Female Learners"
              value={`${calculatePercentage(
                stats.totalFemale,
                stats.totalMale + stats.totalFemale
              )}%`}
              icon={<Users className="h-8 w-8 text-pink-500" />}
              subtext={[
                `Total: ${stats.totalFemale?.toLocaleString()} learners`,
                `With Disabilities: ${calculatePercentage(
                  stats.femaleWithDisabilities,
                  stats.totalFemale
                )}% (${stats.femaleWithDisabilities?.toLocaleString()})`,
              ]}
            />
            <StatCard
              title="Average Attendance"
              value="94.4%"
              icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
              description="Last 30 days"
            />
          </div>

          <div>
            {isLoading ? (
              <div>
                <TableSkeleton
                  title="Learners"
                  description="Manage and view learner information"
                  columns={6}
                  rows={10}
                />
              </div>
            ) : students.length > 0 ? (
              <LearnersTable learners={students} />
            ) : (
              <NoLearnersAvailable
                state10={state10}
                payam28={payam28}
                county28={county28}
                code={code}
                school={school}
                education={education}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Teachers"
              value={teachers?.length.toString() || "0"}
              icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
              description="Active faculty members"
            />

            <StatCard
              title="Male Teachers"
              value={teacherStats.male.toString() || "0"}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              description="Number of male teachers"
            />

            <StatCard
              title="Female Teachers"
              value={teacherStats.female.toString() || "0"}
              icon={<Book className="h-4 w-4 text-muted-foreground" />}
              description="Number of female teachers"
            />

            <StatCard
              title="Untrained Teachers"
              value={teacherStats.untrained.toString() || "0"}
              icon={<Award className="h-4 w-4 text-muted-foreground" />}
              description="Number of untrained teachers"
            />

            <StatCard
              title="Trained Teachers"
              value={teacherStats.trained.toString() || "0"}
              icon={<Award className="h-4 w-4 text-muted-foreground" />}
              description="Number of trained teachers"
            />
          </div>

          {isLoading ? (
            <div>
              <TableSkeleton
                title="Teachers"
                description="Manage and view teacher information"
                columns={6}
                rows={10}
              />
            </div>
          ) : teachers.length > 0 ? (
            <TeachersTable teachers={teachers} />
          ) : (
            <NoTeachersAvailable
              fetchData={() => fetchData(code)}
              state10={state10}
              payam28={payam28}
              county28={county28}
              code={code}
              school={school}
            />
          )}
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Overview</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Teachers</p>

                  <p className="text-2xl font-bold">
                    {dummySchoolData.staffing.teachers}
                  </p>
                </div>

                <div className="bg-primary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Admin Staff</p>

                  <p className="text-2xl font-bold">
                    {dummySchoolData.staffing.adminStaff}
                  </p>
                </div>

                <div className="bg-primary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Support Staff</p>

                  <p className="text-2xl font-bold">
                    {dummySchoolData.staffing.supportStaff}
                  </p>
                </div>

                <div className="bg-primary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Student-Teacher Ratio
                  </p>

                  <p className="text-2xl font-bold">
                    1:{dummySchoolData.staffing.supportStaff}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Distribution</CardTitle>
            </CardHeader>

            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Teachers", value: dummySchoolData.staffing.teachers },
                      { name: "Admin", value: dummySchoolData.staffing.adminStaff },
                      { name: "Support", value: dummySchoolData.staffing.supportStaff },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.values(dummySchoolData.staffing).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const dummySchoolData = {
  staffing: {
    teachers: 50,
    adminStaff: 20,
    supportStaff: 30,
  },
};
