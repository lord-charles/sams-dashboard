"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { PlusCircle, X, Plus, Trash2, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BreadcrumbItem, Breadcrumbs, Spinner } from "@nextui-org/react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"
import { base_url } from "@/app/utils/baseUrl"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"
import { Backdrop } from "@mui/material"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface School {
  code: string;
  school: string;
}

interface State {
  state: string;
}

interface County {
  _id: string;
}

interface Payam {
  _id: string;
}

const ComboboxSelect = ({ options, value, onChange, placeholder }:any) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white dark:bg-gray-800"
        >
          {value
            ? options.find((option:any) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option:any) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Define the schema for the form
const schoolFormSchema = z.object({
  code: z.string().min(1, "School code is required"),
  payam28: z.string().min(1, "Payam is required"),
  state10: z.string().min(1, "State is required"),
  county28: z.string().min(1, "County is required"),
  schoolName: z.string().min(1, "School name is required"),
  schoolOwnerShip: z.string().min(1, "School ownership is required"),
  schoolType: z.string().min(1, "School type is required"),
  headTeacher: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
  }),
  pta: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
  reporter: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
  facilities: z.object({
    hasKitchen: z.boolean().default(false),
    hasFoodStorage: z.boolean().default(false),
    hasTextbookStorage: z.boolean().default(false),
    hasCleanWater: z.boolean().default(false),
    hasInternet: z.boolean().default(false),
    hasRecreationalActivities: z.boolean().default(false),
  }),
  location: z.object({
    gpsLng: z.coerce.number().optional(),
    gpsLat: z.coerce.number().optional(),
    gpsElev: z.coerce.number().optional(),
    distanceToNearestVillage: z.coerce.number().optional(),
    distanceToNearestSchool: z.coerce.number().optional(),
    distanceToBank: z.coerce.number().optional(),
    distanceToMarket: z.coerce.number().optional(),
    distanceToCamp: z.coerce.number().optional(),
  }),
  subjects: z.array(z.string()).default([]),
  mentoringProgramme: z
    .array(
      z.object({
        isAvailable: z.boolean().default(false),
        activities: z.array(z.string()).default([]),
      }),
    )
    .default([{ isAvailable: false, activities: [] }]),
  feedingProgramme: z
    .array(
      z.object({
        name: z.string().optional(),
        organizationName: z.string().optional(),
        numberOfMeals: z.coerce.number().optional(),
        kindStaff: z.string().optional(),
        isAvailable: z.boolean().default(false),
      }),
    )
    .default([{ isAvailable: false }]),
  emisId: z.string().optional(),
  radioCoverage: z.object({
    stations: z.array(z.string()).default([]),
    programme: z.boolean().default(false),
    programmeGroup: z.string().optional(),
  }),
  cellphoneCoverage: z.object({
    vivacel: z.boolean().default(false),
    mtn: z.boolean().default(false),
    zain: z.boolean().default(false),
    gemtel: z.boolean().default(false),
    digitel: z.boolean().default(false),
    other: z.boolean().default(false),
  }),
  operation: z.object({
    boarding: z.boolean().default(false),
    daySchool: z.boolean().default(false),
    dayBoarding: z.boolean().default(false),
    feePaid: z.boolean().default(false),
    feeAmount: z.coerce.number().optional(),
  }),
  schoolCategory: z.string().optional(),
  calendar: z.object({
    year: z.coerce.number().optional(),
    terms: z
      .array(
        z.object({
          termNumber: z.coerce.number().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }),
      )
      .default([]),
    holidays: z
      .array(
        z.object({
          holidayName: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }),
      )
      .default([]),
  }),
  bankDetails: z.object({
    bankName: z.string().optional(),
    accountName: z.string().optional(),
    accountNumber: z.coerce.number().optional(),
    bankBranch: z.string().optional(),
  }),
  lastVisited: z
    .array(
      z.object({
        date: z.string().optional(),
        byWho: z.string().optional(),
        comments: z.string().optional(),
      }),
    )
    .default([]),
  schoolStatus: z.object({
    isOpen: z.string().optional(),
    closeReason: z.string().nullable().optional(),
    closedDate: z.string().nullable().optional(),
  }),
})

type SchoolFormValues = z.infer<typeof schoolFormSchema>

