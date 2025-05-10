"use client"

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Check, ChevronLeft, Download, File, SheetIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BreadcrumbItem, Breadcrumbs, Spinner } from "@nextui-org/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import TeacherDifficulty from "./teacher-difficulty"
import axios from "axios"
import { base_url } from "@/app/utils/baseUrl"
import { useToast } from "@/hooks/use-toast"
import { Backdrop } from "@mui/material"
import { saveAs } from "file-saver"
import json2csv from "json2csv"
import { format } from "date-fns"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const UpdateTeacherComponent = ({ teacher, loggedInUser = '' }) => {
  const router = useRouter()
  const { toast } = useToast()
  const currentYear = new Date().getFullYear()

  // Personal Information
  const [firstName, setFirstName] = useState(teacher?.firstname || "")
  const [lastName, setLastName] = useState(teacher?.lastname || "")
  const [middleName, setMiddleName] = useState(teacher?.middleName || "")
  const [gender, setGender] = useState(teacher?.gender || "")
  const [dob, setDob] = useState(teacher?.dob || "")
  const [teacherCode, setTeacherCode] = useState(teacher?.teacherCode || "")
  const [teachersEstNo, setTeachersEstNo] = useState(teacher?.teachersEstNo || "")
  const [nationalNo, setNationalNo] = useState(teacher?.nationalNo || "")

  // Professional Information
  const [trainingLevel, setTrainingLevel] = useState(teacher?.trainingLevel || "")
  const [professionalQual, setProfessionalQual] = useState(teacher?.professionalQual || "")
  const [workStatus, setWorkStatus] = useState(teacher?.workStatus || "")
  const [salary, setSalary] = useState(teacher?.salaryGrade || "")
  const [position, setPosition] = useState(teacher?.position || "")
  const [userType, setUserType] = useState(teacher?.userType || "")

  // Location Information
  const [state, setState] = useState(teacher?.state10 || "")
  const [countyName, setCountyName] = useState(teacher?.county28 || "")
  const [payam, setPayam] = useState(teacher?.payam28 || "")
  const [school, setSchool] = useState(teacher?.school || "")
  const [code, setCode] = useState(teacher?.code || "")

  // Disability Information
  const [difficultySeeing, setDifficultySeeing] = useState(
    teacher?.disabilities?.[0]?.disabilities?.difficultySeeing?.toString() || "1",
  )
  const [difficultyHearing, setDifficultyHearing] = useState(
    teacher?.disabilities?.[0]?.disabilities?.difficultyHearing?.toString() || "1",
  )
  const [difficultyTalking, setDifficultyTalking] = useState(
    teacher?.disabilities?.[0]?.disabilities?.difficultyTalking?.toString() || "1",
  )
  const [difficultySelfCare, setDifficultySelfCare] = useState(
    teacher?.disabilities?.[0]?.disabilities?.difficultySelfCare?.toString() || "1",
  )
  const [difficultyWalking, setDifficultyWalking] = useState(
    teacher?.disabilities?.[0]?.disabilities?.difficultyWalking?.toString() || "1",
  )
  const [difficultyRecalling, setDifficultyRecalling] = useState(
    teacher?.disabilities?.[0]?.disabilities?.difficultyRecalling?.toString() || "1",
  )

  // Status
  const [isDroppedOut, setIsDroppedOut] = useState(teacher?.isDroppedOut || false)
  const [isloading, setIsloading] = useState(false)

  // Generate a UUID for username if needed
  const uuid = () => {
    return teacher?.username || "auto-generated-uuid"
  }

  // Password field (if needed)
  const [password, setPassword] = useState("")

  const updateTeacher = async () => {
    try {
      setIsloading(true)

      const updateData = {
        firstname: firstName,
        lastname: lastName,
        middleName,
        username: uuid(),
        password,
        userType,
        trainingLevel,
        professionalQual,
        workStatus,
        salaryGrade: salary,
        position,
        teacherCode,
        teachersEstNo,
        nationalNo,
        school,
        county28: countyName,
        payam28: payam,
        state10: state,
        code,
        dob,
        gender,
        year: currentYear,
        isDroppedOut,
        disabilities: [
          {
            disabilities: {
              difficultyHearing,
              difficultySeeing,
              difficultyTalking,
              difficultySelfCare,
              difficultyWalking,
              difficultyRecalling,
            },
          },
        ],
        dutyAssigned: [
          {
            isAssigned: true,
            schoolName: school,
          },
        ],
        modifiedBy: loggedInUser,
      }

      const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => {
        // Check if the value is not an empty string or null
        if (value !== "" && value !== null) {
          // If the value is an array
          if (Array.isArray(value) && value.length > 0) {
            // Filter out empty strings or null values from each object in the array
            const filteredArray = value
              .map((obj) => {
                return Object.entries(obj).reduce((nestedAcc, [nestedKey, nestedValue]) => {
                  if (nestedValue !== "" && nestedValue !== null) {
                    nestedAcc[nestedKey] = nestedValue
                  }
                  return nestedAcc
                }, {})
              })
              .filter((obj) => Object.keys(obj).length > 0) // Remove empty objects
            if (filteredArray.length > 0) {
              acc[key] = filteredArray
            }
          } else if (typeof value === "object" && !Array.isArray(value)) {
            // If the value is an object, filter out nested empty strings or null values recursively
            const filteredNestedObj = Object.entries(value).reduce((nestedAcc, [nestedKey, nestedValue]) => {
              if (nestedValue !== "" && nestedValue !== null) {
                nestedAcc[nestedKey] = nestedValue
              }
              return nestedAcc
            }, {})
            if (Object.keys(filteredNestedObj).length > 0) {
              acc[key] = filteredNestedObj
            }
          } else {
            // If the value is not an object or an array, add it to the filtered data
            acc[key] = value
          }
        }
        return acc
      }, {})

      const res = await axios.patch(`${base_url}user/users/update/${teacher._id}`, filteredData)

      toast({
        title: "Update Successful",
        description: "Teacher has been successfully updated.",
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Update Error",
        description: `${error.response?.data.message || "An error occurred during teacher update."}`,
        variant: "destructive",
      })
    } finally {
      setIsloading(false)
    }
  }

  const getDisabilityDescription = (value) => {
    switch (value) {
      case "1":
        return "No difficulty (1)"
      case "2":
        return "Some difficulty (2)"
      case "3":
        return "A lot of difficulty (3)"
      case "4":
        return "Cannot do at all (4)"
      default:
        return "Unknown"
    }
  }

  // Function to generate the PDF
  const generatePDF = () => {
    const doc = new jsPDF()
    const margin = 20

    // Logo
    const logo = "/img/mogei.png"
    doc.addImage(logo, "PNG", doc.internal.pageSize.width / 2 - 15, margin, 30, 30)

    // Title and Website
    doc.setFontSize(20)
    doc.text("SAMS", doc.internal.pageSize.width / 2, margin + 40, {
      align: "center",
    })
    doc.setFontSize(12)
    doc.text("Teacher Information", doc.internal.pageSize.width / 8, margin + 50, { align: "left" })
    doc.text("Official Website: sssams.org", doc.internal.pageSize.width / 2, margin + 50, { align: "center" })

    // Date of PDF Generation
    const currentDate = new Date().toLocaleDateString()
    doc.setFontSize(10)
    doc.text(`Date Generated: ${currentDate}`, doc.internal.pageSize.width - margin - 50, margin + 50)

    // Section Headings
    const sectionFontSize = 16
    const sectionYOffset = 10

    // Teacher Information Header
    doc.setFontSize(sectionFontSize)
    const teacherY = margin + 60

    // First Table - Teacher Information
    autoTable(doc, {
      startY: teacherY + sectionYOffset,
      head: [["Field", "Details"]],
      body: [
        ["Year", currentYear.toString()],
        ["First Name", firstName],
        ["Middle Name", middleName],
        ["Last Name", lastName],
        ["Gender", gender],
        ["Date of Birth", dob],
        ["Teacher Code", teacherCode],
        ["Teacher EST No", teachersEstNo],
        ["National No", nationalNo],
        ["Training Level", trainingLevel],
        ["Professional Qualification", professionalQual],
        ["Work Status", workStatus],
        ["Salary Grade", salary],
        ["Position", position],
        ["User Type", userType],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
    })

    // Get the Y position after the first table
    let finalY = doc?.lastAutoTable?.finalY || teacherY + sectionYOffset + 30

    // Location Information Header
    doc.setFontSize(sectionFontSize)
    doc.text("Location Information", margin, finalY + sectionYOffset)

    // Location Table
    autoTable(doc, {
      startY: finalY + sectionYOffset + sectionFontSize,
      head: [["Field", "Details"]],
      body: [
        ["State", state],
        ["County", countyName],
        ["Payam", payam],
        ["School", school],
        ["School Code", code],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
    })

    // Update finalY after the second table
    finalY = doc?.lastAutoTable?.finalY || finalY + sectionYOffset + 30

    // Disabilities Information Header
    doc.setFontSize(sectionFontSize)
    doc.text("Disabilities Information", margin, finalY + sectionYOffset)

    // Disabilities Table
    autoTable(doc, {
      startY: finalY + sectionYOffset + sectionFontSize,
      head: [["Disability", "Level"]],
      body: [
        ["Difficulty Hearing", getDisabilityDescription(difficultyHearing)],
        ["Difficulty Seeing", getDisabilityDescription(difficultySeeing)],
        ["Difficulty Talking", getDisabilityDescription(difficultyTalking)],
        ["Difficulty Self-Care", getDisabilityDescription(difficultySelfCare)],
        ["Difficulty Walking", getDisabilityDescription(difficultyWalking)],
        ["Difficulty Recalling", getDisabilityDescription(difficultyRecalling)],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
    })

    // Footer
    doc.setFontSize(10)
    doc.text("Generated by SAMS - sssams.org", margin, doc.internal.pageSize.height - margin - 10)
    doc.text(`Page 1 of 1`, doc.internal.pageSize.width - margin - 40, doc.internal.pageSize.height - margin - 10)

    // Save the PDF
    doc.save(`SAMS_Teacher_Data_${firstName}_${lastName}.pdf`)
  }

  const downloadCSV = () => {
    try {
      const teacherData = {
        firstname: firstName,
        lastname: lastName,
        middleName,
        teacherCode,
        teachersEstNo,
        nationalNo,
        trainingLevel,
        professionalQual,
        workStatus,
        salaryGrade: salary,
        position,
        school,
        county28: countyName,
        payam28: payam,
        state10: state,
        code,
        dob,
        gender,
        year: currentYear,
        isDroppedOut: isDroppedOut ? "Yes" : "No",
      }

      const csvData = json2csv.parse(teacherData)
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" })

      saveAs(blob, `SAMS_Teacher_Data_${firstName}_${lastName}.csv`)
    } catch (err) {
      console.error("Error generating CSV:", err)
    }
  }

  return (
    <div className="p-2 flex min-h-screen w-screen bg-gradient-to-b from-primary/20 to-background flex-col md:w-[87%] lg:w-full md:ml-[80px] lg:ml-0 sm:ml-0 overflow-x-hidden rounded-md">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isloading}>
        <Spinner color="primary" size="lg" />
      </Backdrop>

      <div>
        <Breadcrumbs size="lg">
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem href="/dashboard/teachers">Teachers</BreadcrumbItem>
          <BreadcrumbItem href="/dashboard/teachers">
            {teacher?.school} ({teacher?.code})
          </BreadcrumbItem>
          <BreadcrumbItem>
            {teacher?.firstname} {teacher?.lastname}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {/* Header section */}
      <div className="flex items-center gap-4 py-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          View | Update Teacher
        </h1>
        <div className="items-center gap-2 md:ml-auto flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-x-[2.3px] hidden lg:flex">
                <Download className="h-4 w-4" />
                <span className="text-sm leading-5 text-[#0F3659] dark:text-gray-400">Export Data</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => downloadCSV()}>
                  <SheetIcon className="mr-2 h-4 w-4" />
                  <span>CSV</span>
                  <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => generatePDF()}>
                  <File className="mr-2 h-4 w-4" />
                  <span>PDF</span>
                  <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="text-white font-bold bg-primary" onClick={updateTeacher}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-3 lg:gap-2">
        <div className="grid auto-rows-max items-start gap-3 lg:col-span-2">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Teacher Information</CardTitle>
              <CardDescription>Key teacher details for identification.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      className="w-full"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middle-name">Middle Name</Label>
                    <Input
                      id="middle-name"
                      type="text"
                      className="w-full"
                      placeholder="Optional"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      className="w-full"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <input
                        type="date"
                        value={dob ? format(new Date(dob), "yyyy-MM-dd") : ""}
                        max={format(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "yyyy-MM-dd")}
                        onChange={(e) => {
                          const date = new Date(e.target.value)
                          setDob(format(date, "dd/MM/yyyy"))
                        }}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger id="gender" aria-label="Select Gender">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-code">Teacher Code</Label>
                    <Input
                      id="teacher-code"
                      type="text"
                      className="w-full"
                      value={teacherCode}
                      onChange={(e) => setTeacherCode(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="national-no">National No</Label>
                    <Input
                      id="national-no"
                      type="text"
                      className="w-full"
                      value={nationalNo}
                      onChange={(e) => setNationalNo(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-type">User Type</Label>
                    <Select value={userType} onValueChange={setUserType}>
                      <SelectTrigger id="user-type">
                        <SelectValue placeholder="Select User Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VolunteerTeacher">VolunteerTeacher</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="ClassTeacher">ClassTeacher</SelectItem>
                        <SelectItem value="SeniorTeacher">SeniorTeacher</SelectItem>
                        <SelectItem value="DeputyHeadTeacher">DeputyHeadTeacher</SelectItem>
                        <SelectItem value="HeadTeacher">HeadTeacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Professional Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Teacher&apos;s professional qualifications and status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="training-level">Training Level</Label>
                    <Select value={trainingLevel} onValueChange={setTrainingLevel}>
                      <SelectTrigger id="training-level">
                        <SelectValue placeholder="Select Training Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                        <SelectItem value="Degree">Degree</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                        <SelectItem value="PLE">PLE</SelectItem>
                        <SelectItem value="SSCSE">SSCSE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professional-qual">Professional Qualification</Label>
                    <Select value={professionalQual} onValueChange={setProfessionalQual}>
                      <SelectTrigger id="professional-qual">
                        <SelectValue placeholder="Select Professional Qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trained">Trained</SelectItem>
                        <SelectItem value="Untrained">Untrained</SelectItem>
                        <SelectItem value="Inclusive Education">Inclusive Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work-status">Work Status</Label>
                    <Select value={workStatus} onValueChange={setWorkStatus}>
                      <SelectTrigger id="work-status">
                        <SelectValue placeholder="Select Work Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full timer">Full timer</SelectItem>
                        <SelectItem value="Part timer">Part timer</SelectItem>
                        <SelectItem value="Volunteer">Volunteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Grade</Label>
                    <Select value={salary} onValueChange={setSalary}>
                      <SelectTrigger id="salary">
                        <SelectValue placeholder="Select Salary Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, i) => (
                          <SelectItem key={i} value={`${i}.0`}>{i}.0</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      type="text"
                      className="w-full"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disability Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Teacher Disability Information</CardTitle>
              <CardDescription>Teacher's Functional Difficulties Characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <TeacherDifficulty
                difficultySeeing={difficultySeeing}
                setDifficultySeeing={setDifficultySeeing}
                difficultyHearing={difficultyHearing}
                setDifficultyHearing={setDifficultyHearing}
                difficultyTalking={difficultyTalking}
                setDifficultyTalking={setDifficultyTalking}
                difficultySelfCare={difficultySelfCare}
                setDifficultySelfCare={setDifficultySelfCare}
                difficultyWalking={difficultyWalking}
                setDifficultyWalking={setDifficultyWalking}
                difficultyRecalling={difficultyRecalling}
                setDifficultyRecalling={setDifficultyRecalling}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4">
          {/* Location Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Teacher Location Information</CardTitle>
              <CardDescription>School and location details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      className="w-full"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      type="text"
                      className="w-full"
                      value={countyName}
                      onChange={(e) => setCountyName(e.target.value)}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="payam">Payam</Label>
                    <Input
                      id="payam"
                      type="text"
                      className="w-full"
                      value={payam}
                      onChange={(e) => setPayam(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Input
                      id="school"
                      type="text"
                      className="w-full"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid lg:grid-cols-1 sm:grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="code">School Code</Label>
                    <Input
                      id="code"
                      type="text"
                      className="w-full"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status Information</CardTitle>
              <CardDescription>Details about the teacher's current status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid lg:grid-cols-1 sm:grid-cols-1 gap-3">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="dropout">Dropped Out</Label>
                    <Select
                      value={isDroppedOut ? "Yes" : "No"}
                      onValueChange={(value) => setIsDroppedOut(value === "Yes")}
                    >
                      <SelectTrigger className="w-[140px]" disabled={isloading}>
                        <SelectValue placeholder={isDroppedOut ? "Yes" : "No"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Dropped Out</SelectLabel>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Duty Assignment Card */}
          <Card>
            <CardHeader>
              <CardTitle>Duty Assignment</CardTitle>
              <CardDescription>Current school assignment information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid lg:grid-cols-1 sm:grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="assigned-school">Assigned School</Label>
                    <Input id="assigned-school" type="text" className="w-full" value={school} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignment-status">Assignment Status</Label>
                    <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-700">Currently Assigned</span>
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

export default UpdateTeacherComponent 
