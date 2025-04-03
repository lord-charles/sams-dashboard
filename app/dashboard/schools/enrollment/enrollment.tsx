"use client"

import { useState } from "react"
import EnrollmentStats from "./enrollment-stats"
import SchoolEnrollmentTable, { type School } from "./school-table-enrollment/schools"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, GraduationCap } from "lucide-react"

export default function Enrollment({ schools,allSchools }: { schools: School[], allSchools: School[] }) {
  const [activeTab, setActiveTab] = useState("stats")

  return (
    <div className="space-y-4">
      <Tabs defaultValue="stats" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Enrollment Statistics</span>
          </TabsTrigger>
          <TabsTrigger value="schools" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>School Enrollment</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="mt-2 border rounded-lg">
          <EnrollmentStats allSchools={allSchools} schoolsData={schools} />
        </TabsContent>
        <TabsContent value="schools" className="mt-2 border rounded-lg">
          <SchoolEnrollmentTable schools={schools} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

