"use client"

import { useState, useMemo, useCallback } from "react"
import {
  BarChart3,
  School,
  TrendingUp,
  AlertTriangle,
  Building2,
  Globe,
  Users,
  UserRound,
  UserCircle2,
  ShipWheelIcon as Wheelchair,
  Filter,
  X,
  Check,
  ChevronsUpDown,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import SchoolEnrollmentTable from "./school-table-enrollment/schools"

// Define the data types based on the provided JSON
interface EnrollmentStatus {
  year?: number
  isComplete: boolean
  learnerEnrollmentComplete: boolean
  completedBy: string
  comments?: string
  percentageComplete?: number
  _id: string
}

interface LearnerGradeStats {
  total: number
  male: number
  female: number
  withDisability: number
  currentYear: {
    total: number
    male: number
    female: number
    withDisability: number
  }
}

interface SchoolData {
  _id: string
  code: string
  payam28: string
  state10: string
  county28: string
  schoolName: string
  schoolOwnerShip: string
  schoolType: string
  emisId: string
  isEnrollmentComplete: EnrollmentStatus[]
  learnerStats?: Record<string, LearnerGradeStats>
}

// School type explanations
const schoolTypeExplanations = {
  PRI: "Primary School",
  SEC: "Secondary School",
  ALP: "Accelerated Learning Program",
  ECD: "Early Childhood Development",
}

// Grade level explanations
const gradeLevelExplanations = {
  P: "Primary",
  S: "Secondary",
  ALP: "Accelerated Learning Program",
  ECD: "Early Childhood Development",
}

// Combobox component for filters
interface ComboboxProps {
  options: { value: string; label: string }[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder: string
  disabled?: boolean
  className?: string
}

function FilterCombobox({ options, value, onChange, placeholder, disabled = false, className }: ComboboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {value ? options.find((option) => option.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={true} filter={(value, search) => {
          const normalizedSearch = search.toLowerCase()
          const normalizedValue = value.toLowerCase()
          const option = options.find(opt => opt.value === value)
          if (!option) return 0
          const label = option.label.toLowerCase()
          
          // Check if search matches start of school name
          if (label.startsWith(normalizedSearch)) return 1
          // Check if search is found anywhere in school name or value
          if (label.includes(normalizedSearch) || normalizedValue.includes(normalizedSearch)) return 0.5
          return 0
        }}>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange(null)
                  setOpen(false)
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
                All {placeholder}s
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function EnrollmentStats({ allSchools,schoolsData }: { allSchools: SchoolData[] ,schoolsData:SchoolData[]}) {
  // State for filters
  const [state, setState] = useState<string | null>(null)
  const [county, setCounty] = useState<string | null>(null)
  const [payam, setPayam] = useState<string | null>(null)
  const [schoolType, setSchoolType] = useState<string | null>(null)
  const [schoolOwnership, setSchoolOwnership] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("enrollment")

  // Current year for filtering
  const currentYear = new Date().getFullYear()

  // Total schools in the country (count from allSchools)
  const totalSchoolsInCountry = allSchools.length

  // Total schools by ownership type (count dynamically from allSchools)
  const totalSchoolsByOwnership = allSchools.reduce((acc, school) => {
    const ownership = school.schoolOwnerShip;
    if (ownership && ownership !== "undefined" && ownership !== "null") {
      if (ownership in acc) {
        acc[ownership] += 1;
      } else {
        acc[ownership] = 1;
      }
    }
    return acc;
  }, {} as Record<string, number>);

  // Extract unique values for filters from the data
  const uniqueStates = useMemo(
    () => Array.from(new Set(allSchools.map((school) => school.state10))).sort(),
    [allSchools],
  )

  const uniqueCounties = useMemo(() => {
    const counties = state
      ? Array.from(new Set(
          allSchools.filter((school) => !state || school.state10 === state).map((school) => school.county28),
        ))
      : Array.from(new Set(allSchools.map((school) => school.county28)))
    return counties.sort()
  }, [allSchools, state])

  const uniquePayams = useMemo(() => {
    const payams = allSchools
      .filter((school) => (!state || school.state10 === state) && (!county || school.county28 === county))
      .map((school) => school.payam28)
    return Array.from(new Set(payams)).sort()
  }, [allSchools, state, county])

  const uniqueSchoolTypes = useMemo(
    () => Array.from(new Set(allSchools.map((school) => school.schoolType))).sort(),
    [allSchools],
  )

  const uniqueSchoolOwnerships = useMemo(
    () => Array.from(new Set(allSchools.map((school) => school.schoolOwnerShip))).sort(),
    [allSchools],
  )

  const uniqueSchools = useMemo(() => {
    const schools = allSchools
      .filter(
        (school) =>
          (!state || school.state10 === state) &&
          (!county || school.county28 === county) &&
          (!payam || school.payam28 === payam) &&
          (!schoolType || school.schoolType === schoolType) &&
          (!code || school.code === code)
      )
      .map((school) => ({
        value: school._id,
        label: `${school.schoolName} (${school.code || 'No Code'})`,
      }))
    return schools.sort((a, b) => a.label.localeCompare(b.label))
  }, [allSchools, state, county, payam, schoolType, code])

  // Format options for comboboxes
  const stateOptions = useMemo(() => uniqueStates.map((state) => ({ value: state, label: state })), [uniqueStates])

  const countyOptions = useMemo(
    () => uniqueCounties.map((county) => ({ value: county, label: county })),
    [uniqueCounties],
  )

  const payamOptions = useMemo(() => uniquePayams.map((payam) => ({ value: payam, label: payam })), [uniquePayams])

  const schoolTypeOptions = useMemo(
    () =>
      uniqueSchoolTypes.map((type) => ({
        value: type,
        label: `${type} - ${schoolTypeExplanations[type as keyof typeof schoolTypeExplanations] || type}`,
      })),
    [uniqueSchoolTypes],
  )

  const schoolOwnershipOptions = useMemo(
    () => uniqueSchoolOwnerships.map((ownership) => ({ value: ownership, label: ownership })),
    [uniqueSchoolOwnerships],
  )


  // Apply filters to the data
  const filteredSchoolData = useMemo(
    () =>
      schoolsData.filter(
        (school) =>
          (!state || school.state10 === state) &&
          (!county || school.county28 === county) &&
          (!payam || school.payam28 === payam) &&
          (!schoolType || school.schoolType === schoolType) &&
          (!code || school.code === code) &&
          (!selectedSchool || school._id === selectedSchool),
      ),
    [allSchools, state, county, payam, schoolType, code, selectedSchool],
  )

  // Filter schools that have started enrollment for the current year
  const schoolsWithStartedEnrollment = filteredSchoolData.filter((school) =>
    school.isEnrollmentComplete.some((status) => status.year === currentYear),
  )

  // Calculate key metrics
  const totalStartedEnrollment = schoolsWithStartedEnrollment.length

  const completedEnrollment = schoolsWithStartedEnrollment.filter((school) =>
    school.isEnrollmentComplete.some((status) => status.year === currentYear && status.learnerEnrollmentComplete === true),
  ).length


  const inProgressEnrollment = schoolsWithStartedEnrollment.filter((school) =>
    school.isEnrollmentComplete.some((status) => status.year === currentYear && status.learnerEnrollmentComplete === false),
  ).length

  // Completion rate (percentage of schools that completed enrollment out of those that started)
  const completionRate =
    totalStartedEnrollment > 0 ? Math.round((completedEnrollment / totalStartedEnrollment) * 100) : 0

  // Schools with low completion percentage (below 30%)
  const lowCompletionSchools = schoolsWithStartedEnrollment.filter((school) => {
    const status = school.isEnrollmentComplete.find(
      (s) => s.year === currentYear && s.isComplete === false && s.percentageComplete !== undefined,
    )
    return status && (status.percentageComplete || 0) < 30
  }).length

  // Calculate average completion percentage for in-progress schools
  const inProgressSchools = schoolsWithStartedEnrollment.filter((school) =>
    school.isEnrollmentComplete.some(
      (status) => status.year === currentYear && status.isComplete === false && status.percentageComplete !== undefined,
    ),
  )

  const totalPercentage = inProgressSchools.reduce((sum, school) => {
    const status = school.isEnrollmentComplete.find(
      (s) => s.year === currentYear && s.learnerEnrollmentComplete === false && s.percentageComplete !== undefined,
    )
    return sum + (status?.percentageComplete || 0)
  }, 0)

  const averageCompletion = inProgressSchools.length > 0 ? Math.round(totalPercentage / inProgressSchools.length) : 0

  // Calculate percentages relative to total schools in country
  const startedPercentOfTotal = Math.round((totalStartedEnrollment / totalSchoolsInCountry) * 100)
  const completedPercentOfTotal = Math.round((completedEnrollment / totalSchoolsInCountry) * 100)

  // Ownership stats
  const ownershipStats = uniqueSchoolOwnerships.map((ownerType) => {
    const schoolsOfType = schoolsWithStartedEnrollment.filter((school) => school.schoolOwnerShip === ownerType)

    const totalOfType = schoolsOfType.length

    const completedOfType = schoolsOfType.filter((school) =>
      school.isEnrollmentComplete.some((status) => status.year === currentYear && status.learnerEnrollmentComplete === true),
    ).length

    const completionPercentage = totalOfType > 0 ? Math.round((completedOfType / totalOfType) * 100) : 0

    // Calculate percentage of total schools of this type that have started enrollment
    const totalSchoolsOfThisType = totalSchoolsByOwnership[ownerType as keyof typeof totalSchoolsByOwnership] || 0
    const startedPercentOfTypeTotal =
      totalSchoolsOfThisType > 0 ? Math.round((totalOfType / totalSchoolsOfThisType) * 100) : 0

    // Calculate percentage of total schools of this type that have completed enrollment
    const completedPercentOfTypeTotal =
      totalSchoolsOfThisType > 0 ? Math.round((completedOfType / totalSchoolsOfThisType) * 100) : 0

    // Calculate how many schools of this type still need to start enrollment
    const remainingToStart = totalSchoolsOfThisType - totalOfType

    return {
      type: ownerType,
      total: totalOfType,
      completed: completedOfType,
      percentage: completionPercentage,
      totalInCountry: totalSchoolsOfThisType,
      startedPercentOfTotal: startedPercentOfTypeTotal,
      completedPercentOfTotal: completedPercentOfTypeTotal,
      remainingToStart: remainingToStart,
    }
  })

  // Color mapping for ownership types (dynamically generated)
  const ownershipColors: Record<string, string> = {}
  const colorOptions = ["bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-teal-500", "bg-pink-500", "bg-indigo-500"]

  uniqueSchoolOwnerships.forEach((type, index) => {
    ownershipColors[type] = colorOptions[index % colorOptions.length]
  })

  // Calculate remaining schools to start enrollment
  const remainingToStartEnrollment = totalSchoolsInCountry - totalStartedEnrollment

  // Calculate learner statistics
  const learnerStats = useMemo(() => {
    // Initialize stats object
    const stats = {
      total: {
        total: 0,
        male: 0,
        female: 0,
        withDisability: 0,
        currentYear: {
          total: 0,
          male: 0,
          female: 0,
          withDisability: 0,
        },
      },
      byGrade: {} as Record<
        string,
        {
          total: number
          male: number
          female: number
          withDisability: number
          currentYear: {
            total: number
            male: number
            female: number
            withDisability: number
          }
        }
      >,
    }

    // Process each school
    filteredSchoolData.filter((school) => school.isEnrollmentComplete.some((status) => status.year === currentYear && status.learnerEnrollmentComplete === true)).forEach((school) => {
      if (school.learnerStats) {
        // Process each grade
        Object.entries(school.learnerStats).forEach(([grade, data]) => {
          // Add to total stats
          stats.total.total += data.total
          stats.total.male += data.male
          stats.total.female += data.female
          stats.total.withDisability += data.withDisability
          stats.total.currentYear.total += data.currentYear.total
          stats.total.currentYear.male += data.currentYear.male
          stats.total.currentYear.female += data.currentYear.female
          stats.total.currentYear.withDisability += data.currentYear.withDisability

          // Add to grade-specific stats
          if (!stats.byGrade[grade]) {
            stats.byGrade[grade] = {
              total: 0,
              male: 0,
              female: 0,
              withDisability: 0,
              currentYear: {
                total: 0,
                male: 0,
                female: 0,
                withDisability: 0,
              },
            }
          }

          stats.byGrade[grade].total += data.total
          stats.byGrade[grade].male += data.male
          stats.byGrade[grade].female += data.female
          stats.byGrade[grade].withDisability += data.withDisability
          stats.byGrade[grade].currentYear.total += data.currentYear.total
          stats.byGrade[grade].currentYear.male += data.currentYear.male
          stats.byGrade[grade].currentYear.female += data.currentYear.female
          stats.byGrade[grade].currentYear.withDisability += data.currentYear.withDisability
        })
      }
    })

    return stats
  }, [filteredSchoolData])

  // Sort grades for display
  const sortedGrades = useMemo(() => {
    const grades = Object.keys(learnerStats.byGrade)

    // Custom sort function for grades
    return grades.sort((a, b) => {
      // Extract the prefix (P, S, ALP, ECD)
      const aPrefix = a.match(/^[A-Za-z]+/)?.[0] || ""
      const bPrefix = b.match(/^[A-Za-z]+/)?.[0] || ""

      // Extract the number
      const aNum = Number.parseInt(a.replace(aPrefix, "")) || 0
      const bNum = Number.parseInt(b.replace(bPrefix, "")) || 0

      // First sort by prefix
      if (aPrefix !== bPrefix) {
        // Custom order: ECD, P, S, ALP
        const prefixOrder = { ECD: 1, P: 2, S: 3, ALP: 4 }
        return (
          (prefixOrder[aPrefix as keyof typeof prefixOrder] || 99) -
          (prefixOrder[bPrefix as keyof typeof prefixOrder] || 99)
        )
      }

      // Then sort by number
      return aNum - bNum
    })
  }, [learnerStats])

  // Calculate gender ratio
  const genderRatio =
    learnerStats.total.male > 0 ? Math.round((learnerStats.total.female / learnerStats.total.male) * 100) / 100 : 0

  // Calculate disability percentage
  const disabilityPercentage =
    learnerStats.total.total > 0 ? Math.round((learnerStats.total.withDisability / learnerStats.total.total) * 100) : 0

  // Calculate current year enrollment percentage
  const currentYearPercentage =
    learnerStats.total.total > 0
      ? Math.round((learnerStats.total.currentYear.total / learnerStats.total.total) * 100)
      : 0

  // Reset filters
  const resetFilters = () => {
    setState(null)
    setCounty(null)
    setPayam(null)
    setSchoolType(null)
    setSchoolOwnership(null)
    setSelectedSchool(null)
  }

  // Helper function to get grade level explanation
  const getGradeLevelExplanation = useCallback((grade: string) => {
    const prefix = grade.match(/^[A-Za-z]+/)?.[0] || ""
    return gradeLevelExplanations[prefix as keyof typeof gradeLevelExplanations] || prefix
  }, [])

  return (
    <Card className="w-full p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Enrollment Progress For {currentYear}</h2>
          <p className="text-muted-foreground">Tracking enrollment and learner statistics nationwide</p>
        </div>

        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-3 h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
              <TabsTrigger value="enrollment" className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
                <School className="h-4 w-4" />
                <span className="ml-2 text-sm">Enrollment By School</span>
              </TabsTrigger>
              <TabsTrigger value="learners" className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
                <Users className="h-4 w-4" />
                <span className="ml-2 text-sm">Enrollment By Learners</span>
              </TabsTrigger>
              <TabsTrigger value="completion" className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
                <Users className="h-4 w-4" />
                <span className="ml-2 text-sm">Enrollment Completion By School</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="mb-4">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md font-medium flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </CardTitle>
            {(state || county || payam || schoolType || schoolOwnership || selectedSchool) && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                <X className="h-4 w-4 mr-1" /> Clear All
              </Button>
            )}
          </div>
          <CardDescription>Filter data by location, school type, and ownership</CardDescription>
        </div>
        <div className="px-3 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <FilterCombobox
                options={stateOptions}
                value={state}
                onChange={setState}
                placeholder="State"
                className="h-9"
              />
            </div>

            <div>
              <FilterCombobox
                options={countyOptions}
                value={county}
                onChange={setCounty}
                placeholder="County"
                disabled={!state}
                className="h-9"
              />
            </div>

            <div>
              <FilterCombobox
                options={payamOptions}
                value={payam}
                onChange={setPayam}
                placeholder="Payam"
                disabled={!county}
                className="h-9"
              />
            </div>

            <div>
              <FilterCombobox
                options={schoolTypeOptions}
                value={schoolType}
                onChange={setSchoolType}
                placeholder="School Type"
                className="h-9"
              />
            </div>

            <div>
              <FilterCombobox
                options={schoolOwnershipOptions}
                value={schoolOwnership}
                onChange={setSchoolOwnership}
                placeholder="Ownership"
                className="h-9"
              />
            </div>

            <div>
              <FilterCombobox
                options={uniqueSchools}
                value={selectedSchool}
                onChange={setSelectedSchool}
                placeholder="School"
                className="h-9"
              />
            </div>
          </div>

          {/* Active Filters */}
          {(state || county || payam || schoolType || schoolOwnership || selectedSchool) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {state && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  State: {state}
                  <X
                    className="h-3 w-3 cursor-pointer ml-1"
                    onClick={() => {
                      setState(null)
                      setCounty(null)
                      setPayam(null)
                    }}
                  />
                </Badge>
              )}
              {county && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  County: {county}
                  <X
                    className="h-3 w-3 cursor-pointer ml-1"
                    onClick={() => {
                      setCounty(null)
                      setPayam(null)
                    }}
                  />
                </Badge>
              )}
              {payam && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Payam: {payam}
                  <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setPayam(null)} />
                </Badge>
              )}
              {schoolType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {schoolType}
                  <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setSchoolType(null)} />
                </Badge>
              )}
              {schoolOwnership && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Ownership: {schoolOwnership}
                  <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setSchoolOwnership(null)} />
                </Badge>
              )}
              {selectedSchool && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  School: {uniqueSchools.find(s => s.value === selectedSchool)?.label}
                  <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setSelectedSchool(null)} />
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="enrollment">
          <div className="grid gap-6">
            {/* First row - 4 main stat cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Started Enrollment Card */}
              <Card className="overflow-hidden border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Started Enrollment</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <School className="h-5 w-5 text-purple-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Schools that have started the enrollment process for {currentYear}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalStartedEnrollment.toLocaleString()}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                      <p className="text-xs text-muted-foreground">Schools in the enrollment process</p>
                    </div>
                    <p className="text-xs font-medium">{startedPercentOfTotal}% of total</p>
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${startedPercentOfTotal}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className="font-medium text-red-500">{remainingToStartEnrollment.toLocaleString()}</span>{" "}
                    schools still need to start
                  </p>
                </CardContent>
              </Card>

              {/* Completion Rate Card */}
              <Card className="overflow-hidden border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentage of schools that have completed enrollment out of those that started</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500">{completionRate}%</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-xs text-muted-foreground">
                        {completedEnrollment.toLocaleString()} of {totalStartedEnrollment.toLocaleString()} completed
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${completionRate}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className="font-medium text-green-500">{completedPercentOfTotal}%</span> of all schools
                    nationwide
                  </p>
                </CardContent>
              </Card>

              {/* Average Completion Card */}
              <Card className="overflow-hidden border-l-4 border-l-amber-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <BarChart3 className="h-5 w-5 text-amber-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average completion percentage for schools with in-progress enrollment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-500">{averageCompletion}%</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                      <p className="text-xs text-muted-foreground">
                        For {inProgressEnrollment.toLocaleString()} in-progress schools
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${averageCompletion}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className="font-medium">{inProgressEnrollment.toLocaleString()}</span> schools still in
                    progress
                  </p>
                </CardContent>
              </Card>

              {/* At-Risk Schools Card */}
              <Card className="overflow-hidden border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Completion</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Schools with less than 30% completion that need immediate attention</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-500">
                    {lowCompletionSchools.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      <p className="text-xs text-muted-foreground">Schools with &lt;30% completion</p>
                    </div>
                    <p className="text-xs font-medium text-red-600 dark:text-red-500">
                      {inProgressEnrollment > 0 ? Math.round((lowCompletionSchools / inProgressEnrollment) * 100) : 0}%
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    <span className="font-medium text-red-500">{lowCompletionSchools.toLocaleString()}</span> schools
                    need immediate attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Second row - 2 additional stat cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Completion by School Ownership Card */}
              <Card className="overflow-hidden border-t-4 border-t-cyan-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Enrollment by School Ownership</CardTitle>
                    <CardDescription>Breakdown by ownership type</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Building2 className="h-5 w-5 text-cyan-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enrollment statistics broken down by school ownership type</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {ownershipStats.map((stat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 rounded-full ${ownershipColors[stat.type]} mr-2`}></div>
                            <span className="text-sm font-medium">{stat.type}</span>
                          </div>
                          <span className="text-sm font-medium">{stat.totalInCountry.toLocaleString()} schools total</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs">Started</span>
                              <span className="text-xs font-medium">{stat.startedPercentOfTotal}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${ownershipColors[stat.type]} rounded-full`}
                                style={{ width: `${stat.startedPercentOfTotal}%`, opacity: 0.7 }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {stat.total.toLocaleString()} of {stat.totalInCountry.toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs">Completed</span>
                              <span className="text-xs font-medium">{stat.completedPercentOfTotal}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${ownershipColors[stat.type]} rounded-full`}
                                style={{ width: `${stat.completedPercentOfTotal}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {stat.completed.toLocaleString()} of {stat.totalInCountry.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground flex justify-between border-t border-gray-100 dark:border-gray-800 pt-1 mt-1">
                          <span>Remaining to start:</span>
                          <span className="font-medium text-red-500">
                            {stat.remainingToStart.toLocaleString()} schools
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* National Progress Card */}
              <Card className="overflow-hidden border-t-4 border-t-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">National Enrollment Summary</CardTitle>
                    <CardDescription>Overall progress for {currentYear}</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Globe className="h-5 w-5 text-emerald-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>National overview of enrollment progress</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-sm font-medium">Started Enrollment</span>
                        </div>
                        <span className="text-sm font-medium">{startedPercentOfTotal}%</span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${startedPercentOfTotal}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalStartedEnrollment.toLocaleString()} of {totalSchoolsInCountry.toLocaleString()} schools
                        nationwide
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm font-medium">Completed Enrollment</span>
                        </div>
                        <span className="text-sm font-medium">{completedPercentOfTotal}%</span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${completedPercentOfTotal}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {completedEnrollment.toLocaleString()} of {totalSchoolsInCountry.toLocaleString()} schools
                        nationwide
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Enrollment Status Summary</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-center">
                          <div className="text-lg font-bold text-green-600">{completedEnrollment.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-center">
                          <div className="text-lg font-bold text-amber-600">
                            {inProgressEnrollment.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">In Progress</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-center">
                          <div className="text-lg font-bold text-red-600">
                            {remainingToStartEnrollment.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Not Started</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learners">
          <div className="grid gap-6">
            {/* Legend for learner statistics */}
            <Card className="p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-wrap gap-4 items-center text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-muted-foreground text-xs">Total Enrollment: All learners (new + promoted, computed at confirmation of completion)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-muted-foreground text-xs">New Enrollment: Newly enrolled learners in {currentYear}</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Total enrollment includes all learners (newly enrolled + promoted from previous years). New
                        enrollment shows only learners newly enrolled in the current year.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>

            {/* First row - 4 main learner stat cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Learners Card */}
              <Card className="overflow-hidden border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Users className="h-5 w-5 text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total number of learners enrolled across all schools (includes promoted learners)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{learnerStats.total.total.toLocaleString()}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                      <p className="text-xs text-muted-foreground">Enrolled across all schools</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded-md text-center">
                      <div className="text-sm font-bold">{learnerStats.total.male.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Male</div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-950/20 p-2 rounded-md text-center">
                      <div className="text-sm font-bold">{learnerStats.total.female.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Female</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gender Ratio Card */}
              <Card className="overflow-hidden border-l-4 border-l-pink-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <UserRound className="h-5 w-5 text-pink-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ratio of female to male learners across all schools</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-500">{genderRatio}:1</div>
                  <div className="flex items-center mt-2">
                    <div className="h-2 w-2 rounded-full bg-pink-500 mr-2"></div>
                    <p className="text-xs text-muted-foreground">Female to male ratio</p>
                  </div>
                  <div className="mt-3 h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-pink-500 rounded-l-full"
                      style={{
                        width: `${learnerStats.total.total > 0 ? (learnerStats.total.female / learnerStats.total.total) * 100 : 0}%`,
                      }}
                    />
                    <div
                      className="h-full bg-blue-500 rounded-r-full"
                      style={{
                        width: `${learnerStats.total.total > 0 ? (learnerStats.total.male / learnerStats.total.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>
                      Female:{" "}
                      {Math.round(
                        learnerStats.total.total > 0 ? (learnerStats.total.female / learnerStats.total.total) * 100 : 0,
                      )}
                      %
                    </span>
                    <span>
                      Male:{" "}
                      {Math.round(
                        learnerStats.total.total > 0 ? (learnerStats.total.male / learnerStats.total.total) * 100 : 0,
                      )}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Learners with Disabilities Card */}
              <Card className="overflow-hidden border-l-4 border-l-indigo-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learners with Disabilities</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Wheelchair className="h-5 w-5 text-indigo-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total number of learners with disabilities and percentage of total enrollment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-500">
                    {learnerStats.total.withDisability.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div>
                      <p className="text-xs text-muted-foreground">{disabilityPercentage}% of total learners</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${disabilityPercentage}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Current year:{" "}
                    <span className="font-medium">
                      {learnerStats.total.currentYear.withDisability.toLocaleString()}
                    </span>{" "}
                    learners with disabilities
                  </p>
                </CardContent>
              </Card>

              {/* Current Year Enrollment Card */}
              <Card className="overflow-hidden border-l-4 border-l-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Enrollments ({currentYear})</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <UserCircle2 className="h-5 w-5 text-emerald-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Newly enrolled learners in {currentYear} (excludes promoted learners)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                    {learnerStats.total.currentYear.total.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                      <p className="text-xs text-muted-foreground">{currentYearPercentage}% of total enrollment</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${currentYearPercentage}%` }}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded-md text-center">
                      <div className="text-sm font-bold">{learnerStats.total.currentYear.male.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Male</div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-950/20 p-2 rounded-md text-center">
                      <div className="text-sm font-bold">{learnerStats.total.currentYear.female.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Female</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learners by Grade Card */}
            <Card className="overflow-hidden border-t-4 border-t-violet-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">Learners by Grade</CardTitle>
                  <CardDescription>Breakdown by grade level and program</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BarChart3 className="h-5 w-5 text-violet-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-medium mb-1">Grade Level Explanations:</p>
                        <ul className="text-xs space-y-1">
                          <li>
                            <span className="font-medium">P1-P8:</span> Primary School Grades
                          </li>
                          <li>
                            <span className="font-medium">S1-S4:</span> Secondary School Grades
                          </li>
                          <li>
                            <span className="font-medium">ALP1-ALP4:</span> Accelerated Learning Program Levels
                          </li>
                          <li>
                            <span className="font-medium">ECD1-ECD3:</span> Early Childhood Development Levels
                          </li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedGrades.map((grade) => {
                    const gradeData = learnerStats.byGrade[grade]
                    const currentYearPercentage =
                      gradeData.total > 0 ? Math.round((gradeData.currentYear.total / gradeData.total) * 100) : 0

                    // Determine grade level color
                    const gradePrefix = grade.match(/^[A-Za-z]+/)?.[0] || ""
                    const gradeColors: Record<string, string> = {
                      P: "bg-blue-500",
                      S: "bg-purple-500",
                      ALP: "bg-orange-500",
                      ECD: "bg-teal-500",
                    }
                    const gradeColor = gradeColors[gradePrefix] || "bg-gray-500"

                    return (
                      <div key={grade} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 rounded-full ${gradeColor} mr-2`}></div>
                            <span className="text-sm font-medium">
                              {grade}
                              <span className="text-xs text-muted-foreground ml-1">
                                ({getGradeLevelExplanation(grade)})
                              </span>
                            </span>
                          </div>
                          <span className="text-sm font-medium">{gradeData.total.toLocaleString()} learners</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs">Gender Distribution</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                              <div
                                className="h-full bg-pink-500 rounded-l-full"
                                style={{
                                  width: `${gradeData.total > 0 ? (gradeData.female / gradeData.total) * 100 : 0}%`,
                                }}
                              />
                              <div
                                className="h-full bg-blue-500 rounded-r-full"
                                style={{
                                  width: `${gradeData.total > 0 ? (gradeData.male / gradeData.total) * 100 : 0}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <span>F: {gradeData.female.toLocaleString()}</span>
                              <span>M: {gradeData.male.toLocaleString()}</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs">New Enrollments ({currentYear})</span>
                              <span className="text-xs font-medium">{currentYearPercentage}%</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${currentYearPercentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {gradeData.currentYear.total.toLocaleString()} new of {gradeData.total.toLocaleString()}{" "}
                              total
                            </p>
                          </div>
                        </div>

                        {gradeData.withDisability > 0 && (
                          <div className="text-xs text-muted-foreground flex justify-between border-t border-gray-100 dark:border-gray-800 pt-1 mt-1">
                            <span>Learners with disabilities:</span>
                            <span className="font-medium text-indigo-500">
                              {gradeData.withDisability.toLocaleString()} (
                              {Math.round((gradeData.withDisability / gradeData.total) * 100)}%)
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="completion" className="mt-2 border rounded-lg">
          <SchoolEnrollmentTable schools={filteredSchoolData} />

        </TabsContent>
      </Tabs>
    </Card>
  )
}
