"use client";

import Image from "next/image";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useThemeContext } from "@/lib/themeContext";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { base_url } from "@/app/utils/baseUrl"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

const states = [
  "AAA",
  "CES",
  "EES",
  "JGL",
  "LKS",
  "NBG",
  "PAA",
  "RAA",
  "UNS",
  "UTY",
  "WBG",
  "WES",
  "WRP",
]

const formSchema = z.object({
  lastname: z.string().min(1, "Last name is required"),
  firstname: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  password: z.string().min(4, "Password must be at least 4 characters"),
  userType: z.string().min(1, "User type is required"),
  username: z.string().min(1, "Username is required"),
  statesAsigned: z.array(z.string()),
  phoneNumber: z.string().optional(),
  role: z.object({
    name: z.string().min(1, { message: "Role is required" }),
    permissions: z.array(z.string()),
    roles: z.array(z.string()),
  }).required(),
  gender: z.enum(["M", "F"]),
})

interface Role {
  _id: string
  name: string
  permissions: string[]
  roles: string[]
}

interface teacherInterface {
  active: boolean;
  code: string;
  countryOfOrigin: string;
  county10: string;
  county28: string;
  dateJoined: string;
  dob: string;
  dutyAssigned: { duty: string }[];
  email: string;
  firstAppointment: string;
  firstname: string;
  gender: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isDroppedOut: boolean;
  lastname: string;
  nationalNo: string;
  notes: string;
  payam28: string;
  phoneNumber: string;
  position: string;
  professionalQual: string;
  refugee: string;
  salaryGrade: string;
  school: string;
  source: string;
  state10: string;
  statesAsigned: string[];
  teacherCode: string;
  teacherHrisCode: string;
  teacherUniqueID: string;
  teachersEstNo: string;
  trainingLevel: string;
  userType: string;
  username: string;
  workStatus: string;
  year: string;
};

export default function UsersTable({
  users,
}: {
  users: teacherInterface[];
}) {
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastname: "",
      firstname: "",
      middleName: "",
      password: "",
      userType: "",
      username: "",
      statesAsigned: [] as string[],
      phoneNumber: "",
      role: {
        name: "",
        permissions: [],
        roles: [],
      },
      gender: "M",
    },
  })

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${base_url}roles`)
      setRoles(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      })
      console.error("Error fetching roles:", error)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response = await axios.post(`${base_url}user/register`, values)
      toast({
        title: "Success",
        description: "User created successfully",
      })
      setOpen(false)
      form.reset()
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between space-y-2">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Here&apos;s a list of users.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button className="text-white font-semibold">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New User
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-[500px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Create New User</SheetTitle>
                  <SheetDescription>Add a new user to the system.</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Middle name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username (unique)</FormLabel>
                            <FormControl>
                              <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select user type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="superadmin">Super Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="enumalator">Enumalator</SelectItem>

                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="M">Male</SelectItem>
                                <SelectItem value="F">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const selectedRole = roles.find((r) => r._id === value)
                              if (selectedRole) {
                                field.onChange({
                                  name: selectedRole.name,
                                  permissions: selectedRole.permissions,
                                  roles: selectedRole.roles,
                                })
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role._id} value={role._id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="statesAsigned"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned States</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between"
                              >
                                {field.value?.length > 0
                                  ? `${field.value.length} selected`
                                  : "Select states..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search states..." />
                                <CommandList>
                                  <CommandEmpty>No state found.</CommandEmpty>
                                  <CommandGroup>
                                    {states.map((state) => (
                                      <CommandItem
                                        key={state}
                                        onSelect={() => {
                                          const currentValue = field.value || []
                                          const newValue = currentValue.includes(state)
                                            ? currentValue.filter((s) => s !== state)
                                            : [...currentValue, state]
                                          field.onChange(newValue)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value?.includes(state) ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {state}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating..." : "Create User"}
                    </Button>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={users} />
      </CardContent>
    </Card>
  )
}
