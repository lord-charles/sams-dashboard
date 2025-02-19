"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState, useEffect } from "react"
import { base_url } from "@/app/utils/baseUrl"
import axios from "axios"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
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
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface Role {
  _id: string
  name: string
  permissions: string[]
  roles: string[]
}

interface DataTableRowActionsProps<TData> {
  row: Row<any>
}

const updateFormSchema = z.object({
  lastname: z.string().min(1, "Last name is required"),
  firstname: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
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
  active: z.boolean(),
})

const states = [
  "AAA", "CES", "EES", "JGL", "LKS", "NBG",
  "PAA", "RAA", "UNS", "UTY", "WBG", "WES", "WRP",
]

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const item = row.original
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showUpdateSheet, setShowUpdateSheet] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const updateForm = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      lastname: item.lastname,
      firstname: item.firstname,
      middleName: item.middleName || "",
      userType: item.userType,
      username: item.username,
      statesAsigned: item.statesAsigned,
      phoneNumber: item.phoneNumber || "",
      role: item.role,
      gender: item.gender as "M" | "F",
      active: item.active,
    },
  })

  useEffect(() => {
    fetchRoles()
  }, [])

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
    }
  }

  const handleUpdate = async (values: z.infer<typeof updateFormSchema>) => {
    try {
      setLoading(true)
      await axios.patch(`${base_url}user/users/update/${item._id}`, values)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      setShowUpdateSheet(false)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={() => setShowViewDialog(true)}>
            View
            <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowUpdateSheet(true)}>
            Update
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user
                  and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await axios.delete(`${base_url}user/users/delete-user/${item._id}`)
                      toast({
                        title: "Success",
                        description: "User deleted successfully",
                      })
                      setTimeout(() => {
                        window.location.reload()
                      }, 2000)
                    } catch (error: any) {
                      toast({
                        title: "Error",
                        description: error.response?.data?.message || "Failed to delete user",
                        variant: "destructive",
                      })
                    }
                  }}
                  className="bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl p-6 bg-white rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">User Profile</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Comprehensive details about the user&apos;s account and role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <section className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <InfoItem label="Name" value={`${item.firstname} ${item.middleName} ${item.lastname}`} />
                  <InfoItem label="Username" value={item.username} />
                  <InfoItem label="Gender" value={item.gender} />
                  <InfoItem label="Phone" value={item.phoneNumber || "N/A"} />
                  <InfoItem label="User Type" value={item.userType} />
                  <InfoItem label="Year Joined" value={item.yearJoined} />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">States Assigned</h4>
                {item.statesAsigned.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {item.statesAsigned.map((state: string) => (
                      <li key={state}>{state}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No states assigned</p>
                )}
              </div>
            </section>
            <section className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Role Information</h4>
                <div className="space-y-3 text-sm">
                  <InfoItem label="Role Name" value={item.role.name} />
                  <div>
                    <span className="font-medium text-gray-700">Permissions:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                      {item.role.permissions.map((permission: any) => (
                        <li key={permission}>{permission}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Roles:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                      {item.role.roles.map((role: any) => (
                        <li key={role}>{role}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">System Information</h4>
                <div className="space-y-2 text-sm">
                  <InfoItem
                    label="Status"
                    value={
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    }
                  />
                  <InfoItem label="Created" value={format(new Date(item.createdAt), "PPpp")} />
                  <InfoItem label="Last Updated" value={format(new Date(item.updatedAt), "PPpp")} />
                </div>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={showUpdateSheet} onOpenChange={setShowUpdateSheet}>
        <SheetContent className="sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Update User</SheetTitle>
            <SheetDescription>Update user information.</SheetDescription>
          </SheetHeader>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateForm.control}
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
                  control={updateForm.control}
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
                control={updateForm.control}
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
                  control={updateForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateForm.control}
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
  <SelectItem value="enumerator">Enumerator</SelectItem>
  <SelectItem value="school-officer">School Officer</SelectItem>
  <SelectItem value="mogei-official">MoGEI Official</SelectItem>
  <SelectItem value="data-supervisor">Data Supervisor</SelectItem>
  <SelectItem value="sa-team-leader">SA Team Leader</SelectItem>
  <SelectItem value="deputy-team-leader">Deputy Team Leader</SelectItem>
  <SelectItem value="disability-champion">Disability Champion</SelectItem>
  <SelectItem value="donor">Donor</SelectItem>
  <SelectItem value="gess-secretariate">GESS Secretariate</SelectItem>
</SelectContent>

                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
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
                control={updateForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "true")}
                      defaultValue={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
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
                control={updateForm.control}
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
                {loading ? "Updating..." : "Update User"}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  )
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </div>
  )
}