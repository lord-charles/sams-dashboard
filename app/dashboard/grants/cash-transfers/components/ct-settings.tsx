"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { base_url } from "@/app/utils/baseUrl"
import { ScrollArea } from "@/components/ui/scroll-area"

type RequiresDisability = {
    male: boolean
    female: boolean
}

type ClassInfo = {
    className: string
    requiresDisability: RequiresDisability
}

type CriteriaItem = {
    _id: string
    educationType: string
    classes: ClassInfo[]
    isActive: boolean
}

const EDUCATION_TYPES = [
    { value: "PRI", label: "Primary", classes: ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"] },
    { value: "SEC", label: "Secondary", classes: ["S1", "S2", "S3", "S4"] },
    { value: "ALP", label: "ALP", classes: ["Level1", "Level2", "Level3(P5&P6)", "Level4(P7&P8)"] },
    { value: "ECD", label: "ECD", classes: ["ECD1", "ECD2", "ECD3"] },
    { value: "ASP", label: "ASP", classes: ["Level5", "Level6"] },
]

// API endpoints
const API_ENDPOINTS = {
    CREATE: `${base_url}ct/criteria`,
    LIST: `${base_url}ct/get/criteria`,
    GET: (id: string) => `${base_url}ct/get/criteria/${id}`,
    UPDATE: (id: string) => `${base_url}ct/criteria/${id}`,
    DELETE: (id: string) => `${base_url}ct/criteria/${id}`,
}

export default function CashTransferCriteriaSettings() {
    // State for criteria list and loading status
    const [criteria, setCriteria] = useState<CriteriaItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // State for the form
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentCriteria, setCurrentCriteria] = useState<Partial<CriteriaItem>>({
        educationType: "",
        classes: [],
        isActive: true,
    })
    const [currentClass, setCurrentClass] = useState<string>("")
    const [requiresMale, setRequiresMale] = useState(false)
    const [requiresFemale, setRequiresFemale] = useState(false)

    // State for delete confirmation
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Fetch all criteria on component mount
    useEffect(() => {
        fetchCriteria()
    }, [])

    // Fetch all criteria from API
    const fetchCriteria = async () => {
        setLoading(true)
        try {
            const response = await fetch(API_ENDPOINTS.LIST)
            if (!response.ok) {
                throw new Error(`Failed to fetch criteria: ${response.status}`)
            }
            const data = await response.json()
            setCriteria(data)
        } catch (error) {
            console.error("Error fetching criteria:", error)
            toast({
                title: "Error",
                description: "Failed to load criteria. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    // Reset form
    const resetForm = () => {
        setCurrentCriteria({
            educationType: "",
            classes: [],
            isActive: true,
        })
        setCurrentClass("")
        setRequiresMale(false)
        setRequiresFemale(false)
        setIsEditing(false)
    }

    // Open dialog for editing
    const handleEdit = async (item: CriteriaItem) => {
        try {
            // Fetch the latest data for this criteria
            const response = await fetch(API_ENDPOINTS.GET(item._id))
            if (!response.ok) {
                throw new Error(`Failed to fetch criteria: ${response.status}`)
            }
            const data = await response.json()
            setCurrentCriteria({ ...data })
            setIsEditing(true)
            setIsDialogOpen(true)
        } catch (error) {
            console.error("Error fetching criteria details:", error)
            toast({
                title: "Error",
                description: "Failed to load criteria details. Please try again.",
                variant: "destructive",
            })
        }
    }

    // Add a class to the current criteria
    const addClass = () => {
        if (!currentClass) {
            toast({
                title: "Error",
                description: "Please select a class name",
                variant: "destructive",
            })
            return
        }

        // Check if class already exists
        if (currentCriteria.classes?.some((c) => c.className === currentClass)) {
            toast({
                title: "Error",
                description: "This class is already added",
                variant: "destructive",
            })
            return
        }

        const newClass: ClassInfo = {
            className: currentClass,
            requiresDisability: {
                male: requiresMale,
                female: requiresFemale,
            },
        }

        setCurrentCriteria({
            ...currentCriteria,
            classes: [...(currentCriteria.classes || []), newClass],
        })

        // Reset class form
        setCurrentClass("")
        setRequiresMale(false)
        setRequiresFemale(false)
    }

    // Remove a class from the current criteria
    const removeClass = (className: string) => {
        setCurrentCriteria({
            ...currentCriteria,
            classes: currentCriteria.classes?.filter((c) => c.className !== className) || [],
        })
    }

    // Save the current criteria
    const saveCriteria = async () => {
        if (!currentCriteria.educationType) {
            toast({
                title: "Error",
                description: "Please select an education type",
                variant: "destructive",
            })
            return
        }

        if (!currentCriteria.classes?.length) {
            toast({
                title: "Error",
                description: "Please add at least one class",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            if (isEditing) {
                // Update existing criteria
                const response = await fetch(API_ENDPOINTS.UPDATE(currentCriteria._id!), {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(currentCriteria),
                })

                if (!response.ok) {
                    throw new Error(`Failed to update criteria: ${response.status}`)
                }

                toast({
                    title: "Success",
                    description: "Criteria updated successfully",
                })
            } else {
                // Add new criteria
                const response = await fetch(API_ENDPOINTS.CREATE, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(currentCriteria),
                })

                if (!response.ok) {
                    throw new Error(`Failed to create criteria: ${response.status}`)
                }

                toast({
                    title: "Success",
                    description: "New criteria added successfully",
                })
            }

            // Refresh the criteria list
            await fetchCriteria()
            setIsDialogOpen(false)
            resetForm()
        } catch (error) {
            console.error("Error saving criteria:", error)
            toast({
                title: "Error",
                description: isEditing
                    ? "Failed to update criteria. Please try again."
                    : "Failed to create criteria. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open delete confirmation dialog
    const confirmDelete = (id: string) => {
        setDeleteId(id)
        setIsDeleteDialogOpen(true)
    }

    // Delete a criteria
    const deleteCriteria = async () => {
        if (!deleteId) return

        setIsSubmitting(true)
        try {
            const response = await fetch(API_ENDPOINTS.DELETE(deleteId), {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error(`Failed to delete criteria: ${response.status}`)
            }

            // Refresh the criteria list
            await fetchCriteria()
            toast({
                title: "Success",
                description: "Criteria deleted successfully",
            })
        } catch (error) {
            console.error("Error deleting criteria:", error)
            toast({
                title: "Error",
                description: "Failed to delete criteria. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
            setIsDeleteDialogOpen(false)
            setDeleteId(null)
        }
    }

    // Toggle active status
    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(API_ENDPOINTS.UPDATE(id), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isActive: !currentStatus }),
            })

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`)
            }

            // Update local state
            setCriteria(criteria.map((item) => (item._id === id ? { ...item, isActive: !currentStatus } : item)))

            toast({
                title: "Success",
                description: `Criteria ${!currentStatus ? "activated" : "deactivated"} successfully`,
            })
        } catch (error) {
            console.error("Error toggling status:", error)
            toast({
                title: "Error",
                description: "Failed to update status. Please try again.",
                variant: "destructive",
            })
        }
    }

    // Get available classes based on selected education type
    const getAvailableClasses = () => {
        const educationType = currentCriteria.educationType
        if (!educationType) return []

        const selectedType = EDUCATION_TYPES.find((type) => type.value === educationType)
        return selectedType ? selectedType.classes : []
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cash Transfer Criteria</h1>
                    <p className="text-muted-foreground">Manage eligibility criteria for cash transfers</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                resetForm()
                                setIsDialogOpen(true)
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New Criteria
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? "Edit Criteria" : "Add New Criteria"}</DialogTitle>
                            <DialogDescription>
                                {isEditing
                                    ? "Update the eligibility criteria for cash transfers"
                                    : "Define new eligibility criteria for cash transfers"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="educationType">Education Type</Label>
                                <Select
                                    value={currentCriteria.educationType}
                                    onValueChange={(value) =>
                                        setCurrentCriteria({ ...currentCriteria, educationType: value, classes: [] })
                                    }
                                    disabled={isEditing}
                                >
                                    <SelectTrigger id="educationType">
                                        <SelectValue placeholder="Select education type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EDUCATION_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={currentCriteria.isActive}
                                        onCheckedChange={(checked) => setCurrentCriteria({ ...currentCriteria, isActive: checked })}
                                    />
                                    <span>{currentCriteria.isActive ? "Active" : "Inactive"}</span>
                                </div>
                            </div>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle>Classes</CardTitle>
                                    <CardDescription>Add classes and their disability requirements</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="className">Class Name</Label>
                                                <Select value={currentClass} onValueChange={setCurrentClass}>
                                                    <SelectTrigger id="className">
                                                        <SelectValue placeholder="Select class" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getAvailableClasses().map((className) => (
                                                            <SelectItem key={className} value={className}>
                                                                {className}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Requires Disability</Label>
                                                <div className="flex space-x-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Switch checked={requiresMale} onCheckedChange={setRequiresMale} id="male-disability" />
                                                        <Label htmlFor="male-disability">Male</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            checked={requiresFemale}
                                                            onCheckedChange={setRequiresFemale}
                                                            id="female-disability"
                                                        />
                                                        <Label htmlFor="female-disability">Female</Label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="button" variant="outline" onClick={addClass}>
                                            <Plus className="mr-2 h-4 w-4" /> Add Class
                                        </Button>

                                        {currentCriteria.classes && currentCriteria.classes.length > 0 ? (
                                            <ScrollArea className="h-[200px]">
                                                <div className="border rounded-md p-3">
                                                    <h4 className="font-medium mb-2">Added Classes</h4>
                                                    <div className="space-y-2">
                                                        {currentCriteria.classes.map((classInfo) => (
                                                            <div
                                                                key={classInfo.className}
                                                                className="flex items-center justify-between bg-muted p-2 rounded-md"
                                                            >
                                                                <div>
                                                                    <span className="font-medium">{classInfo.className}</span>
                                                                    <div className="text-sm text-muted-foreground mt-1">
                                                                        Disability required:
                                                                        {classInfo.requiresDisability.male && " Male"}
                                                                        {classInfo.requiresDisability.female && " Female"}
                                                                        {!classInfo.requiresDisability.male &&
                                                                            !classInfo.requiresDisability.female &&
                                                                            " None"}
                                                                    </div>
                                                                </div>
                                                                <Button variant="ghost" size="sm" onClick={() => removeClass(classInfo.className)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                        ) : (
                                            <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                                                No classes added yet
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button onClick={saveCriteria} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isEditing ? "Updating..." : "Saving..."}
                                    </>
                                ) : isEditing ? (
                                    "Update"
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Criteria</CardTitle>
                    <CardDescription>View and manage all cash transfer criteria</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : criteria.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Education Type</TableHead>
                                    <TableHead>Classes</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {criteria.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            {EDUCATION_TYPES.find((t) => t.value === item.educationType)?.label || item.educationType}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {item.classes.map((classInfo) => (
                                                    <Badge key={classInfo.className} variant="outline" className="flex items-center gap-1">
                                                        {classInfo.className}
                                                        {(classInfo.requiresDisability.male || classInfo.requiresDisability.female) && (
                                                            <span className="text-xs ml-1">
                                                                {classInfo.requiresDisability.male && "M"}
                                                                {classInfo.requiresDisability.male && classInfo.requiresDisability.female && "/"}
                                                                {classInfo.requiresDisability.female && "F"}
                                                            </span>
                                                        )}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Switch checked={item.isActive} onCheckedChange={() => toggleActive(item._id, item.isActive)} />
                                                <Badge variant={item.isActive ? "default" : "secondary"}>
                                                    {item.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => confirmDelete(item._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center p-8 border border-dashed rounded-md text-muted-foreground">
                            No criteria found. Click "Add New Criteria" to create one.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected criteria.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteCriteria} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
