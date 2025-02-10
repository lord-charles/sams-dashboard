"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { base_url } from "@/app/utils/baseUrl"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const modules = [
  { name: "Schools", icon: "SchoolIcon" },
  { name: "Learners", icon: "GraduateIcon" },
  { name: "Live Enrollment", icon: "GraduateIcon" },
  { name: "Teachers", icon: "GraduateIcon" },
  { name: "Attendance", icon: "CalendarIcon" },
  { name: "Cash Transfers", icon: "CashIcon" },
  { name: "Capitation Grants", icon: "CashIcon" },
  { name: "Other Disbursements", icon: "CashIcon" },
  { name: "Teacher Incentives", icon: "CashIcon" },
  { name: "Users", icon: "UsersIcon" },
  { name: "Roles", icon: "UsersIcon" },
  { name: "Reports", icon: "GraphIcon" },
  { name: "Progress", icon: "ActivityIcon" },
]

const roleTypes = ["read", "write"]

interface Role {
  _id: string
  name: string
  permissions: string[]
  roles: string[]
  createdAt: string
  updatedAt: string
  __v: number
}

export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [] as string[],
    roles: [] as string[],
  })
  const [openPermissions, setOpenPermissions] = useState(false)
  const [openRoles, setOpenRoles] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const { toast } = useToast()

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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleCreateRole = async () => {
    try {
      if (!newRole.name.trim()) {
        toast({
          title: "Error",
          description: "Role name is required",
          variant: "destructive",
        })
        return
      }
      const res = await axios.post(`${base_url}roles`, newRole)
      toast({
        title: "Success",
        duration: 6000,
        variant: "default",
        description: "Role created successfully",
      })
      fetchRoles()
      setNewRole({
        name: "",
        permissions: [],
        roles: [],
      })
      setDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        duration: 6000,
        description: error?.response.data.message,
        variant: "destructive",
      })
      console.log("Error creating role:", error.response.data.message)
    }
  }

  const handleDeleteRole = async () => {
    if (!roleToDelete) return

    try {
      await axios.delete(`${base_url}roles/${roleToDelete._id}`)
      toast({
        title: "Success",
        duration: 6000,
        variant: "default",
        description: "Role deleted successfully",
      })
      fetchRoles()
    } catch (error: any) {
      toast({
        title: "Error",
        duration: 6000,
        description: error?.response.data.message,
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="border-b bg-muted/40">
        <CardTitle className="text-2xl font-bold">Roles Management</CardTitle>
        <CardDescription>Create and manage system roles</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4">Create New Role</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>Configure role access and permissions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    placeholder="Enter role name"
                    value={newRole.name}
                    onChange={(e) =>
                      setNewRole({
                        ...newRole,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role Types</Label>
                  <Popover open={openRoles} onOpenChange={setOpenRoles}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openRoles}
                        className="w-full justify-between"
                      >
                        {newRole.roles.length > 0 ? `${newRole.roles.length} selected` : "Select roles..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search roles..." />
                        <CommandList>
                          {" "}
                          {/* Wrapped CommandGroup and CommandEmpty */}
                          <CommandEmpty>No role found.</CommandEmpty>
                          <CommandGroup>
                            {roleTypes.map((role) => (
                              <CommandItem
                                key={role}
                                onSelect={() => {
                                  setNewRole({
                                    ...newRole,
                                    roles: newRole.roles.includes(role)
                                      ? newRole.roles.filter((r) => r !== role)
                                      : [...newRole.roles, role],
                                  })
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newRole.roles.includes(role) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>{" "}
                        {/* Wrapped CommandGroup and CommandEmpty */}
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Module Permissions</Label>
                  <Popover open={openPermissions} onOpenChange={setOpenPermissions}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openPermissions}
                        className="w-full justify-between"
                      >
                        {newRole.permissions.length > 0
                          ? `${newRole.permissions.length} selected`
                          : "Select permissions..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search modules..." />
                        <CommandList>
                          {" "}
                          {/* Wrapped CommandGroup and CommandEmpty */}
                          <CommandEmpty>No module found.</CommandEmpty>
                          <CommandGroup>
                            {modules.map((module) => (
                              <CommandItem
                                key={module.name}
                                onSelect={() => {
                                  setNewRole({
                                    ...newRole,
                                    permissions: newRole.permissions.includes(module.name)
                                      ? newRole.permissions.filter((p) => p !== module.name)
                                      : [...newRole.permissions, module.name],
                                  })
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newRole.permissions.includes(module.name) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {module.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>{" "}
                        {/* Wrapped CommandGroup and CommandEmpty */}
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Access Types</TableHead>
                  <TableHead>Module Permissions</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role._id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {(role.roles || []).map((type, index) => (
                          <Badge key={index} variant="secondary" className="capitalize text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(role.permissions || []).map((permission, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/5 text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => {
                          setRoleToDelete(role)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the role
                  "{roleToDelete?.name}" and remove it from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDeleteRole}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
