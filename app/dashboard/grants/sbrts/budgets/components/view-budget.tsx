"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  School,
  Users,
  BookOpen,
  Download,
  Edit,
  Trash2,
  FileCheck,
  DollarSign,
  Briefcase,
  CreditCard,
  MoreVertical,
  BarChart,
  Plus,
  MapPin,
  Calendar,
  BanknoteIcon as Bank,
  GraduationCap,
  UserCheck,
  ShipWheelIcon as Wheelchair,
  HomeIcon,
  TentIcon,
  TreesIcon,
  ClipboardList,
  Users2,
  Target,
  FileText,
  Building2,
  User,
  InfoIcon,
} from "lucide-react";
import { ViewBudgetBreadcrumb } from "./breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NoBudget } from "./no-budget";
import { useRouter } from "next/navigation";
import BudgetBreakdown from "./budget-breakdown";

function Section({ icon, title, data, content }: any) {
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </h4>
      {data ? (
        <div className="grid grid-cols-3 gap-2 text-sm">
          {data.map(({ label, value }: any) => (
            <React.Fragment key={label}>
              <div className="text-gray-500">{label}:</div>
              <div className="col-span-2 font-medium">{value}</div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">{content}</p>
      )}
    </div>
  );
}

export default function BudgetView({
  budgetData,
  year,
  schoolData,
}: {
  budgetData: any;
  year: string;
  schoolData: any;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(year);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(
      `/dashboard/grants/sbrts/budgets/${budgetData?.code}/${selectedYear}?tab=${tab}`,
      { scroll: false }
    );
  };

  // Read initial tab from URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      [
        "overview",
        "details",
        "revenue",
        "approvals",
        "disbursement",
        "accountability",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    router.push(`/dashboard/grants/sbrts/budgets/${budgetData?.code}/${year}`);
  };

  if (!budgetData) {
    return (
      <NoBudget
        code={localStorage?.getItem("selectedSchoolCode") || "AAA"}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />
    );
  }

  // Calculate submitted amount by summing up all totalCostSSP values
  const submittedAmount =
    budgetData?.budget?.groups?.reduce((groupTotal: number, group: any) => {
      return (
        groupTotal +
        group.categories.reduce((categoryTotal: number, category: any) => {
          return (
            categoryTotal +
            category.items.reduce((itemTotal: number, item: any) => {
              return itemTotal + (item.totalCostSSP || 0);
            }, 0)
          );
        }, 0)
      );
    }, 0) || 0;

  const totalRevenue = budgetData?.revenues?.reduce(
    (sum: number, revenue: any) => sum + revenue.amount,
    0
  );
  const fundingProgress = (totalRevenue / submittedAmount) * 100;
  const fundingGap = submittedAmount - totalRevenue;

  const handleDownload = () => {
    // Implement download functionality
    console.log("Downloading budget data...");
  };

  const handleEdit = () => {
    router.push(
      `/dashboard/grants/sbrts/budgets/create?edit=true&year=${selectedYear}&code=${budgetData?.code}`
    );
  };

  const handleDelete = () => {
    // Implement delete functionality
    console.log("Deleting budget...");
  };

  const handleReview = () => {
    // Implement review functionality
    console.log("Reviewing budget...");
  };
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 + 1 }, (_, i) =>
    String(currentYear - i)
  );

  const totalClassrooms =
    (budgetData.meta.classrooms.permanent || 0) +
    (budgetData.meta.classrooms.temporary || 0) +
    (budgetData.meta.classrooms.openAir || 0);

  const totalTeachers =
    (budgetData.meta.teachers.estimatedFemale || 0) +
    (budgetData.meta.teachers.estimatedMale || 0);

  const totalEnrollment = budgetData?.meta?.estimateLearnerEnrolment
    ? budgetData.meta.estimateLearnerEnrolment
    : (budgetData?.meta?.learners
        ? budgetData.meta.learners.estimatedMale +
          budgetData.meta.learners.estimatedFemale +
          budgetData.meta.learners.estimatedMaleDisabled +
          budgetData.meta.learners.estimatedFemaleDisabled
        : 0) || 0;

  return (
    <div className="px-4 py-2  bg-gradient-to-b from-primary/20 to-background">
      <div className="flex justify-between items-center">
        <ViewBudgetBreadcrumb
          code={budgetData?.code}
          name={budgetData?.school || schoolData?.schoolName}
        />
        <div className="flex items-center space-x-2">
          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="default"
            size="sm"
            className=" items-center space-x-2 hidden lg:flex"
            onClick={() => {
              localStorage.setItem(
                "selectedSchool",
                JSON.stringify(schoolData)
              ),
                router.push(
                  `/dashboard/schools/${budgetData?.code || schoolData?.code}`
                );
            }}
          >
            <InfoIcon className="h-4 w-4" />
            <span>Detailed School Info</span>
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 mt-2">
        <div>
          <h1 className="text-3xl font-bold">
            Budget Overview - {budgetData?.code}
          </h1>
        </div>
        <div className="space-x-2">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={handleEdit}
            variant={isEditMode ? "secondary" : "outline"}
            size="sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditMode ? "Exit Edit Mode" : "Edit"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete this budget?
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  budget and remove the data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleReview} variant="outline" size="sm">
            <FileCheck className="mr-2 h-4 w-4" />
            Review
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submittedAmount.toLocaleString()} SSP
            </div>
            <p className="text-xs text-muted-foreground">
              Total planned expenditure
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue?.toLocaleString()} SSP
            </div>
            <p className="text-xs text-muted-foreground">
              Funds received or committed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Funding Progress
            </CardTitle>
            <Progress value={fundingProgress} className="w-[60px]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fundingProgress?.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Of total budget funded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funding Gap</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fundingGap?.toLocaleString()} SSP
            </div>
            <p className="text-xs text-muted-foreground">
              Additional funding needed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Budget Breakdown</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="disbursement">Disbursement</TabsTrigger>
          <TabsTrigger value="accountability">Accountability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <School className="h-5 w-5 text-primary" />
                  <span>School Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Location:
                  </span>
                  <span className="ml-auto font-medium">{`${budgetData.state10}, ${budgetData.county28}, ${budgetData.payam28}`}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    School Type:
                  </span>
                  <span className="ml-auto font-medium">
                    {budgetData.schoolType}
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Class Levels:
                  </span>
                  <span className="ml-auto font-medium">
                    {budgetData.meta.classLevels.join(", ")}
                  </span>
                </div>

                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Ownership</span>
                  <span className="ml-auto font-medium">
                    {budgetData?.ownership}
                  </span>
                </div>
                <div className="flex gap-4 justify-center">
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div className="flex space-x-1">
                      <span className="text-sm font-medium">Bank Name:</span>
                      <p className="text-sm text-muted-foreground">
                        {schoolData?.bankDetails?.bankName || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex space-x-1">
                      <span className="text-sm font-medium">Account Name:</span>
                      <p className="text-sm text-muted-foreground">
                        {schoolData?.bankDetails?.accountName || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Key Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    Teachers:
                  </span>
                  <span className="ml-auto font-medium">{totalTeachers}</span>
                </div>

                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm text-muted-foreground">
                    Estimated Enrollment:
                  </span>
                  <span className="ml-auto font-medium">{totalEnrollment}</span>
                </div>
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="text-sm text-muted-foreground">
                    Latest Attendance:
                  </span>
                  <span className="ml-auto font-medium">
                    {budgetData.meta.latestAttendance}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      Classrooms:
                    </span>
                    <span className="ml-auto font-medium">
                      {totalClassrooms}
                    </span>
                  </div>
                  <div className="pl-6 flex gap-8">
                    <div className="flex items-center space-x-1">
                      <HomeIcon className="h-3 w-3 mr-1 text-emerald-500" />
                      <span className="text-xs text-muted-foreground">
                        Permanent:
                      </span>
                      <span className="ml-auto text-xs font-medium">
                        {budgetData.meta.classrooms.permanent || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TentIcon className="h-3 w-3 mr-1 text-amber-500" />
                      <span className="text-xs text-muted-foreground">
                        Temporary:
                      </span>
                      <span className="ml-auto text-xs font-medium">
                        {budgetData.meta.classrooms.temporary || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TreesIcon className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        Open Air:
                      </span>
                      <span className="ml-auto text-xs font-medium">
                        {budgetData.meta.classrooms.openAir || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Learners Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-pink-500" />
                  <span className="text-sm text-muted-foreground">
                    Female Learners:
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {budgetData.meta.learners.estimatedFemale}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    Male Learners:
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {budgetData.meta.learners.estimatedMale}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Wheelchair className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm text-muted-foreground">
                    Female Learners with Disabilities:
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {budgetData.meta.learners.estimatedFemaleDisabled}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Wheelchair className="h-4 w-4 mr-2 text-indigo-500" />
                  <span className="text-sm text-muted-foreground">
                    Male Learners with Disabilities:
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {budgetData.meta.learners.estimatedMaleDisabled}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>Teacher Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-pink-500" />
                  <span className="text-sm text-muted-foreground">
                    Female Teachers:
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {budgetData.meta.teachers.estimatedFemale}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    Male Teachers:
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {budgetData.meta.teachers.estimatedMale}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Wheelchair className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm text-muted-foreground">
                    Female Teachers with Disabilities:
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {budgetData.meta.teachers.estimatedFemaleDisabled}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Wheelchair className="h-4 w-4 mr-2 text-indigo-500" />
                  <span className="text-sm text-muted-foreground">
                    Male Teachers with Disabilities:
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {budgetData.meta.teachers.estimatedMaleDisabled}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
                <CardTitle className="text-2xl font-bold flex items-center space-x-3">
                  <ClipboardList className="h-7 w-7" />
                  <span>Additional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Section
                    icon={<Users2 className="h-5 w-5 text-primary-500" />}
                    title="Subcommittee Responsible"
                    data={[
                      {
                        label: "Name",
                        value:
                          budgetData?.meta?.subCommitteeResponsible
                            .subCommitteeName,
                      },
                      {
                        label: "Chairperson",
                        value:
                          budgetData?.meta?.subCommitteeResponsible.chairperson,
                      },
                      {
                        label: "Responsibilities",
                        value:
                          budgetData?.meta?.subCommitteeResponsible
                            .responsibilities,
                      },
                    ]}
                  />
                  <Section
                    icon={<FileText className="h-5 w-5 text-green-500" />}
                    title="Preparation Details"
                    data={[
                      {
                        label: "Prepared By",
                        value: budgetData?.meta?.preparation.preparedBy,
                      },
                      {
                        label: "Date",
                        value: new Date(
                          budgetData?.meta?.preparation.preparationDate
                        ).toLocaleDateString(),
                      },
                      {
                        label: "Submitted By",
                        value: budgetData?.meta?.preparation.submittedBy,
                      },
                    ]}
                  />
                </div>
                <Section
                  icon={<Target className="h-5 w-5 text-red-500" />}
                  title="Impact"
                  content={budgetData?.meta?.impact}
                />
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
                <CardTitle className="text-2xl font-bold flex items-center space-x-3">
                  <Building2 className="h-7 w-7" />
                  <span>Governance Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary-700">
                  School Governance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(budgetData?.meta?.governance).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                      >
                        <Badge
                          variant={value ? "default" : "secondary"}
                          className={`text-xs px-2 py-1 ${
                            value
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {value ? "Yes" : "No"}
                        </Badge>
                        <span className="text-gray-700 font-medium">{key}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <BudgetBreakdown budget={budgetData.budget} />
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount (SSP)</TableHead>
                    <TableHead>Source Code</TableHead>
                    <TableHead>Group</TableHead>
                    {isEditMode && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData?.revenues?.map((revenue: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {revenue?.type}
                      </TableCell>
                      <TableCell>{revenue?.category}</TableCell>
                      <TableCell>{revenue?.description}</TableCell>
                      <TableCell className="text-right">
                        {revenue?.amount?.toLocaleString()}
                      </TableCell>
                      <TableCell>{revenue?.sourceCode}</TableCell>
                      <TableCell>{revenue?.group}</TableCell>
                      {isEditMode && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {isEditMode && (
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Revenue Source
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals"></TabsContent>
        <TabsContent value="disbursements"></TabsContent>
        <TabsContent value="accountability"></TabsContent>
        <TabsContent value="approvals"></TabsContent>
      </Tabs>
    </div>
  );
}