export default function AddSchoolForm({states}: {states: State[]}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newSubject, setNewSubject] = useState("")
  const [newStation, setNewStation] = useState("")
  const [newActivity, setNewActivity] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [counties, setCounties] = useState<County[]>([]);
  const [payams, setPayams] = useState<Payam[]>([]);
  const  router = useRouter();
  const {toast}  = useToast();



  // Fetch counties when state is selected
  const handleStateChange = async (value: string) => {
    form.setValue('state10', value);
    form.setValue('county28', '');
    form.setValue('payam28', '');

    try {
      setIsLoading(true);
      const response = await axios.post(`${base_url}data-set/get/2023_data/county`, { state: value });
      setCounties(response.data);
    } catch (error) {
      console.error("Error fetching counties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch payams when county is selected
  const handleCountyChange = async (value: string) => {
    form.setValue('county28', value);
    form.setValue('payam28', '');

    try {
      setIsLoading(true);
      const response = await axios.post(`${base_url}data-set/get/2023_data/county/payam`, { county28: value });
      setPayams(response.data);
    } catch (error) {
      console.error("Error fetching payams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payam selection
  const handlePayamChange = (value: string) => {
    form.setValue('payam28', value);
  };

  // Initialize the form with default values
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      code: "",
      payam28: "",
      state10: "",
      county28: "",
      schoolName: "",
      schoolOwnerShip: "",
      schoolType: "",
      headTeacher: {
        name: "",
        phoneNumber: "",
        email: "",
      },
      pta: {
        name: "",
        phoneNumber: "",
      },
      reporter: {
        name: "",
        phoneNumber: "",
      },
      facilities: {
        hasKitchen: false,
        hasFoodStorage: false,
        hasTextbookStorage: false,
        hasCleanWater: false,
        hasInternet: false,
        hasRecreationalActivities: false,
      },
      location: {
        gpsLng: undefined,
        gpsLat: undefined,
        gpsElev: undefined,
        distanceToNearestVillage: undefined,
        distanceToNearestSchool: undefined,
        distanceToBank: undefined,
        distanceToMarket: undefined,
        distanceToCamp: undefined,
      },
      subjects: [],
      mentoringProgramme: [{ isAvailable: false, activities: [] }],
      feedingProgramme: [{ isAvailable: false }],
      emisId: "",
      radioCoverage: {
        stations: [],
        programme: false,
        programmeGroup: "",
      },
      cellphoneCoverage: {
        vivacel: false,
        mtn: false,
        zain: false,
        gemtel: false,
        digitel: false,
        other: false,
      },
      operation: {
        boarding: false,
        daySchool: false,
        dayBoarding: false,
        feePaid: false,
        feeAmount: undefined,
      },
      schoolCategory: "",
      calendar: {
        year: new Date().getFullYear(),
        terms: [],
        holidays: [],
      },
      bankDetails: {
        bankName: "",
        accountName: "",
        accountNumber: undefined,
        bankBranch: "",
      },
      lastVisited: [],
      schoolStatus: {
        isOpen: "Yes",
        closeReason: null,
        closedDate: null,
      },
    },
  })

  // Field arrays for dynamic fields
  const {
    fields: termFields,
    append: appendTerm,
    remove: removeTerm,
  } = useFieldArray({ control: form.control, name: "calendar.terms" })

  const {
    fields: holidayFields,
    append: appendHoliday,
    remove: removeHoliday,
  } = useFieldArray({ control: form.control, name: "calendar.holidays" })

  const {
    fields: lastVisitedFields,
    append: appendLastVisited,
    remove: removeLastVisited,
  } = useFieldArray({ control: form.control, name: "lastVisited" })

  const {
    fields: feedingFields,
    append: appendFeeding,
    remove: removeFeeding,
  } = useFieldArray({ control: form.control, name: "feedingProgramme" })

  // Handle adding a new subject
  const handleAddSubject = () => {
    if (newSubject.trim() !== "") {
      const currentSubjects = form.getValues("subjects") || []
      if (!currentSubjects.includes(newSubject)) {
        form.setValue("subjects", [...currentSubjects, newSubject])
        setNewSubject("")
      }
    }
  }

  // Handle removing a subject
  const handleRemoveSubject = (subject: string) => {
    const currentSubjects = form.getValues("subjects") || []
    form.setValue(
      "subjects",
      currentSubjects.filter((s) => s !== subject),
    )
  }

  // Handle adding a new radio station
  const handleAddStation = () => {
    if (newStation.trim() !== "") {
      const currentStations = form.getValues("radioCoverage.stations") || []
      if (!currentStations.includes(newStation)) {
        form.setValue("radioCoverage.stations", [...currentStations, newStation])
        setNewStation("")
      }
    }
  }

  // Handle removing a radio station
  const handleRemoveStation = (station: string) => {
    const currentStations = form.getValues("radioCoverage.stations") || []
    form.setValue(
      "radioCoverage.stations",
      currentStations.filter((s) => s !== station),
    )
  }

  // Handle adding a new mentoring activity
  const handleAddActivity = (index: number) => {
    if (newActivity.trim() !== "") {
      const currentActivities = form.getValues(`mentoringProgramme.${index}.activities`) || []
      if (!currentActivities.includes(newActivity)) {
        form.setValue(`mentoringProgramme.${index}.activities`, [...currentActivities, newActivity])
        setNewActivity("")
      }
    }
  }

  // Handle removing a mentoring activity
  const handleRemoveActivity = (index: number, activity: string) => {
    const currentActivities = form.getValues(`mentoringProgramme.${index}.activities`) || []
    form.setValue(
      `mentoringProgramme.${index}.activities`,
      currentActivities.filter((a) => a !== activity),
    )
  } 

  // Handle submission
  async function onSubmit(data: SchoolFormValues) {
   
    setIsSubmitting(true)
    try {
      const response = await axios.post(`${base_url}school-data/school`, data)

      toast({
        title: "Success",
        description: "School data has been submitted successfully",
      })
      form.reset()
      router.back()
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${error.response?.data?.message || "Failed to submit school data"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-primary/20 to-background p-2">
        <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Spinner color="primary" size="lg" />
        </Backdrop>

      <div >
        <Breadcrumbs size='lg'>
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem href="/dashboard/schools">Schools</BreadcrumbItem>
          <BreadcrumbItem href="/dashboard/schools/new"> new school</BreadcrumbItem>

    
        </Breadcrumbs>

      </div>

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
        Add New School
        </h1>
       
      </div>

  
        <div>
          <div >
          
            <ScrollArea className=" px-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="contacts">Contacts</TabsTrigger>
                      <TabsTrigger value="facilities">Facilities & Location</TabsTrigger>
                      <TabsTrigger value="programs">Programs & Operations</TabsTrigger>
                    </TabsList>

                    {/* Basic Information Tab */}
                    <TabsContent value="basic" className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                         

                          <FormField
                            control={form.control}
                            name="state10"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State *</FormLabel>
                                <FormControl>
                                  <ComboboxSelect
                                    options={states?.map((state) => ({ value: state.state, label: state.state })) || []}
                                    value={field.value}
                                    onChange={handleStateChange}
                                    placeholder="Select State"
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="county28"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>County *</FormLabel>
                                <FormControl>
                                  <ComboboxSelect
                                    options={counties.map((county) => ({ value: county._id, label: county._id }))}
                                    value={field.value}
                                    onChange={handleCountyChange}
                                    placeholder="Select County"
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="payam28"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payam *</FormLabel>
                                <FormControl>
                                  <ComboboxSelect
                                    options={payams.map((payam) => ({ value: payam._id, label: payam._id }))}
                                    value={field.value}
                                    onChange={handlePayamChange}
                                    placeholder="Select Payam"
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

<FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>School Code *</FormLabel>
                                <FormControl>
                                  <Input placeholder="SCH-TEST-001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="emisId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>EMIS ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="EMIS-123456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="schoolName"
                            render={({ field }) => (
                              <FormItem >
                                <FormLabel>School Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Example School" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="schoolOwnerShip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>School Ownership *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select ownership type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Private">Private</SelectItem>
                                    <SelectItem value="Public">Public</SelectItem>
                                    <SelectItem value="Community">Community</SelectItem>
                                    <SelectItem value="Faith-Based">Faith-Based</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="schoolType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>School Type *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select school type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="PRI">Primary</SelectItem>
                                    <SelectItem value="SEC">Secondary</SelectItem>
                                    <SelectItem value="ECD">ECD</SelectItem>
                                    <SelectItem value="ALP">ALP</SelectItem>
                                    <SelectItem value="ASP">ASP</SelectItem>
                                    <SelectItem value="TTI">TTI</SelectItem>
                                    <SelectItem value="CGS">CGS</SelectItem>
                                  </SelectContent>
                                </Select> 
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="schoolCategory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>School Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="boys">Boys</SelectItem>
                                    <SelectItem value="girls">Girls</SelectItem>
                                    <SelectItem value="mixed">Mixed</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">School Status</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="schoolStatus.isOpen"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Is the school open?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("schoolStatus.isOpen") === "No" && (
                            <>
                              <FormField
                                control={form.control}
                                name="schoolStatus.closeReason"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Reason for closure</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Reason" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="schoolStatus.closedDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Date of closure</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Subjects Taught</h3>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {form.watch("subjects").map((subject, index) => (
                              <Badge key={index} variant="secondary" className="px-3 py-1">
                                {subject}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 ml-2"
                                  onClick={() => handleRemoveSubject(subject)}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a subject (e.g., Mathematics)"
                              value={newSubject}
                              onChange={(e) => setNewSubject(e.target.value)}
                              className="flex-1"
                            />
                            <Button type="button" onClick={handleAddSubject} size="sm">
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Contacts Tab */}
                    <TabsContent value="contacts" className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Head Teacher Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="headTeacher.name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="headTeacher.phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="123-456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="headTeacher.email"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="johndoe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">PTA Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="pta.name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jane Smith" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="pta.phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="098-765-4321" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Reporter Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="reporter.name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Alice Johnson" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="reporter.phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="111-222-3333" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Bank Details</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="bankDetails.bankName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Example Bank" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="bankDetails.bankBranch"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank Branch</FormLabel>
                                <FormControl>
                                  <Input placeholder="Main Branch" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="bankDetails.accountName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Example School Account" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="bankDetails.accountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="123456789"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Last Visited</h3>
                        {lastVisitedFields.map((field, index) => (
                          <div key={field.id} className="mb-6 pb-6 border-b last:border-0">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Visit #{index + 1}</h4>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeLastVisited(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <FormField
                                control={form.control}
                                name={`lastVisited.${index}.date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`lastVisited.${index}.byWho`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Visited By</FormLabel>
                                    <FormControl>
                                      <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`lastVisited.${index}.comments`}
                                render={({ field }) => (
                                  <FormItem className="md:col-span-3">
                                    <FormLabel>Comments</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Routine check" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendLastVisited({ date: "", byWho: "", comments: "" })}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Visit Record
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Facilities & Location Tab */}
                    <TabsContent value="facilities" className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Facilities</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="facilities.hasKitchen"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Kitchen</FormLabel>
                                  <FormDescription>School has a kitchen facility</FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="facilities.hasFoodStorage"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Food Storage</FormLabel>
                                  <FormDescription>School has food storage facilities</FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="facilities.hasTextbookStorage"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Textbook Storage</FormLabel>
                                  <FormDescription>School has textbook storage facilities</FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="facilities.hasCleanWater"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Clean Water</FormLabel>
                                  <FormDescription>School has access to clean water</FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="facilities.hasInternet"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Internet</FormLabel>
                                  <FormDescription>School has internet access</FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="facilities.hasRecreationalActivities"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Recreational Activities</FormLabel>
                                  <FormDescription>School has recreational facilities</FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Location</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="location.gpsLng"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GPS Longitude</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.0001"
                                    placeholder="34.5678"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="location.gpsLat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GPS Latitude</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.0001"
                                    placeholder="-1.2345"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="location.gpsElev"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GPS Elevation (m)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="500"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <h4 className="text-md font-medium mt-6 mb-4">Distances (km)</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="location.distanceToNearestVillage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Distance to Nearest Village</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="2.5"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="location.distanceToNearestSchool"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Distance to Nearest School</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="1.0"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="location.distanceToBank"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Distance to Bank</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="3.0"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="location.distanceToMarket"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Distance to Market</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="4.0"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="location.distanceToCamp"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Distance to Camp</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="5.0"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Cellphone Coverage</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="cellphoneCoverage.vivacel"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Vivacel</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cellphoneCoverage.mtn"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>MTN</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cellphoneCoverage.zain"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Zain</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cellphoneCoverage.gemtel"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Gemtel</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cellphoneCoverage.digitel"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Digitel</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cellphoneCoverage.other"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Other</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Radio Coverage</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="radioCoverage.programme"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Has Radio Programme</FormLabel>
                                  <FormDescription>School has a radio programme</FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          {form.watch("radioCoverage.programme") && (
                            <FormField
                              control={form.control}
                              name="radioCoverage.programmeGroup"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Programme Group</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Local Radio" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        <div className="mt-4">
                          <h4 className="text-md font-medium mb-2">Radio Stations</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {form.watch("radioCoverage.stations").map((station, index) => (
                              <Badge key={index} variant="secondary" className="px-3 py-1">
                                {station}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 ml-2"
                                  onClick={() => handleRemoveStation(station)}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a radio station"
                              value={newStation}
                              onChange={(e) => setNewStation(e.target.value)}
                              className="flex-1"
                            />
                            <Button type="button" onClick={handleAddStation} size="sm">
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Programs & Operations Tab */}
                    <TabsContent value="programs" className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">School Operation</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="operation.boarding"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Boarding</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="operation.daySchool"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Day School</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="operation.dayBoarding"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Day & Boarding</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="operation.feePaid"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Fee Paid</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>

                        {form.watch("operation.feePaid") && (
                          <div className="mt-4">
                            <FormField
                              control={form.control}
                              name="operation.feeAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fee Amount</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="500"
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) =>
                                        field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Calendar</h3>
                        <FormField
                          control={form.control}
                          name="calendar.year"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel>Academic Year</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="2025"
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <h4 className="text-md font-medium mb-2">Terms</h4>
                        {termFields.map((field, index) => (
                          <div key={field.id} className="mb-6 pb-4 border-b last:border-0">
                            <div className="flex justify-between items-center mb-4">
                              <h5 className="font-medium">Term #{index + 1}</h5>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeTerm(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <FormField
                                control={form.control}
                                name={`calendar.terms.${index}.termNumber`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Term Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="1"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) =>
                                          field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`calendar.terms.${index}.startDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`calendar.terms.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendTerm({ termNumber: termFields.length + 1, startDate: "", endDate: "" })}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Term
                        </Button>

                        <h4 className="text-md font-medium mt-6 mb-2">Holidays</h4>
                        {holidayFields.map((field, index) => (
                          <div key={field.id} className="mb-6 pb-4 border-b last:border-0">
                            <div className="flex justify-between items-center mb-4">
                              <h5 className="font-medium">Holiday #{index + 1}</h5>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeHoliday(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <FormField
                                control={form.control}
                                name={`calendar.holidays.${index}.holidayName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Holiday Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Easter Break" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`calendar.holidays.${index}.startDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`calendar.holidays.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendHoliday({ holidayName: "", startDate: "", endDate: "" })}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Holiday
                        </Button>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Mentoring Programme</h3>
                        {form.watch("mentoringProgramme").map((program, index) => (
                          <div key={index} className="mb-6 pb-4 border-b last:border-0">
                            <FormField
                              control={form.control}
                              name={`mentoringProgramme.${index}.isAvailable`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Mentoring Programme Available</FormLabel>
                                    <FormDescription>School has a mentoring programme</FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />

                            {form.watch(`mentoringProgramme.${index}.isAvailable`) && (
                              <div className="mt-4">
                                <h4 className="text-md font-medium mb-2">Activities</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {form.watch(`mentoringProgramme.${index}.activities`).map((activity, actIndex) => (
                                    <Badge key={actIndex} variant="secondary" className="px-3 py-1">
                                      {activity}
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 ml-2"
                                        onClick={() => handleRemoveActivity(index, activity)}
                                      >
                                        <X className="h-3 w-3" />
                                        <span className="sr-only">Remove</span>
                                      </Button>
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Add an activity (e.g., Tutoring)"
                                    value={newActivity}
                                    onChange={(e) => setNewActivity(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button type="button" onClick={() => handleAddActivity(index)} size="sm">
                                    Add
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">Feeding Programme</h3>
                        {feedingFields.map((field, index) => (
                          <div key={field.id} className="mb-6 pb-4 border-b last:border-0">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Feeding Programme #{index + 1}</h4>
                              {feedingFields.length > 1 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeFeeding(index)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <FormField
                              control={form.control}
                              name={`feedingProgramme.${index}.isAvailable`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Feeding Programme Available</FormLabel>
                                    <FormDescription>School has a feeding programme</FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />

                            {form.watch(`feedingProgramme.${index}.isAvailable`) && (
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name={`feedingProgramme.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Programme Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="School Meal Program" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`feedingProgramme.${index}.organizationName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Organization Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Food NGO" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`feedingProgramme.${index}.numberOfMeals`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Number of Meals</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="2"
                                          {...field}
                                          value={field.value || ""}
                                          onChange={(e) =>
                                            field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`feedingProgramme.${index}.kindStaff`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Kind of Staff</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Volunteers" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendFeeding({ isAvailable: false })}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Feeding Programme
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="px-0">
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Submitting..." : "Submit School Data"}
                    </Button>
                  </div>
                </form>
              </Form>
            </ScrollArea>
          </div> 
        </div>

    </div>
  )
}
