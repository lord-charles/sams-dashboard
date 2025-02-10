"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ChevronLeft, Download, File, Share, Sheet } from "lucide-react";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BreadcrumbItem, Breadcrumbs, DatePicker, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import { useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import EducationLevelSelect from "./EducationLevelSelect";
import LearnerDifficulty from "./learner-difficulty";
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

const UpdateLearnerComponent = ({ learner }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [country, setCountry] = useState(learner?.houseHold[0]?.guardianCountryOfOrigin);
  const [grade, setGrade] = useState(learner?.class?.toString());

  const [firstName, setFirstName] = useState(learner?.firstName);
  const [middleName, setMiddleName] = useState(learner?.middleName);
  const [lastName, setLastName] = useState(learner?.lastName);
  const [gender, setGender] = useState(learner?.gender);
  const [dob, setDob] = useState(learner?.dob);

  const [difficultySeeing, setDifficultySeeing] = useState(learner?.disabilities[0]?.disabilities?.difficultySeeing?.toString() || "1");
  const [difficultyTalking, setDifficultyTalking] = useState(learner?.disabilities[0]?.disabilities?.difficultyTalking?.toString() || "1");
  const [difficultySelfCare, setDifficultySelfCare] = useState(learner?.disabilities[0]?.disabilities?.difficultySelfCare?.toString() || "1");
  const [difficultyWalking, setDifficultyWalking] = useState(learner?.disabilities[0]?.disabilities?.difficultyWalking?.toString() || "1");
  const [difficultyHearing, setDifficultyHearing] = useState(learner?.disabilities[0]?.disabilities?.difficultyHearing?.toString() || "1");
  const [difficultyRecalling, setDifficultyRecalling] = useState(learner?.disabilities[0]?.disabilities?.difficultyRecalling?.toString() || "1");

  const [phoneNumber, setPhoneNumber] = useState(learner?.houseHold[0]?.guardianPhone);
  const [maleAdult, setMaleAdult] = useState(learner?.houseHold[0]?.maleAdult);
  const [femaleAdult, setFemaleAdult] = useState(learner?.houseHold[0]?.femaleAdult);
  const [maleBelow18, setMaleBelow18] = useState(learner?.houseHold[0]?.maleBelow18);
  const [femaleBelow18, setFemaleBelow18] = useState(learner?.houseHold[0]?.femaleBelow18);
  const [maleWithDisability, setMaleWithDisability] = useState(learner?.houseHold[0]?.maleWithDisability);
  const [femaleWithDisability, setFemaleWithDisability] = useState(learner?.houseHold[0]?.femaleWithDisability);
  const [moreInformation, setMoreInformation] = useState(learner?.pregnantOrNursing?.moredetails);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dropout, setDropout] = useState(learner?.isDroppedOut ? 'Yes' : 'No');
  const [promoted, setPromoted] = useState(learner?.isPromoted ? 'Yes' : 'No');

  const [isLoading, setIsloading] = useState(false);


  const submitStudentData = {
    year: learner?.year,
    state: learner?.state10,
    stateName: learner?.state10,
    county: learner?.county28,
    countryOfOrigin: country,
    payam: learner?.payam28,
    code: learner?.code,
    schoolName: learner?.school,
    education: learner?.education,
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
    isPromoted: promoted === "Yes" ? true : false,
    isDroppedOut: false,
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



  const updateLearner = async () => {
    // Validate input fields


    setIsloading(true);
    try {
      const response = await axios.patch(
        `${base_url}data-set/2023_data/students/${learner._id}`,
        submitStudentData
      );

      toast({
        title: "Update Successful",
        description: "Student has been successfully updated.",
      });


    } catch (err) {
      // Handle errors (show error message, log, etc.)
      console.log("Error updating student:", err.response.data);
      setIsloading(false);

      toast({
        title: "Update Error",
        description: `${err.response?.data.message ||
          "An error occurred during student update."
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
      "Learner Information",
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

    // **Learner Information Header:**
    doc.setFontSize(sectionFontSize);
    const learnerY = margin + 60;

    // First Table - Learner Information
    autoTable(doc, {
      startY: learnerY + sectionYOffset,
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
    let finalY = doc?.lastAutoTable?.finalY || learnerY + sectionYOffset + 30;

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
        <BreadcrumbItem href="/dashboard/learners">Learners</BreadcrumbItem>
        <BreadcrumbItem>{learner?.firstName} {learner?.lastName}</BreadcrumbItem>
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
          View | Update Learner
        </h1>
        <div className=" items-center gap-2 md:ml-auto flex">
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
            <Button variant="outline"
              className="gap-x-[2.3px] hidden lg:flex">
              <Share className="h-4 w-4" />
              <span className="text-sm leading-5 text-[#0F3659] dark:text-gray-400">
                Transfer
              </span>
            </Button>
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
            size="sm"
            className={` text-white  font-bold bg-primary `}
            onClick={updateLearner}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* section2   */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Learner Information</CardTitle>
              <CardDescription>
                Key learner details for identification.
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
                      value={learner?.school?.toString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-code">School Code</Label>
                    <Input
                      id="school-code"
                      type="text"
                      className="w-full"
                      value={learner?.code?.toString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      type="text"
                      className="w-full"
                      value={learner?.education?.toString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education-level">Education Level</Label>
                    <EducationLevelSelect
                      education={learner?.education?.toString()}
                      grade={grade}
                      setGrade={setGrade}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learner Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Learner Location Information</CardTitle>
              <CardDescription>Learner Location Information</CardDescription>
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
                      value={learner?.state10?.toString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payam">Payam</Label>
                    <Input
                      id="payam"
                      type="text"
                      className="w-full"
                      value={learner?.payam28?.toString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      type="text"
                      className="w-full"
                      value={learner?.county28?.toString()}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guardian/Household Information */}
          <Card>
            <CardHeader>
              <CardTitle>Guardian/Household Information</CardTitle>
              <CardDescription>
                Guardian/Household Information for the learner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="male-adult">Male Adult</Label>
                    <Input
                      id="male-adult"
                      type="number"
                      className="w-full"
                      value={maleAdult}
                      onChange={(e) => setMaleAdult(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="female-adult">Female Adult</Label>
                    <Input
                      id="female-adult"
                      type="number"
                      className="w-full"
                      value={femaleAdult}
                      onChange={(e) => setFemaleAdult(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="male-below-18">Male Below 18</Label>
                    <Input
                      id="male-below-18"
                      type="number"
                      className="w-full"
                      value={maleBelow18}
                      onChange={(e) => setMaleBelow18(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="female-below-18">Female Below 18</Label>
                    <Input
                      id="female-below-18"
                      type="number"
                      className="w-full"
                      value={femaleBelow18}
                      onChange={(e) => setFemaleBelow18(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="male-disability">
                      Male With Disability
                    </Label>
                    <Input
                      id="male-disability"
                      type="number"
                      className="w-full"
                      value={maleWithDisability}
                      onChange={(e) => setMaleWithDisability(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="female-disability">
                      Female With Disability
                    </Label>
                    <Input
                      id="female-disability"
                      type="number"
                      className="w-full"
                      value={femaleWithDisability}
                      onChange={(e) => setFemaleWithDisability(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Learner Disability Information</CardTitle>
              <CardDescription>
                Learner&apos;s Functional Difficulties Characteristics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LearnerDifficulty
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

          <Card>
            <CardHeader>
              <CardTitle>Pregnant/Nursing Information</CardTitle>
              <CardDescription>
                Is learner Pregnant or Nursing (Optional)
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
          </Card>

          {/* droppout | promote  */}
          <Card>
            <CardHeader>
              <CardTitle>Dropout | Promotion Information</CardTitle>
              <CardDescription>
                Details about the learner enrollment status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="dropout">Dropout</Label>

                    <Select onValueChange={(value) => setDropout(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={`${dropout}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Dropout</SelectLabel>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>

                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="promotion">Promoted</Label>

                    <Select onValueChange={(value) => setPromoted(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={`${promoted}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Promoted</SelectLabel>
                          <SelectItem value="Yes" >Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>

                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
              <CardDescription>
                Details about the parent/guardian.
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
                      value={phoneNumber?.toString()}
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

export default UpdateLearnerComponent;
