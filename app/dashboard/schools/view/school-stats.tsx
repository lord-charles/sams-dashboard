"use client"
import {
  School,
  Clock,
  GraduationCap,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


export default function SchoolStats({ schoolData, setIsModalOpen }: { schoolData: any, setIsModalOpen: (value: boolean) => void }) {
  const router = useRouter();

  const handleCreateBudget = () => {
    localStorage.setItem("selectedSchool", JSON.stringify(schoolData));

    router.push("/dashboard/grants/sbrts/budgets/create");
  }

  return (
    <div className="space-y-2">
      {/* Official Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-primary text-white p-2 rounded-lg mr-3">
              <School className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{schoolData.schoolName}</h2>
              <p className="text-xs text-gray-500">Ministry of General Education and Instruction</p>
            </div>
          </div>
          <div className="flex items-center gap-2">

            <div className="flex space-x-2">
              <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
                Update Enrollment Status
              </Button>


              <Button onClick={handleCreateBudget}>Create Budget</Button>
              <Badge variant="secondary">{schoolData?.schoolType}</Badge>

            </div>
          </div>
        </div>

      </div>

      {/* Top row - Key Identifiers */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Location Card */}
        <Card className="overflow-hidden border-gray-200 shadow-md">
          <div className="bg-gradient-to-r from-primary/100 to-primary/90 p-3">

            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                Administrative
              </Badge>
            </div>
            <CardDescription className="text-gray-100">Geographic Information</CardDescription>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">State</span>
                <span className="font-semibold bg-gray-100 px-3 py-1 rounded-md text-gray-700">
                  {schoolData.state10}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">County</span>
                <span className="font-semibold">{schoolData.county28}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Payam</span>
                <span className="font-semibold">{schoolData.payam28}</span>
              </div>
              <div className="flex items-center justify-center mt-2">
                <div className="w-full h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-700 font-medium">Administrative Unit</span>
                </div>
              </div>
            </div>
          </CardContent>

        </Card>

        {/* School Identity Card */}
        <Card className="overflow-hidden border-gray-200 shadow-md">
          <div className="bg-gradient-to-r from-primary/100 to-primary/90 p-3">

            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <School className="h-5 w-5" />
                Identity
              </CardTitle>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {schoolData.schoolType === "PRI" ? "Primary" : schoolData.schoolType}
              </Badge>
            </div>
            <CardDescription className="text-blue-100">Official Registration Information</CardDescription>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">School Code</span>
                <span className="font-semibold bg-blue-50 px-3 py-1 rounded-md text-blue-700">{schoolData.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">EMIS ID</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {schoolData.emisId}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <Badge
                  variant={schoolData.schoolStatus.isOpen === "closed" ? "destructive" : "default"}
                  className="capitalize"
                >
                  {schoolData.schoolStatus.isOpen}
                </Badge>
              </div>
              <div className="flex items-center justify-center mt-2">
                <div className="w-full h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-700 font-medium">Ownership: {schoolData.schoolOwnerShip}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Operation Card */}
        <Card className="overflow-hidden border-gray-200 shadow-md">
          <div className="bg-gradient-to-r from-primary/100 to-primary/90 p-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Operation
              </CardTitle>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {schoolData.operation.dayBoarding
                  ? "Boarding"
                  : schoolData.operation.boarding
                    ? "Boarding"
                    : "Day School"}
              </Badge>
            </div>
            <CardDescription className="text-green-100">Operational Details</CardDescription>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">School Type</span>
                <Badge variant="secondary" className="font-semibold">
                  {schoolData.operation.dayBoarding
                    ? "Day & Boarding"
                    : schoolData.operation.boarding
                      ? "Boarding"
                      : "Day School"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Fee Required</span>
                <span className="font-semibold">{schoolData.operation.feePaid ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Fee Amount</span>
                <span className="font-semibold bg-green-50 px-3 py-1 rounded-md text-green-700">
                  {schoolData.operation.feeAmount.toLocaleString()} SSP
                </span>
              </div>
              <div className="flex items-center justify-center mt-2">
                <div className="w-full h-10 bg-green-50 rounded-md flex items-center justify-center">
                  <span className="text-xs text-green-700 font-medium">Academic Year: {schoolData.calendar.year}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Card */}
        <Card className="overflow-hidden border-gray-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/100 to-primary/90 p-3">

            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5" />
                Academics
              </CardTitle>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {schoolData.subjects.length} Subjects
              </Badge>
            </div>
            <CardDescription className="text-amber-100">Curriculum Information</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 mb-2 block">Core Subjects</span>
                <div className="flex flex-wrap gap-2">
                  {schoolData.subjects.slice(0, 5).map((subject: string) => (
                    <Badge key={subject} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center mt-2">
                <div className="w-full h-10 bg-amber-50 rounded-md flex items-center justify-center">
                  <span className="text-xs text-amber-700 font-medium">
                    {schoolData.subjects.length} Total Subjects
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
