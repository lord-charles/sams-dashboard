"use client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ChevronLeft, Download, File, Sheet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BreadcrumbItem, Breadcrumbs, DatePicker, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import { useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import EducationLevelSelect from "./EducationLevelSelect";
import TeacherDifficulty from "./teacher-difficulty";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { useToast } from "@/hooks/use-toast";
import { Backdrop } from "@mui/material";
import { saveAs } from "file-saver";
import json2csv from "json2csv";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RegisterTeacherComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const getCurrentYear = () => new Date().getFullYear();
  const currentYear = getCurrentYear();

  const state = searchParams?.get("state") ?? null;
  const payam = searchParams?.get("payam") ?? null;
  const county = searchParams?.get("county") ?? null;
  const code = searchParams?.get("code") ?? null;
  const school = searchParams?.get("school") ?? null;

  const [country, setCountry] = useState("South Sudan");
  const [grade, setGrade] = useState("");
  const [education, setEducation] = useState(
    searchParams?.get("education") || "all"
  );

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const [password, setPassword] = useState('0000');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [trainingLevel, setTrainingLevel] = useState('');
  const [professionalQual, setProfessionalQual] = useState('');
  const [workStatus, setWorkStatus] = useState('');
  const [salary, setSalary] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [teachersEstNo, setTeachersEstNo] = useState('');
  const [nationalNo, setNationalNo] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loggedInUser, setloggedInUser] = useState('');

  const [difficultySeeing, setDifficultySeeing] = useState(1);
  const [difficultyTalking, setDifficultyTalking] = useState(1);
  const [difficultySelfCare, setDifficultySelfCare] = useState(1);
  const [difficultyWalking, setDifficultyWalking] = useState(1);
  const [difficultyHearing, setDifficultyHearing] = useState(1);
  const [difficultyRecalling, setDifficultyRecalling] = useState(1);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [maleAdult, setMaleAdult] = useState("");
  const [femaleAdult, setFemaleAdult] = useState("");
  const [maleBelow18, setMaleBelow18] = useState("");
  const [femaleBelow18, setFemaleBelow18] = useState("");
  const [maleWithDisability, setMaleWithDisability] = useState("");
  const [femaleWithDisability, setFemaleWithDisability] = useState("");
  const [moreInformation, setMoreInformation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isLoading, setIsloading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState([]);

  const submitStudentData = {
    year: currentYear,
    state: state,
    stateName: state,
    county: county,
    countryOfOrigin: country,
    payam: payam,
    code: code,
    schoolName: school,
    education: education,
    class: grade,
    gender: gender,
    dob: dob,
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    disabilities: [
      {
        disabilities: {
          difficultyHearing: difficultyHearing || 1,
          difficultySeeing: difficultySeeing || 1,
          difficultyTalking: difficultyTalking || 1,
          difficultySelfCare: difficultySelfCare || 1,
          difficultyWalking: difficultyWalking || 1,
          difficultyRecalling: difficultyRecalling || 1,
        },
      },
    ],

    houseHold: [
      {
        guardianPhone: phoneNumber,
        guardianCountryOfOrigin: country,
        maleAdult: maleAdult,
        femaleAdult: femaleAdult,
        maleBelow18: maleBelow18,
        femaleBelow18: femaleBelow18,
        maleWithDisability: maleWithDisability,
        femaleWithDisability: femaleWithDisability,
      },
    ],
    pregnantOrNursing: {
      pregnant: selectedStatus === "pregnant" ? true : false,
      nursing: selectedStatus === "nursing" ? true : false,
      moredetails: moreInformation,
    },
    // modifiedBy: loggedInUser,
  };

  const resetFields = () => {
    return (
      setFirstName(""),
      setMiddleName(""),
      setLastName(""),
      setGender(""),
      setDob(""),
      setGrade(""),
      // setCountry(""),
      setDifficultySeeing(1),
      setDifficultyTalking(1),
      setDifficultySelfCare(1),
      setDifficultyWalking(1),
      setDifficultyHearing(1),
      setDifficultyRecalling(1),
      setPhoneNumber(""),
      setMaleAdult(""),
      setFemaleAdult(""),
      setMaleBelow18(""),
      setFemaleBelow18(""),
      setMaleWithDisability(""),
      setFemaleWithDisability(""),
      setMoreInformation(""),
      setSelectedStatus("")
    );
  };

  const validateFields = {
    grade,
    firstName,
    middleName,
    lastName,
    gender,
    dob,
    maleAdult,
    femaleAdult,
    maleBelow18,
    femaleBelow18,
    maleWithDisability,
    femaleWithDisability,
    state,
    payam,
    county,
    code,
    school,
    country,
    education,
  };

  const registerStudent = async () => {
    // Validate input fields
    const requiredFields = [
      "county",
      "payam",
      "school",
      "education",
      "grade",
      "gender",
      "dob",
      "firstName",
      "country",
      "maleAdult",
      "femaleAdult",
      "maleBelow18",
      "femaleBelow18",
      "maleWithDisability",
      "femaleWithDisability",
    ];

    // Check for missing fields in the main object
    const missingFields = requiredFields.filter((field) => {
      const value = validateFields[field] || "";
      return (
        (typeof value === "string" && value.trim().length === 0) ||
        (typeof value === "number" && isNaN(value)) ||
        !value
      );
    });

    if (missingFields.length > 0) {
      setShowErrorModal(true);
      const errorMessages = missingFields.map(
        (field) => `Field ${field} is missing.`
      );

      toast({
        title: "Validation Error",
        description: "Please fill all required fields to continue!",
        variant: "destructive",
      });
      return setError(errorMessages);
    }

    setIsloading(true);
    try {
      const response = await axios.post(
        `${base_url}data-set/register-student-2024`,
        submitStudentData
      );
      if (response.data?.message === "student registered successfully.") {
        toast({
          title: "Registration Successful",
          description: "Student has been successfully registered.",
        });
        setTimeout(() => {
          resetFields();
        }, 3000);
      }
    } catch (err) {
      // Handle errors (show error message, log, etc.)
      console.log("Error registering student:", err.response.data);
      setIsloading(false);

      toast({
        title: "Registration Error",
        description: `${err.response?.data.message ||
          "An error occurred during student registration."
          } `,
        variant: "destructive",
      });
    } finally {
      setIsloading(false);
    }
  };

  const getDisabilityDescription = (value) => {
    switch (value) {
      case "1":
        return "No difficulty (1)";
      case "2":
        return "Some difficulty (2)";
      case "3":
        return "A lot of difficulty (3)";
      case "4":
        return "Cannot do at all (4)"; // Generalized to apply to any difficulty
      default:
        return "Unknown";
    }
  };

  // Function to generate the PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20; // Adjust margins for spacing

    // **Logo Integration:**
    // Assuming the logo is located in the public folder as '/logo.png'
    const logo = "/img/mogei.png"; // Path to logo image

    // Add the logo at the top-center of the document
    doc.addImage(
      logo,
      "PNG",
      doc.internal.pageSize.width / 2 - 15,
      margin,
      30,
      30
    ); // Adjust width, height, and positioning as necessary

    // **Title and Website:**
    doc.setFontSize(20);
    doc.text("SAMS", doc.internal.pageSize.width / 2, margin + 40, {
      align: "center",
    }); // Title centered below the logo
    doc.setFontSize(12);
    doc.text(
      "Teacher Information",
      doc.internal.pageSize.width / 8,
      margin + 50,
      { align: "left" }
    );
    doc.text(
      "Official Website: sssams.org",
      doc.internal.pageSize.width / 2,
      margin + 50,
      { align: "center" }
    );

    // **Date of PDF Generation:**
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(
      `Date Generated: ${currentDate}`,
      doc.internal.pageSize.width - margin - 50,
      margin + 50
    );

    // **Section Headings:**
    const sectionFontSize = 16;
    const sectionYOffset = 10; // Adjust spacing between sections

    // **Teacher Information Header:**
    doc.setFontSize(sectionFontSize);
    const TeacherY = margin + 60;

    // First Table - Teacher Information
    autoTable(doc, {
      startY: TeacherY + sectionYOffset,
      head: [["Field", "Details"]],
      body: [
        ["Year", submitStudentData.year],
        ["State", submitStudentData.state],
        ["County", submitStudentData.county],
        ["Country of Origin", submitStudentData.countryOfOrigin],
        ["Payam", submitStudentData.payam],
        ["School Code", submitStudentData.code],
        ["School Name", submitStudentData.schoolName],
        ["Education Level", submitStudentData.education],
        ["Class", submitStudentData.class],
        ["Gender", submitStudentData.gender],
        ["Date of Birth", submitStudentData.dob],
        ["First Name", submitStudentData.firstName],
        ["Middle Name", submitStudentData.middleName],
        ["Last Name", submitStudentData.lastName],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
    });

    // Get the Y position after the first table (use autoTable's finalY property)
    let finalY = doc?.lastAutoTable?.finalY || TeacherY + sectionYOffset + 30;

    // Disabilities Information Header
    doc.setFontSize(sectionFontSize);
    doc.text("Disabilities Information", margin, finalY + sectionYOffset);

    // Disabilities Table
    const disabilities = submitStudentData.disabilities[0].disabilities;
    autoTable(doc, {
      startY: finalY + sectionYOffset + sectionFontSize,
      head: [["Disability", "Level"]],
      body: [
        [
          "Difficulty Hearing",
          getDisabilityDescription(disabilities.difficultyHearing),
        ],
        [
          "Difficulty Seeing",
          getDisabilityDescription(disabilities.difficultySeeing),
        ],
        [
          "Difficulty Talking",
          getDisabilityDescription(disabilities.difficultyTalking),
        ],
        [
          "Difficulty Self-Care",
          getDisabilityDescription(disabilities.difficultySelfCare),
        ],
        [
          "Difficulty Walking",
          getDisabilityDescription(disabilities.difficultyWalking),
        ],
        [
          "Difficulty Recalling",
          getDisabilityDescription(disabilities.difficultyRecalling),
        ],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
    });

    // Update finalY after the second table
    finalY = doc.lastAutoTable?.finalY || finalY + sectionYOffset + 30;

    // Household Information Header
    doc.setFontSize(sectionFontSize);
    doc.text("Household Information", margin, finalY + sectionYOffset);

    // Household Table
    const household = submitStudentData.houseHold[0];
    autoTable(doc, {
      startY: finalY + sectionYOffset + sectionFontSize,
      head: [["Field", "Details"]],
      body: [
        ["Guardian Phone", household.guardianPhone],
        ["Guardian Country of Origin", household.guardianCountryOfOrigin],
        ["Male Adult", household.maleAdult],
        ["Female Adult", household.femaleAdult],
        ["Male Below 18", household.maleBelow18],
        ["Female Below 18", household.femaleBelow18],
        ["Male with Disability", household.maleWithDisability],
        ["Female with Disability", household.femaleWithDisability],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
    });

    // Update finalY after the third table
    finalY = doc.lastAutoTable?.finalY || finalY + sectionYOffset + 30;

    // Pregnant or Nursing Information Header
    doc.setFontSize(sectionFontSize);
    doc.text(
      "Pregnant or Nursing Information",
      margin,
      finalY + sectionYOffset
    );

    // Pregnant or Nursing Table
    const pregnantOrNursing = submitStudentData.pregnantOrNursing;
    autoTable(doc, {
      startY: finalY + sectionYOffset + sectionFontSize,
      head: [["Field", "Details"]],
      body: [
        ["Pregnant", pregnantOrNursing.pregnant ? "Yes" : "No"],
        ["Nursing", pregnantOrNursing.nursing ? "Yes" : "No"],
        ["More Details", pregnantOrNursing.moredetails],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
    });

    // Footer
    doc.setFontSize(10);
    doc.text(
      "Generated by SAMS - sssams.org",
      margin,
      doc.internal.pageSize.height - margin - 10
    );
    doc.text(
      `Page 1 of 1`,
      doc.internal.pageSize.width - margin - 40,
      doc.internal.pageSize.height - margin - 10
    );

    // Save the PDF
    doc.save(
      `SAMS_Student_Data_${submitStudentData.firstName}_${submitStudentData.lastName}.pdf`
    );
  };

  const downloadCSV = (submitStudentData) => {
    try {
      const csvData = json2csv.parse(submitStudentData);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      // Convert the JSON data to CSV

      // Create a Blob for the CSV data

      // Use file-saver to download the CSV file
      saveAs(
        blob,
        `SAMS_Student_Data_${submitStudentData.firstName}_${submitStudentData.lastName}.csv`
      );
    } catch (err) {
      console.error("Error generating CSV:", err);
    }
  };

  return (
    <div className="p-6 flex min-h-screen w-screen bg-card  flex-col md:w-[87%] lg:w-full md:ml-[80px] lg:ml-0 sm:ml-0 overflow-x-hidden rounded-md ">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Spinner color="primary" size="lg" />
      </Backdrop>

      <Breadcrumbs size='lg'>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/teachers">Teacher</BreadcrumbItem>
        <BreadcrumbItem>New Teacher</BreadcrumbItem>
      </Breadcrumbs>


      {/* section1  */}

      <div className="flex items-center gap-4 py-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Register New Teacher
        </h1>
        <div className=" items-center gap-2 md:ml-auto flex">
          {/* <ExportPDF submitStudentData={submitStudentData} /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-x-[2.3px] hidden lg:flex"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm leading-5 text-[#0F3659] dark:text-gray-400">
                  Export Data
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => downloadCSV(submitStudentData)}
                >
                  <Sheet className="mr-2 h-4 w-4" />

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

          <Button
            variant="outline"
            size="sm"
            className="hidden md:block"
            onClick={() => {
              setIsloading(true),
                setTimeout(() => {
                  resetFields(), setIsloading(false);
                }, 1000);
            }}
          >
            Discard
          </Button>
          <Button
            size="sm"
            className={` text-white  font-bold bg-primary `}
            onClick={registerStudent}
          >
            Register Now
          </Button>
        </div>
      </div>

      {/* section2   */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Information</CardTitle>
              <CardDescription>
                Key Teacher details for identification.
              </CardDescription>
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
                    <Label htmlFor="second-name">Second Name</Label>
                    <Input
                      id="second-name"
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
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <DatePicker
                      className="max-w-[284px]"
                      variant="underlined"
                      onChange={(date) => setDob(date?.toString())}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={gender}
                      onValueChange={(value) => setGender(value)}
                    >
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
                    <Label htmlFor="school">School</Label>
                    <Input
                      id="school"
                      type="text"
                      className="w-full"
                      value={school?.toString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-code">School Code</Label>
                    <Input
                      id="school-code"
                      type="text"
                      className="w-full"
                      value={code?.toString()}
                      disabled
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      type="text"
                      className="w-full"
                      value={education?.toString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education-level">Education Level</Label>
                    <EducationLevelSelect
                      education={education}
                      grade={grade}
                      setGrade={setGrade}
                    />
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Teacher Location Information</CardTitle>
              <CardDescription>Teacher Location Information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      className="w-full"
                      value={state?.toString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payam">Payam</Label>
                    <Input
                      id="payam"
                      type="text"
                      className="w-full"
                      value={payam?.toString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      type="text"
                      className="w-full"
                      value={county?.toString()}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guardian/Household Information */}

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Teacher Professional Information</CardTitle>
              <CardDescription>
                Please provide the professional details of the teacher.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-4 p-6  grid grid-cols-3">
              {/* Salary Grade */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="salary" className="text-lg font-bold">
                    Salary Grade
                  </Label>
                  <span className="text-sm text-gray-500">(required)</span>
                </div>
                <Select value={salary} onValueChange={setSalary}>
                  <SelectTrigger id="salary">
                    <SelectValue placeholder="Salary Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(15)].map((_, i) => (
                      <SelectItem key={i} value={`${i}.0`}>{`${i}.0`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Teacher Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="teacherType" className="text-lg font-bold">
                    Teacher Type
                  </Label>
                  <span className="text-sm text-gray-500">(required)</span>
                </div>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger id="teacherType">
                    <SelectValue placeholder="Teacher/HeadTeacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {["VolunteerTeacher", "Teacher", "ClassTeacher", "SeniorTeacher", "DeputyHeadTeacher", "HeadTeacher"].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Highest Level of Education */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="education" className="text-lg font-bold">
                    Highest Level Of Education
                  </Label>
                  <span className="text-sm text-gray-500">(required)</span>
                </div>
                <Select value={trainingLevel} onValueChange={setTrainingLevel}>
                  <SelectTrigger id="education">
                    <SelectValue placeholder="Degree/Diploma/Master/PhD" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Certificate", "Degree", "Diploma", "Master", "PhD", "PLE", "SSCSE"].map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Professional Qualification */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="qualification" className="text-lg font-bold">
                    Professional Qual
                  </Label>
                  <span className="text-sm text-gray-500">(required)</span>
                </div>
                <Select value={professionalQual} onValueChange={setProfessionalQual}>
                  <SelectTrigger id="qualification">
                    <SelectValue placeholder="Trained/Untrained/Inclusive Education" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Trained", "Untrained", "Inclusive Education"].map((qual) => (
                      <SelectItem key={qual} value={qual}>{qual}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Work Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="workStatus" className="text-lg font-bold">
                    Work Status
                  </Label>
                  <span className="text-sm text-gray-500">(required)</span>
                </div>
                <Select value={workStatus} onValueChange={setWorkStatus}>
                  <SelectTrigger id="workStatus">
                    <SelectValue placeholder="Full timer/Part timer/Volunteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Full timer", "Part timer", "Volunteer"].map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Disability Information</CardTitle>
              <CardDescription>
                Teacher&apos;s Functional Difficulties Characteristics
              </CardDescription>
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

          {/* <Card>
            <CardHeader>
              <CardTitle>Pregnant/Nursing Information</CardTitle>
              <CardDescription>
                Is Teacher Pregnant or Nursing (Optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-4 sm:grid-cols-1 gap-2 place-items-center">
                <div className="space-y-2 col-span-3 w-full">
                  <Textarea
                    placeholder="Type more information."
                    value={moreInformation}
                    onChange={(e) => setMoreInformation(e.target.value)}
                    disabled={gender === "M" ? true : false}
                  />
                </div>
                <div>
                  <RadioGroup
                    value={selectedStatus}
                    onChange={(value) => setSelectedStatus(value.target.value)}
                    color="primary"
                    isDisabled={gender === "M" ? true : false}
                  >
                    <Radio value="pregnant">Pregnant</Radio>
                    <Radio value="nursing">Nursing</Radio>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Please provide the teacher&apos;s country and phone number.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="country">Country</Label>

                    <CountryDropdown
                      value={country}
                      onChange={(val) => setCountry(val)}
                      className="bg-card  rounded-md p-2 w-full md:w-full border border-border"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="phone number">Phone Number</Label>
                    <Input
                      id="phone number"
                      type="number"
                      className="w-full"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* section 3  */}
      <div className="flex items-center justify-center gap-2 md:hidden mt-4 w-full">
        <Button
          variant="outline"
          size="lg"
          className="w-full font-bold text-lg"
        >
          Discard
        </Button>
        <Button size="lg" className="w-full font-bold text-lg">
          Register Now
        </Button>
      </div>
    </div>
  );
}
