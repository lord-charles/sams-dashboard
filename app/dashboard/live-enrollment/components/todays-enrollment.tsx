"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronDown, ChevronUp, School, User, Search, ChevronLeft, ChevronRight, X, CalendarIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isToday, isValid } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { cn } from "@/lib/utils"
import { base_url } from "@/app/utils/baseUrl"
import { DateRange } from "react-day-picker"
import useSWR, { SWRConfig } from 'swr'

// Define types for our data structure
interface Enumerator {
  enumerator: string
  totalStudentsByEnumerator: number
  totalStudentsDroppedByEnumerator: number
}

interface SchoolData {
  _id: string
  enumerators: Enumerator[]
  payam28: string
  state10: string
  county28: string
}

// Type for enumerator data with location
interface EnumeratorWithLocation {
  name: string
  totalStudents: number
  totalDropped: number
  school: string
  location: {
    state: string
    county: string
    payam: string
  }
}

// Type for date selection mode
type DateSelectionMode = "single" | "range"

// Debounce function for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}





export default function TodaysEnrollmentDataDisplay({
  data: initialData,
}: {
  data?: SchoolData[];
}) {
  const [dateMode, setDateMode] = useState<DateSelectionMode>("single")
  const [date, setDate] = useState<Date>(new Date())
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Memoize params to prevent unnecessary re-renders
  const params = useMemo(() => {
    if (dateMode === "single" && isValid(date)) {
      return { date }
    }
    if (dateRange.from && dateRange.to) {
      return { startDate: dateRange.from, endDate: dateRange.to }
    }
    return { date: new Date() }
  }, [date, dateRange.from, dateRange.to, dateMode])

  // Memoize the key to prevent unnecessary revalidation
  const key = useMemo(() => 
    [base_url + 'data-set/fetchSchoolsEnrollmentToday', params] as const,
    [params]
  )

  // Configure SWR with optimized caching options
  const { data: response, isValidating, error } = useSWR(
    key,
    async ([url, params]) => {
      const response = await axios.post(url, params)
      if (!response.data.success) {
        throw new Error('API request failed')
      }
      return response.data as { success: boolean, data: SchoolData[] }
    },
    {
      fallbackData: { success: true, data: initialData || [] },
      revalidateOnFocus: false, // Prevent revalidation on window focus
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
      shouldRetryOnError: false, // Don't retry on error automatically
      keepPreviousData: true, // Keep showing previous data while loading new data
    }
  )

  const schoolData = response?.data || []
  
  // Only show loading state on initial load or when explicitly refreshing
  const isLoading = useMemo(() => 
    (!response && isValidating) || (isValidating && !schoolData.length),
    [response, isValidating, schoolData.length]
  )

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange({
      from: range?.from,
      to: range?.to
    });
  };

  const dashboardTitle = useMemo(() => {
    if (dateMode === "single") {
      return isToday(date) ? "Today's Enrollment" : `Enrollment for ${format(date, "PPP")}`
    } else {
      if (dateRange.from && dateRange.to) {
        return `Enrollment from ${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}`
      } else if (dateRange.from) {
        return `Enrollment from ${format(dateRange.from, "PPP")}`
      } else {
        return "Today's Enrollment"
      }
    }
  }, [dateMode, date, dateRange])

  return (
    <div className="mt-2">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold">{dashboardTitle}</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <RadioGroup
              defaultValue="single"
              value={dateMode}
              onValueChange={(value) => setDateMode(value as DateSelectionMode)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single Day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range">Date Range</Label>
              </div>
            </RadioGroup>

            {dateMode === "single" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange.from && !dateRange.to && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="range" selected={dateRange} onSelect={handleDateRangeSelect} numberOfMonths={2} initialFocus />
                </PopoverContent>
              </Popover>
            )}

            {/* <Button  disabled={isLoading}>
              {isLoading ? "Loading..." : "Refresh Data"}
            </Button> */}
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
            Failed to fetch enrollment data. Please try again.
          </div>
        )}
      </div>

      <Tabs defaultValue="schools" className="w-full">
        <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="schools" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Schools
          </TabsTrigger>
          <TabsTrigger value="enumerators" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Enumerators
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1 items-center">
            <h2 className="text-lg font-semibold ">
              Total Enrolled:
            </h2>
            <h2 className="text-lg">
              {schoolData?.reduce(
                  (total, item) =>
                    total +
                    (item?.enumerators[0]?.totalStudentsByEnumerator || 0),
                  0
                )
                .toLocaleString()}
            </h2>
          </div>
          <div className="flex space-x-1 items-center">
            <h2 className="text-lg font-semibold ">
              Total Dropped Out:
            </h2>
            <h2 className="text-lg">
              {schoolData?.reduce(
                  (total, item) =>
                    total +
                    (item.enumerators[0]?.totalStudentsDroppedByEnumerator || 0),
                  0
                )
                .toLocaleString()}
            </h2>
          </div>
        </div>
        </div>
      

        <TabsContent value="schools" className="mt-4">
          <SchoolsTab schoolData={schoolData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="enumerators" className="mt-4">
          <EnumeratorsTab schoolData={schoolData} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SchoolsTab({ schoolData, isLoading }: { schoolData: SchoolData[]; isLoading: boolean }) {
  const [expandedSchools, setExpandedSchools] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const toggleSchool = (schoolId: string) => {
    setExpandedSchools((prev) => ({
      ...prev,
      [schoolId]: !prev[schoolId],
    }))
  }

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sort direction indicator
  const getSortDirectionIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? " ↑" : " ↓"
  }

  // Filter and sort schools
  const filteredAndSortedSchools = useMemo(() => {
    let filtered = [...schoolData]

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (school) =>
          school._id?.toLowerCase()?.includes(searchLower) ||
          school?.state10.toLowerCase()?.includes(searchLower) ||
          school?.county28.toLowerCase()?.includes(searchLower) ||
          school?.payam28?.toLowerCase()?.includes(searchLower) ||
          school.enumerators?.some((e) => e?.enumerator?.toLowerCase()?.includes(searchLower)),
      )
    }

    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        // @ts-ignore - we know these keys exist
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        // @ts-ignore - we know these keys exist
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [schoolData, debouncedSearchTerm, sortConfig])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSchools.length / itemsPerPage)
  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedSchools.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedSchools, currentPage, itemsPerPage])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search schools, locations, enumerators..."
            className="pl-8 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="10 per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort("_id")}>
                School Name{getSortDirectionIndicator("_id")}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort("state10")}>
                State{getSortDirectionIndicator("state10")}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort("county28")}>
                County{getSortDirectionIndicator("county28")}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort("payam28")}>
                Payam{getSortDirectionIndicator("payam28")}
              </TableHead>
              <TableHead className="text-right">Enumerators</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell>
                    <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-40 rounded-md bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-20 rounded-md bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 rounded-md bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 rounded-md bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-5 w-10 rounded-md bg-muted animate-pulse ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  {debouncedSearchTerm ? "No schools match your search criteria" : "No school data available"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedSchools.map((school) => (
                <>
                  <TableRow
                    key={school._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleSchool(school._id)}
                  >
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        {expandedSchools[school._id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{school._id}</TableCell>
                    <TableCell>{school.state10}</TableCell>
                    <TableCell>{school.county28}</TableCell>
                    <TableCell>{school.payam28}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{school.enumerators.length}</Badge>
                    </TableCell>
                  </TableRow>
                  {expandedSchools[school._id] && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4">
                          <h4 className="text-sm font-medium mb-2">Enumerators</h4>
                          {school.enumerators.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No enumerators assigned</p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead className="text-right">Total Students</TableHead>
                                  <TableHead className="text-right">Dropped Students</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {school.enumerators.map((enumerator, index) => (
                                  <TableRow key={`${school._id}-${enumerator.enumerator}-${index}`}>
                                    <TableCell className="font-medium">{enumerator.enumerator}</TableCell>
                                    <TableCell className="text-right">{enumerator.totalStudentsByEnumerator}</TableCell>
                                    <TableCell className="text-right">
                                      {enumerator.totalStudentsDroppedByEnumerator}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredAndSortedSchools.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedSchools.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedSchools.length)} of {filteredAndSortedSchools.length}{" "}
            schools
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

function EnumeratorsTab({ schoolData, isLoading }: { schoolData: SchoolData[]; isLoading: boolean }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Extract all unique enumerators with their location details
  const allEnumeratorData: EnumeratorWithLocation[] = useMemo(
    () =>
      schoolData.flatMap((school) =>
        school.enumerators.map((enumerator) => ({
          name: enumerator.enumerator,
          totalStudents: enumerator.totalStudentsByEnumerator,
          totalDropped: enumerator.totalStudentsDroppedByEnumerator,
          school: school._id,
          location: {
            state: school.state10,
            county: school.county28,
            payam: school.payam28,
          },
        })),
      ),
    [schoolData],
  )

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Filter and sort enumerators
  const filteredAndSortedEnumerators = useMemo(() => {
    let filtered = [...allEnumeratorData]

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.school.toLowerCase().includes(searchLower) ||
          item.location.state.toLowerCase().includes(searchLower) ||
          item.location.county.toLowerCase().includes(searchLower) ||
          item.location.payam.toLowerCase().includes(searchLower),
      )
    }

    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue, bValue

        // Handle nested properties
        if (sortConfig.key.includes(".")) {
          const [parent, child] = sortConfig.key.split(".") as ['location', keyof EnumeratorWithLocation['location']];
          aValue = a[parent][child];
          bValue = b[parent][child];
        } else {
          const key = sortConfig.key as keyof EnumeratorWithLocation;
          aValue = a[key];
          bValue = b[key];
        }

        // Handle numeric values
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue
        }

        // Handle string values
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [allEnumeratorData, debouncedSearchTerm, sortConfig])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEnumerators.length / itemsPerPage)
  const paginatedEnumerators = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedEnumerators.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedEnumerators, currentPage, itemsPerPage])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  // Get sort direction indicator
  const getSortDirectionIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? " ↑" : " ↓"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Enumerators by Location</CardTitle>
            <CardDescription>
              Showing {filteredAndSortedEnumerators.length} enumerator
              {filteredAndSortedEnumerators.length !== 1 ? "s" : ""} across all schools
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search enumerators..."
                className="pl-8 pr-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </div>

            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="10 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort("name")}>
                  Enumerator{getSortDirectionIndicator("name")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort("school")}>
                  School{getSortDirectionIndicator("school")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort("location.state")}>
                  State{getSortDirectionIndicator("location.state")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort("location.state")}>
                  County{getSortDirectionIndicator("location.county")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort("location.state")}>
                  Payam{getSortDirectionIndicator("location.payam")}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("totalStudents")}
                >
                  Students{getSortDirectionIndicator("totalStudents")}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("totalDropped")}
                >
                  Dropped{getSortDirectionIndicator("totalDropped")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-40 rounded-md bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-5 w-10 rounded-md bg-muted animate-pulse ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-5 w-10 rounded-md bg-muted animate-pulse ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedEnumerators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    {debouncedSearchTerm ? "No enumerators match your search criteria" : "No enumerator data available"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEnumerators.map((item, index) => (
                  <TableRow key={`${item.name}-${item.school}-${index}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.school}</TableCell>
                    <TableCell>{item.location.state}</TableCell>
                    <TableCell>{item.location.county}</TableCell>
                    <TableCell>{item.location.payam}</TableCell>
                    <TableCell className="text-right">{item.totalStudents}</TableCell>
                    <TableCell className="text-right">{item.totalDropped}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedEnumerators.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredAndSortedEnumerators.length)} of{" "}
          {filteredAndSortedEnumerators.length} enumerators
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
