"use client"

import { useEffect, useState, useCallback } from "react"
import { Edit, Loader2, UserPlus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { base_url } from "@/app/utils/baseUrl"
import { useToast } from "@/hooks/use-toast"

// Type definitions
interface DirectMember {
  firstName: string
  middleName?: string
  lastName: string
  dob?: string
}

interface TeacherMember {
  _id: string
  firstname: string
  lastname: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  qualifications: string

}

function isTeacherMember(member: string | TeacherMember | StudentMember): member is TeacherMember {
  return typeof member !== 'string' && 'email' in member;
}

interface StudentMember {
  _id: string
  firstname: string
  firstName: string
  lastname: string
  lastName: string
  reference?: string
  class?: string
}


interface SchoolCommittee {
  code: string
  HeadTeacher?: TeacherMember
  DeputyHeadTeacher?: TeacherMember
  FemaleTeacher?: TeacherMember
  MaleTeacher?: TeacherMember
  HeadGirl?: StudentMember
  HeadBoy?: StudentMember
  SchoolOfficer?: DirectMember[]
  FemaleParentRepresentative?: DirectMember[]
  MaleParentRepresentative?: DirectMember[]
  MaleParentRepresentativelearnerWithDisability?: DirectMember[]
  FemaleParentRepresentativelearnerWithDisability?: DirectMember[]
  FoundingBody?: DirectMember[]
  lastUpdated?: string
}

type MemberType = "teacher" | "student" | "direct"

interface SectionConfig {
  id: string
  title: string
  description: string
  positions: Array<{
    key: keyof SchoolCommittee
    title: string
    description: string
    type: MemberType
  }>
}

export default function BoardOfGovernors({ code, _id }: { code: string, _id: string }) {
  // State management
  const [committee, setCommittee] = useState<SchoolCommittee | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState<DirectMember>({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
  })
  const [operationStatus, setOperationStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  // Hooks
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  // URL parameters for member appointment
  const teacherId = searchParams.get("teacher-id") || ""
  const teacherFirstName = decodeURIComponent(searchParams.get("teacher-firstname") || "")
  const teacherLastName = decodeURIComponent(searchParams.get("teacher-lastname") || "")
  const teacherGender = searchParams.get("teacher-gender") || ""
  const teacherPhone = decodeURIComponent(searchParams.get("teacher-phone") || "")
  const teacherEmail = decodeURIComponent(searchParams.get("teacher-email") || "")
  const teacherQualification = decodeURIComponent(searchParams.get("teacher-qualification") || "")

  const learnerId = searchParams.get("learner-id") || ""
  const learnerFirstName = decodeURIComponent(searchParams.get("learner-firstname") || "")
  const learnerLastName = decodeURIComponent(searchParams.get("learner-lastname") || "")
  const learnerReference = decodeURIComponent(searchParams.get("learner-reference") || "")
  const learnerClass = decodeURIComponent(searchParams.get("learner-class") || "")

  const urlPosition = searchParams.get("position") || ""

  // Get tab from URL or default to "bog"
  const tab = searchParams.get("bog-tab") || "leadership";

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("bog-tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Section configuration for the UI
  const sections: SectionConfig[] = [
    {
      id: "leadership",
      title: "School Leadership",
      description: "Manage the head teacher and deputy head teacher positions",
      positions: [
        {
          key: "HeadTeacher",
          title: "Head Teacher",
          description: "The principal administrator responsible for the school's operations",
          type: "teacher",
        },
        {
          key: "DeputyHeadTeacher",
          title: "Deputy Head Teacher",
          description: "Assists the head teacher and assumes responsibilities in their absence",
          type: "teacher",
        },
      ],
    },
    {
      id: "teachers",
      title: "Teacher Representatives",
      description: "Manage teacher representatives on the board",
      positions: [
        {
          key: "FemaleTeacher",
          title: "Female Teacher Representative",
          description: "Represents the interests of female teaching staff",
          type: "teacher",
        },
        {
          key: "MaleTeacher",
          title: "Male Teacher Representative",
          description: "Represents the interests of male teaching staff",
          type: "teacher",
        },
      ],
    },
    {
      id: "students",
      title: "Learner Representatives",
      description: "Manage learner representatives on the board",
      positions: [
        {
          key: "HeadGirl",
          title: "Head Girl",
          description: "Senior female student leader representing student interests",
          type: "student",
        },
        {
          key: "HeadBoy",
          title: "Head Boy",
          description: "Senior male student leader representing student interests",
          type: "student",
        },
      ],
    },
    {
      id: "parents",
      title: "Parent Representatives",
      description: "Manage parent representatives on the board",
      positions: [
        {
          key: "FemaleParentRepresentative",
          title: "Female Parent Representatives",
          description: "Female guardians representing parent interests",
          type: "direct",
        },
        {
          key: "MaleParentRepresentative",
          title: "Male Parent Representatives",
          description: "Male guardians representing parent interests",
          type: "direct",
        },
        {
          key: "FemaleParentRepresentativelearnerWithDisability",
          title: "Female Representatives (Special Needs)",
          description: "Female guardians representing parents of learners with special needs",
          type: "direct",
        },
        {
          key: "MaleParentRepresentativelearnerWithDisability",
          title: "Male Representatives (Special Needs)",
          description: "Male guardians representing parents of learners with special needs",
          type: "direct",
        },
      ],
    },
  ]

  // Helper functions
  const isPositionOccupied = (position: keyof SchoolCommittee): boolean => {
    const currentValue = committee?.[position]
    return currentValue !== null && currentValue !== undefined
  }

  const getMemberName = (member: string | TeacherMember | StudentMember | DirectMember, type: MemberType): string => {
    if (type === "teacher" || type === "student") {
      const m = member as TeacherMember | StudentMember
      return `${m.firstname || m.firstName || ""} ${m.lastname || m.lastName || ""}`.trim()
    }
    const m = member as DirectMember
    return `${m.firstName || ""} ${m.middleName ? m.middleName + " " : ""}${m.lastName || ""}`.trim()
  }

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // API functions
  const fetchCommitteeData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${base_url}school-committe/getSchoolCommitte/${code}`)
      setCommittee(response.data)
    } catch (error: any) {
      setOperationStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch committee data",
      })
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch committee data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [code, toast])

  const handleRemoveMember = async (position: keyof SchoolCommittee, index: number) => {
    try {
      setLoading(true)
      const currentMembers = (committee?.[position] as any[]) || []
      const updatedMembers = [...currentMembers]
      updatedMembers.splice(index, 1)

      await axios.post(`${base_url}school-committe/createOrUpdateSchoolCommitte`, {
        code,
        [position]: updatedMembers,
      })
      await fetchCommitteeData()
      setOperationStatus({
        type: "success",
        message: "Member removed successfully",
      })
      toast({
        title: "Success",
        description: "Member removed successfully",
      })
    } catch (error: any) {
      setOperationStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to remove member",
      })
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove member",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddDirectMember = async (position: keyof SchoolCommittee) => {
    try {
      setLoading(true)
      const currentMembers = (committee?.[position] as any[]) || []
      const updatedMembers = [...currentMembers, newMember]

      await axios.post(`${base_url}school-committe/createOrUpdateSchoolCommitte`, {
        code,
        [position]: updatedMembers,
      })
      await fetchCommitteeData()
      setOperationStatus({
        type: "success",
        message: "Member added successfully",
      })
      toast({
        title: "Success",
        description: "Member added successfully",
      })
      setDialogOpen(false)
      setNewMember({
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
      })
    } catch (error: any) {
      setOperationStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to add member",
      })
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add member",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAppointMember = useCallback(
    async (memberId: string, position: string) => {
      try {
        setLoading(true)
        await axios.post(`${base_url}school-committe/createOrUpdateSchoolCommitte`, {
          code,
          [position]: {
            _id: memberId,
            firstName: teacherFirstName,
            lastName: teacherLastName,
            gender: teacherGender,
            phoneNumber: teacherPhone,
            email: teacherEmail,
            qualifications: teacherQualification,
          },
        })
        await fetchCommitteeData()
        setOperationStatus({
          type: "success",
          message: "Committee member appointed successfully",
        })
        toast({
          title: "Success",
          description: "Committee member appointed successfully",
        })
        // Reset URL to just the BOG tab after appointment
        router.push(`?tab=bog`)
      } catch (error: any) {
        setOperationStatus({
          type: "error",
          message: error.response?.data?.message || "Failed to appoint committee member",
        })
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to appoint committee member",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
        setSelectedPosition("")
      }
    },
    [
      code,
      teacherFirstName,
      teacherLastName,
      teacherGender,
      teacherPhone,
      teacherEmail,
      teacherQualification,
      router,
      toast,
      fetchCommitteeData,
    ],
  )

  const handleReplaceClick = (position: keyof SchoolCommittee) => {
    const positionType = sections.flatMap((section) => section.positions).find((p) => p.key === position)?.type

    if (positionType === "teacher") {
      router.push(`?tab=community&tab2=teachers&position=${position}`)
    } else if (positionType === "student") {
      router.push(`?tab=community&tab2=learners&position=${position}`)
    } else {
      setSelectedPosition(position as string)
      setDialogOpen(true)
    }
  }

  // Effects
  useEffect(() => {
    if (code) {
      fetchCommitteeData()
    }
  }, [code, fetchCommitteeData])

  // Clear operation status after 5 seconds
  useEffect(() => {
    if (operationStatus.type) {
      const timer = setTimeout(() => {
        setOperationStatus({ type: null, message: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [operationStatus])

  // Loading state
  if (loading && !committee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading committee data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-w-6xl mx-auto">
      {/* Status notification */}
      {operationStatus.type && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${operationStatus.type === "success"
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
            }`}
        >
          {operationStatus.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          <p className={operationStatus.type === "success" ? "text-green-700" : "text-red-700"}>
            {operationStatus.message}
          </p>
        </div>
      )}

      {/* Alert for new appointee from URL */}
      {(teacherId || learnerId) && urlPosition && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-yellow-800">Pending Appointment</CardTitle>
            <CardDescription className="text-yellow-700">
              Review and confirm the appointment of a new committee member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-yellow-200 text-yellow-800">
                    <AvatarFallback>
                      {getInitials(teacherFirstName || learnerFirstName) +
                        getInitials(teacherLastName || learnerLastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {teacherFirstName || learnerFirstName} {teacherLastName || learnerLastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{urlPosition.replace(/([A-Z])/g, " $1").trim()}</p>
                  </div>
                </div>

                {teacherId ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm mt-3">
                    {teacherQualification && (
                      <div>
                        <span className="text-muted-foreground">Qualification:</span> {teacherQualification}
                      </div>
                    )}
                    {teacherEmail && (
                      <div>
                        <span className="text-muted-foreground">Email:</span> {teacherEmail}
                      </div>
                    )}
                    {teacherPhone && (
                      <div>
                        <span className="text-muted-foreground">Phone:</span> {teacherPhone}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm mt-3">
                    {learnerReference && (
                      <div>
                        <span className="text-muted-foreground">Reference:</span> {learnerReference}
                      </div>
                    )}
                    {learnerClass && (
                      <div>
                        <span className="text-muted-foreground">Class:</span> {learnerClass}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => handleAppointMember(teacherId || learnerId, urlPosition)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Appointment"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push(`/dashboard/schools/${_id}?tab=bog`);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-900">Board of Governors</CardTitle>
              <CardDescription className="text-blue-700 mt-1">
                Manage school committee members and their roles
              </CardDescription>
            </div>
            {committee?.lastUpdated && (
              <Badge variant="outline" className="text-xs bg-white">
                Last Updated: {new Date(committee.lastUpdated).toLocaleString()}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue={tab} onValueChange={handleTabChange} className="w-full">
            <div className="border-b">
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="h-12 px-4 w-full justify-start">
                  {sections.map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 px-4"
                    >
                      {section.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            {sections.map((section) => (
              <TabsContent
                key={section.id}
                value={section.id}
                className="p-6 focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl font-semibold text-blue-900">{section.title}</h3>
                  <p className="text-muted-foreground">{section.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.positions.map((position) => {
                    const currentMember = committee?.[position.key]
                    const isArray = Array.isArray(currentMember)

                    return (
                      <Card key={position.key} className="overflow-hidden border shadow-sm">
                        <CardHeader className="bg-slate-50 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base font-medium">{position.title}</CardTitle>
                              <CardDescription className="text-xs mt-1">{position.description}</CardDescription>
                            </div>
                            {position.type === "direct" ? (
                              <Dialog
                                open={dialogOpen && selectedPosition === position.key}
                                onOpenChange={(open) => {
                                  setDialogOpen(open)
                                  if (!open) setSelectedPosition("")
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1 text-xs"
                                    onClick={() => setSelectedPosition(position.key as string)}
                                  >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    <span>Add</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add New {position.title}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="grid gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                          id="firstName"
                                          value={newMember.firstName}
                                          onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="middleName">Middle Name</Label>
                                        <Input
                                          id="middleName"
                                          value={newMember.middleName}
                                          onChange={(e) => setNewMember({ ...newMember, middleName: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                          id="lastName"
                                          value={newMember.lastName}
                                          onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Input
                                          id="dob"
                                          type="date"
                                          value={newMember.dob}
                                          onChange={(e) => setNewMember({ ...newMember, dob: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => handleAddDirectMember(position.key)}
                                      disabled={!newMember.firstName || !newMember.lastName || loading}
                                      className="w-full sm:w-auto"
                                    >
                                      {loading ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Processing...
                                        </>
                                      ) : (
                                        "Add Member"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Button
                                variant={isPositionOccupied(position.key) ? "outline" : "default"}
                                size="sm"
                                className={`h-8 gap-1 text-xs ${isPositionOccupied(position.key) ? "" : "bg-blue-600 hover:bg-blue-700"}`}
                                onClick={() => handleReplaceClick(position.key)}
                                disabled={loading}
                              >
                                {isPositionOccupied(position.key) ? (
                                  <>
                                    <Edit className="h-3.5 w-3.5" />
                                    <span>Replace</span>
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="h-3.5 w-3.5" />
                                    <span>Appoint</span>
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          {/* Display current member for non-array positions */}
                          {!isArray && currentMember ? (
                            <div className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10 bg-blue-100 text-blue-800">
                                  <AvatarFallback>
                                    {getInitials(getMemberName(currentMember, position.type))}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 flex-1">
                                  <div>
                                    <p className="font-medium">{getMemberName(currentMember, position.type)}</p>
                                    <p className="text-xs text-muted-foreground">Current {position.title}</p>
                                  </div>

                                  {position.type === "teacher" && currentMember && typeof currentMember !== 'string' && isTeacherMember(currentMember) && (
                                    <div className="grid grid-cols-1 gap-1 text-sm mt-2">
                                      {currentMember.email && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-muted-foreground">Email:</span>
                                          <span className="text-xs">{currentMember.email}</span>
                                        </div>
                                      )}
                                      {currentMember.phoneNumber && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-muted-foreground">Phone:</span>
                                          <span className="text-xs">{currentMember.phoneNumber}</span>
                                        </div>
                                      )}
                                      {currentMember.qualifications && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-muted-foreground">
                                            Qualifications:
                                          </span>
                                          <span className="text-xs">{currentMember.qualifications}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {position.type === "student" && (
                                    <div className="grid grid-cols-1 gap-1 text-sm mt-2">
                                      {(currentMember as StudentMember)?.reference && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-muted-foreground">Reference:</span>
                                          <span className="text-xs">{(currentMember as StudentMember).reference}</span>
                                        </div>
                                      )}
                                      {(currentMember as StudentMember)?.class && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-muted-foreground">Class:</span>
                                          <span className="text-xs">{(currentMember as StudentMember).class}</span>
                                        </div>
                                      )}

                                    </div>
                                  )}
                                </div>
                              </div>

                            </div>
                          ) : !isArray ? (
                            <div className="p-6 flex flex-col items-center justify-center text-center">
                              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                <UserPlus className="h-6 w-6 text-slate-400" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                No {position.title.toLowerCase()} appointed yet
                              </p>
                              <Button
                                variant="link"
                                size="sm"
                                className="mt-2 text-blue-600"
                                onClick={() => handleReplaceClick(position.key)}
                              >
                                Appoint now
                              </Button>
                            </div>
                          ) : null}

                          {/* Display array members */}
                          {isArray && (
                            <div className="divide-y">
                              {(committee?.[position.key] as any[])?.map((member, index) => (
                                <div key={index} className="p-4">
                                  <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10 bg-blue-100 text-blue-800">
                                      <AvatarFallback>
                                        {getInitials(getMemberName(member, position.type))}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2 flex-1">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-medium">{getMemberName(member, position.type)}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {position.title} #{index + 1}
                                          </p>
                                        </div>
                                        {position.type === "direct" && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-2"
                                            onClick={() => handleRemoveMember(position.key, index)}
                                            disabled={loading}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Remove</span>
                                          </Button>
                                        )}
                                      </div>

                                      {position.type === "direct" && member.dob && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-muted-foreground">
                                            Date of Birth:
                                          </span>
                                          <span className="text-xs">{member.dob}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {(!committee?.[position.key] || (committee?.[position.key] as any[])?.length === 0) && (
                                <div className="p-6 flex flex-col items-center justify-center text-center">
                                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                    <UserPlus className="h-6 w-6 text-slate-400" />
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    No {position.title.toLowerCase()} added yet
                                  </p>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="mt-2 text-blue-600"
                                    onClick={() => {
                                      setSelectedPosition(position.key as string);
                                      setDialogOpen(true);
                                    }}
                                  >
                                    Add now
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Board of Governors management</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
