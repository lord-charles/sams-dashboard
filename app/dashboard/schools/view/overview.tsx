"use client"

import { useState } from "react"
import {
  Edit,
  Save,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  CreditCard,
  AlertTriangle,
  Home,
  BookOpen,
  Lightbulb,
  Droplet,
  Users,
  Wifi,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { base_url } from "@/app/utils/baseUrl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface EnrollmentComplete {
  _id: string
  year: number
  isComplete: boolean
  percentageComplete: number
  completedBy: string
  comments?: string
}

export function Overview({ schoolInfo }: { schoolInfo: any }) {
  const [schoolData, setSchoolData] = useState(schoolInfo)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("facilities")

  // Calculate classroom capacity
  const totalClassroomCapacity =
    schoolData.facilities.building.classrooms.permanent.reduce((sum: number, room: { capacity: number }) => sum + room.capacity, 0) +
    schoolData.facilities.building.classrooms.outdoor.reduce((sum: number, room: { capacity: number }) => sum + room.capacity, 0)



  // Count active network providers
  const activeNetworks = Object.entries(schoolData.cellphoneCoverage).filter(
    ([_, isActive]) => isActive === true,
  ).length



  const handleInputChange = (section: keyof any, field: string, value: any) => {
    setSchoolData((prevData: any) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const payload = {
        headTeacher: {
          name: schoolData.headTeacher?.name || null,
          phoneNumber: schoolData.headTeacher?.phoneNumber || null,
          email: schoolData.headTeacher?.email || null,
        },
        pta: {
          name: schoolData.pta?.name || null,
          phoneNumber: schoolData.pta?.phoneNumber || null,
        },
        operation: {
          boarding: !!schoolData.operation?.boarding,
          daySchool: !!schoolData.operation?.daySchool,
          dayBoarding: !!schoolData.operation?.dayBoarding,
          feePaid: !!schoolData.operation?.feePaid,
          feeAmount: Number.isFinite(Number(schoolData.operation?.feeAmount))
            ? Number(schoolData.operation?.feeAmount)
            : 0,
        },
        bankDetails: {
          bankName: schoolData.bankDetails?.bankName || null,
          accountName: schoolData.bankDetails?.accountName || null,
          accountNumber: Number.isFinite(Number(schoolData.bankDetails?.accountNumber))
            ? Number(schoolData.bankDetails?.accountNumber)
            : null,
          bankBranch: schoolData.bankDetails?.bankBranch || null,
        },
        schoolStatus: {
          isOpen: schoolData.schoolStatus?.isOpen || null,
          closeReason: schoolData.schoolStatus?.closeReason || null,
          closedDate: schoolData.schoolStatus?.closedDate ? new Date(schoolData.schoolStatus.closedDate) : null,
        },
      }

      const res = await axios.patch(`${base_url}school-data/school/${schoolInfo._id}`, payload)
      if (!res.data) throw new Error("Failed to update school")
      setSuccess(true)
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const renderHeadTeacherInfo = () => (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <CardTitle className="text-lg">Head Teacher Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ht-name" className="text-sm font-medium">
              Name
            </Label>
            {isEditing ? (
              <Input
                id="ht-name"
                value={schoolData.headTeacher?.name || ""}
                onChange={(e) => handleInputChange("headTeacher", "name", e.target.value)}
                className="border-slate-300"
                disabled={loading}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                <User className="h-4 w-4 text-slate-500" />
                <span className="font-medium">{schoolData.headTeacher?.name || "N/A"}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ht-email" className="text-sm font-medium">
              Email
            </Label>
            {isEditing ? (
              <Input
                id="ht-email"
                type="email"
                value={schoolData.headTeacher?.email || ""}
                onChange={(e) => handleInputChange("headTeacher", "email", e.target.value)}
                className="border-slate-300"
                disabled={loading}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                <Mail className="h-4 w-4 text-slate-500" />
                <span>{schoolData.headTeacher?.email || "N/A"}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ht-phone" className="text-sm font-medium">
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="ht-phone"
                value={schoolData.headTeacher?.phoneNumber || ""}
                onChange={(e) => handleInputChange("headTeacher", "phoneNumber", e.target.value)}
                className="border-slate-300"
                disabled={loading}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{schoolData.headTeacher?.phoneNumber || "N/A"}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderPTAInfo = () => (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <CardTitle className="text-lg">PTA Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pta-name" className="text-sm font-medium">
              PTA Name
            </Label>
            {isEditing ? (
              <Input
                id="pta-name"
                value={schoolData.pta?.name || ""}
                onChange={(e) => handleInputChange("pta", "name", e.target.value)}
                className="border-slate-300"
                disabled={loading}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                <User className="h-4 w-4 text-slate-500" />
                <span>{schoolData.pta?.name || "N/A"}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pta-phone" className="text-sm font-medium">
              PTA Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="pta-phone"
                value={schoolData.pta?.phoneNumber || ""}
                onChange={(e) => handleInputChange("pta", "phoneNumber", e.target.value)}
                className="border-slate-300"
                disabled={loading}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{schoolData.pta?.phoneNumber || "N/A"}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSchoolOperation = () => (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <CardTitle className="text-lg">School Operation</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
              <Label htmlFor="operation-boarding" className="text-sm font-medium cursor-pointer flex-1">
                Boarding
              </Label>
              {isEditing ? (
                <Switch
                  id="operation-boarding"
                  checked={!!schoolData.operation?.boarding}
                  onCheckedChange={(checked) => handleInputChange("operation", "boarding", checked)}
                  disabled={loading}
                />
              ) : (
                <Badge variant={schoolData.operation?.boarding ? "default" : "outline"}>
                  {schoolData.operation?.boarding ? "Yes" : "No"}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
              <Label htmlFor="operation-daySchool" className="text-sm font-medium cursor-pointer flex-1">
                Day School
              </Label>
              {isEditing ? (
                <Switch
                  id="operation-daySchool"
                  checked={!!schoolData.operation?.daySchool}
                  onCheckedChange={(checked) => handleInputChange("operation", "daySchool", checked)}
                  disabled={loading}
                />
              ) : (
                <Badge variant={schoolData.operation?.daySchool ? "default" : "outline"}>
                  {schoolData.operation?.daySchool ? "Yes" : "No"}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
              <Label htmlFor="operation-dayBoarding" className="text-sm font-medium cursor-pointer flex-1">
                Day Boarding
              </Label>
              {isEditing ? (
                <Switch
                  id="operation-dayBoarding"
                  checked={!!schoolData.operation?.dayBoarding}
                  onCheckedChange={(checked) => handleInputChange("operation", "dayBoarding", checked)}
                  disabled={loading}
                />
              ) : (
                <Badge variant={schoolData.operation?.dayBoarding ? "default" : "outline"}>
                  {schoolData.operation?.dayBoarding ? "Yes" : "No"}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
              <Label htmlFor="operation-feePaid" className="text-sm font-medium cursor-pointer flex-1">
                Fee Paid
              </Label>
              {isEditing ? (
                <Switch
                  id="operation-feePaid"
                  checked={!!schoolData.operation?.feePaid}
                  onCheckedChange={(checked) => handleInputChange("operation", "feePaid", checked)}
                  disabled={loading}
                />
              ) : (
                <Badge variant={schoolData.operation?.feePaid ? "default" : "outline"}>
                  {schoolData.operation?.feePaid ? "Yes" : "No"}
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee-amount" className="text-sm font-medium">
              Fee Amount
            </Label>
            {isEditing ? (
              <Input
                id="fee-amount"
                type="number"
                value={schoolData.operation?.feeAmount ?? ""}
                onChange={(e) => handleInputChange("operation", "feeAmount", Number.parseInt(e.target.value))}
                className="border-slate-300"
                disabled={loading}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <span className="font-medium">
                  {schoolData.operation?.feeAmount != null && !isNaN(Number(schoolData.operation?.feeAmount)) ? schoolData.operation.feeAmount : "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderBankDetails = () => (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <CardTitle className="text-lg">Bank Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bank-name" className="text-sm font-medium">
              Bank Name
            </Label>
            {isEditing ? (
              <Input
                id="bank-name"
                value={schoolData.bankDetails?.bankName || ""}
                onChange={(e) => handleInputChange("bankDetails", "bankName", e.target.value)}
                className="border-slate-300"
                disabled={loading}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                <Building className="h-4 w-4 text-slate-500" />
                <span>{schoolData.bankDetails?.bankName || "N/A"}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-name" className="text-sm font-medium">
              Account Name
            </Label>
            {isEditing ? (
              <Input
                id="account-name"
                value={schoolData.bankDetails?.accountName || ""}
                onChange={(e) => handleInputChange("bankDetails", "accountName", e.target.value)}
                className="border-slate-300"
                disabled={loading}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                <User className="h-4 w-4 text-slate-500" />
                <span>{schoolData.bankDetails?.accountName || "N/A"}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-number" className="text-sm font-medium">
              Account Number
            </Label>
            {isEditing ? (
              <Input
                id="account-number"
                value={schoolData.bankDetails?.accountNumber || ""}
                onChange={(e) => handleInputChange("bankDetails", "accountNumber", e.target.value)}
                className="border-slate-300"
                disabled={loading}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <span>{schoolData.bankDetails?.accountNumber || "N/A"}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSchoolStatus = () => (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <CardTitle className="text-lg">School Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="is-open" className="text-sm font-medium">
              School Status
            </Label>
            {isEditing ? (
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="is-open-yes"
                    name="is-open"
                    value="open"
                    checked={schoolData.schoolStatus?.isOpen === "open"}
                    onChange={() => handleInputChange("schoolStatus", "isOpen", "open")}
                    className="h-4 w-4 text-primary border-slate-300 focus:ring-primary"
                    disabled={loading}
                  />
                  <Label htmlFor="is-open-yes" className="text-sm">
                    Open
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="is-open-no"
                    name="is-open"
                    value="closed"
                    checked={schoolData.schoolStatus?.isOpen === "closed"}
                    onChange={() => handleInputChange("schoolStatus", "isOpen", "closed")}
                    className="h-4 w-4 text-primary border-slate-300 focus:ring-primary"
                    disabled={loading}
                  />
                  <Label htmlFor="is-open-no" className="text-sm">
                    Closed
                  </Label>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge
                  variant={schoolData.schoolStatus?.isOpen === "open" ? "success" : "destructive"}
                  className={
                    schoolData.schoolStatus?.isOpen === "open"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {schoolData.schoolStatus?.isOpen === "open" ? (
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                  )}
                  {schoolData.schoolStatus?.isOpen === "open" ? "Open" : "Closed"}
                </Badge>
              </div>
            )}
          </div>

          {(schoolData.schoolStatus?.isOpen === "closed" || isEditing) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="close-reason" className="text-sm font-medium">
                  Close Reason
                </Label>
                {isEditing ? (
                  <Input
                    id="close-reason"
                    value={schoolData.schoolStatus?.closeReason || ""}
                    onChange={(e) => handleInputChange("schoolStatus", "closeReason", e.target.value)}
                    className="border-slate-300"
                    disabled={loading || schoolData.schoolStatus?.isOpen === "open"}
                  />
                ) : (
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                    {schoolData.schoolStatus?.closeReason || "N/A"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="closed-date" className="text-sm font-medium">
                  Closed Date
                </Label>
                {isEditing ? (
                  <Input
                    id="closed-date"
                    type="date"
                    value={schoolData.schoolStatus?.closedDate?.slice(0, 10) || ""}
                    onChange={(e) => handleInputChange("schoolStatus", "closedDate", e.target.value)}
                    className="border-slate-300"
                    disabled={loading || schoolData.schoolStatus?.isOpen === "open"}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>{schoolData.schoolStatus?.closedDate || "N/A"}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>School information updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="bg-white dark:bg-slate-950 rounded-lg border shadow-sm">
        <Tabs defaultValue="facilities" className="w-full">
          <div className="flex items-center justify-between p-2 border-b">
            <TabsList className="h-10 bg-slate-100 dark:bg-slate-900 p-1 rounded-md">
              <TabsTrigger
                value="facilities"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                Facilities
              </TabsTrigger>
              <TabsTrigger
                value="school"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                School Info
              </TabsTrigger>

              <TabsTrigger
                value="bank"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                Bank Details
              </TabsTrigger>
              <TabsTrigger
                value="enrollment"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
              >
                Enrollment History
              </TabsTrigger>
            </TabsList>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      if (isEditing) handleSave()
                      else setIsEditing(true)
                    }}
                    variant={isEditing ? "default" : "outline"}
                    className={isEditing ? "bg-slate-900 hover:bg-slate-800" : ""}
                    disabled={loading}
                  >
                    {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                    {loading ? "Saving..." : isEditing ? "Save Changes" : "Edit Information"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isEditing ? "Save your changes" : "Edit school information"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="p-2">

            <TabsContent value="facilities" className="mt-0">

              {/* Facilities and Infrastructure Section */}
              <Card className="border-gray-200 shadow-md">
                <Tabs defaultValue="facilities" onValueChange={setActiveTab}>
                  <CardHeader >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">Facilities & Infrastructure</CardTitle>
                        <CardDescription >Comprehensive facility assessment</CardDescription>
                      </div>
                      <TabsList className="bg-gradient-to-r from-primary/100 to-primary/90">
                        <TabsTrigger
                          value="facilities"
                          className="data-[state=active]:bg-white text-white data-[state=active]:text-gray-800"
                        >
                          <Building className="h-3.5 w-3.5 mr-1.5" />
                          Facilities
                        </TabsTrigger>
                        <TabsTrigger
                          value="connectivity"
                          className="data-[state=active]:bg-white text-white data-[state=active]:text-gray-800"
                        >
                          <Wifi className="h-3.5 w-3.5 mr-1.5" />
                          Connectivity
                        </TabsTrigger>
                        <TabsTrigger
                          value="classrooms"
                          className="data-[state=active]:bg-white text-white data-[state=active]:text-gray-800"
                        >
                          <Users className="h-3.5 w-3.5 mr-1.5" />
                          Classrooms
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </CardHeader>
                  <Separator className="bg-gray-200" />
                  <CardContent className="p-4">
                    <TabsContent value="facilities" className="mt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="bg-blue-100 p-2 rounded-full">
                                    <Home className="h-5 w-5 text-blue-700" />
                                  </div>
                                  <Badge
                                    variant={schoolData.facilities.building.hasBuilding ? "outline" : "destructive"}
                                    className={
                                      schoolData.facilities.building.hasBuilding
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : ""
                                    }
                                  >
                                    {schoolData.facilities.building.hasBuilding ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-gray-800">Building</h3>
                                <p className="text-sm text-gray-500 mt-1">Permanent structure</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>School has permanent building structures</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="bg-blue-100 p-2 rounded-full">
                                    <Droplet className="h-5 w-5 text-blue-700" />
                                  </div>
                                  <Badge
                                    variant={schoolData.facilities.building.hasCleanWater ? "outline" : "destructive"}
                                    className={
                                      schoolData.facilities.building.hasCleanWater
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : ""
                                    }
                                  >
                                    {schoolData.facilities.building.hasCleanWater ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-gray-800">Clean Water</h3>
                                <p className="text-sm text-gray-500 mt-1">Potable water access</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>School has access to clean drinking water</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="bg-blue-100 p-2 rounded-full">
                                    <Lightbulb className="h-5 w-5 text-blue-700" />
                                  </div>
                                  <Badge
                                    variant={schoolData.facilities.building.hasElectricity ? "outline" : "destructive"}
                                    className={
                                      schoolData.facilities.building.hasElectricity
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : ""
                                    }
                                  >
                                    {schoolData.facilities.building.hasElectricity ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-gray-800">Electricity</h3>
                                <p className="text-sm text-gray-500 mt-1">Power supply</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>School has reliable electricity access</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="bg-blue-100 p-2 rounded-full">
                                    <BookOpen className="h-5 w-5 text-blue-700" />
                                  </div>
                                  <Badge
                                    variant={schoolData.facilities.building.hasLibrary ? "outline" : "destructive"}
                                    className={
                                      schoolData.facilities.building.hasLibrary
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : ""
                                    }
                                  >
                                    {schoolData.facilities.building.hasLibrary ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-gray-800">Library</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {Array.isArray(schoolData.facilities?.building?.library) && schoolData.facilities.building.library[0]?.numberOfBooks != null ? schoolData.facilities.building.library[0].numberOfBooks : "N/A"} books
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                School has a library with {Array.isArray(schoolData.facilities?.building?.library) && schoolData.facilities.building.library[0]?.numberOfBooks != null ? schoolData.facilities.building.library[0].numberOfBooks : "N/A"} books in{" "}
                                {schoolData.facilities.building.library[0]?.libraryCondition} condition
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TabsContent>

                    <TabsContent value="connectivity" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <Wifi className="h-5 w-5 mr-2 text-blue-700" />
                            Internet & Computer Access
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-600">Internet Access</span>
                                <span className="text-sm font-medium text-blue-700">
                                  {schoolData.facilities.building.hasInternet ? "Available" : "Unavailable"}
                                </span>
                              </div>
                              <Progress value={schoolData.facilities.building.hasInternet ? 100 : 0} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-600">Computer Lab</span>
                                <span className="text-sm font-medium text-blue-700">
                                  {schoolData.facilities.building.numberOfComputers} Computers
                                </span>
                              </div>
                              <Progress
                                value={Math.min(100, (schoolData.facilities.building.numberOfComputers / 30) * 100)}
                                className="h-2"
                              />
                            </div>
                            <div className="pt-2 border-t">
                              <h4 className="text-sm font-medium mb-2 text-gray-700">Computer Availability Ratio</h4>
                              <div className="bg-blue-50 p-3 rounded-md">
                                <span className="text-sm text-blue-700">
                                  {schoolData.facilities.building.numberOfComputers} computers for approximately{" "}
                                  {totalClassroomCapacity} student capacity
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-blue-700" />
                            Communication Networks
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2 text-gray-700">Mobile Network Coverage</h4>
                              <div className="grid grid-cols-3 gap-2">
                                {Object.entries(schoolData.cellphoneCoverage).map(([provider, isActive]) => {
                                  if (provider === "other") return null
                                  return (
                                    <Badge
                                      key={provider}
                                      variant="outline"
                                      className={cn(
                                        "justify-center py-1.5",
                                        isActive
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-gray-100 text-gray-400 border-gray-200",
                                      )}
                                    >
                                      {provider.toUpperCase()}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                            <div className="pt-2 border-t">
                              <h4 className="text-sm font-medium mb-2 text-gray-700">Radio Coverage</h4>
                              <div className="space-y-2">
                                {schoolData.radioCoverage.stations.slice(0, 3).map((station: { name: string; isActive: boolean }) => (
                                  <div key={station.name} className="flex justify-between items-center">
                                    <span className="text-sm">{station.name}</span>
                                    <Badge
                                      variant="outline"
                                      className={
                                        station.isActive
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-gray-100 text-gray-400 border-gray-200"
                                      }
                                    >
                                      {station.isActive ? "Available" : "Unavailable"}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="bg-blue-50 p-3 rounded-md">
                                <span className="text-sm text-blue-700">{activeNetworks} active mobile networks available</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="classrooms" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <Home className="h-5 w-5 mr-2 text-blue-700" />
                            Classroom Infrastructure
                          </h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-800 mb-1">Permanent</h4>
                                <p className="text-2xl font-bold text-blue-700">
                                  {schoolData.facilities.building.classrooms.permanent.length}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  Capacity:{" "}
                                  {schoolData.facilities.building.classrooms.permanent.reduce(
                                    (sum: number, room: { capacity: number }) => sum + room.capacity,
                                    0,
                                  )}{" "}
                                  students
                                </p>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-800 mb-1">Outdoor</h4>
                                <p className="text-2xl font-bold text-blue-700">
                                  {schoolData.facilities.building.classrooms.outdoor.length}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  Capacity:{" "}
                                  {schoolData.facilities.building.classrooms.outdoor.reduce(
                                    (sum: number, room: { capacity: number }) => sum + room.capacity,
                                    0,
                                  )}{" "}
                                  students
                                </p>
                              </div>
                            </div>
                            <div className="pt-3 border-t">
                              <h4 className="text-sm font-medium mb-2 text-gray-700">Total Capacity</h4>
                              <div className="bg-gray-100 p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-700">Student Capacity</span>
                                  <span className="font-semibold">{totalClassroomCapacity}</span>
                                </div>
                                <div className="mt-2">
                                  <Progress value={Math.min(100, (totalClassroomCapacity / 250) * 100)} className="h-2" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <Building className="h-5 w-5 mr-2 text-blue-700" />
                            Additional Facilities
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2 text-gray-700">Sanitation Facilities</h4>
                              <div className="grid grid-cols-2 gap-3">
                                {schoolData.facilities.building.latrines.map((latrine: { type: string; condition: string }, index: number) => (
                                  <div key={index} className="bg-blue-50 p-3 rounded-lg">
                                    <span className="text-xs font-medium text-blue-700">{latrine.type}</span>
                                    <div className="flex justify-between items-center mt-1">
                                      <span className="text-xs text-blue-600">Condition</span>
                                      <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">
                                        {latrine.condition}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="pt-3 border-t">
                              <h4 className="text-sm font-medium mb-2 text-gray-700">Recreational Facilities</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Playground</span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      schoolData.facilities.building.hasPlayground
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-gray-100 text-gray-400 border-gray-200"
                                    }
                                  >
                                    {schoolData.facilities.building.hasPlayground ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Sports Facilities</span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      schoolData.facilities.building.hasSportsFacilities
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-gray-100 text-gray-400 border-gray-200"
                                    }
                                  >
                                    {schoolData.facilities.building.hasSportsFacilities ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Playground Condition</span>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {schoolData.facilities.building.playgroundCondition}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </CardContent>

                </Tabs>
              </Card>

            </TabsContent>
            <TabsContent value="school" className="space-y-6 mt-0">
              {renderHeadTeacherInfo()}
              {renderPTAInfo()}
              {renderSchoolOperation()}
              {renderSchoolStatus()}
            </TabsContent>

            <TabsContent value="bank" className="mt-0">
              {renderBankDetails()}
            </TabsContent>

            <TabsContent value="enrollment" className="mt-0">
              <Card className="shadow-sm hover:shadow transition-shadow duration-200">
                <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <CardTitle className="text-lg">Enrollment Completion History</CardTitle>
                    </div>
                    <Badge
                      variant={
                        schoolInfo?.isEnrollmentComplete?.some(
                          (e: EnrollmentComplete) => e.year === new Date().getFullYear() && e.isComplete,
                        )
                          ? "default"
                          : "destructive"
                      }
                      className={
                        schoolInfo?.isEnrollmentComplete?.some(
                          (e: EnrollmentComplete) => e.year === new Date().getFullYear() && e.isComplete,
                        )
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {schoolInfo?.isEnrollmentComplete?.some(
                        (e: EnrollmentComplete) => e.year === new Date().getFullYear() && e.isComplete,
                      )
                        ? "Current Year Complete"
                        : "Current Year Incomplete"}
                    </Badge>
                  </div>
                  <CardDescription>Track enrollment completion status across academic years</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {schoolInfo?.isEnrollmentComplete
                      ?.sort((a: EnrollmentComplete, b: EnrollmentComplete) => b.year - a.year)
                      .map((enrollment: EnrollmentComplete, index: number) => (
                        <div key={enrollment._id} className="relative flex">
                          {/* Timeline connector */}
                          {index !== (schoolInfo?.isEnrollmentComplete?.length || 0) - 1 && (
                            <div className="absolute top-8 left-4 h-full w-0.5 bg-slate-200 dark:bg-slate-700" />
                          )}
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-0 w-8 h-8 rounded-full border-4 flex items-center justify-center ${enrollment.isComplete
                              ? "bg-green-100 border-green-500 text-green-700"
                              : "bg-red-100 border-red-500 text-red-700"
                              }`}
                          >
                            {enrollment.isComplete ? "✓" : "×"}
                          </div>
                          {/* Content */}
                          <div className="ml-12 pb-8 w-full">
                            <div className="bg-white dark:bg-slate-900 w-full rounded-lg border p-4 shadow-sm hover:shadow transition-shadow duration-200">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                                  Year {enrollment.year}
                                </h4>
                                <Badge
                                  variant={enrollment.isComplete ? "default" : "outline"}
                                  className={
                                    enrollment.isComplete
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                                  }
                                >
                                  {enrollment.isComplete ? "Complete" : "Incomplete"}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-3 mb-3">
                                <Progress value={enrollment.percentageComplete} className="h-2 w-full rounded-full" />
                                <span className="text-sm font-medium text-slate-600">
                                  {enrollment.percentageComplete}% Complete
                                </span>
                              </div>

                              <div className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex items-center">
                                <User className="h-4 w-4 mr-2 text-slate-500" />
                                Completed by: <span className="font-medium ml-1">{enrollment.completedBy}</span>
                              </div>

                              {enrollment.comments && (
                                <div className="mt-2 text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                                  <span className="font-medium">Comments:</span> {enrollment.comments}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    {(!schoolInfo?.isEnrollmentComplete || schoolInfo.isEnrollmentComplete.length === 0) && (
                      <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                        <Calendar className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                          No enrollment completion records found
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Enrollment records will appear here once they are added to the system
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
