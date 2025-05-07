"use client"

import { useState } from "react"
import { Edit, Save, AlertTriangle, CheckCircle, Plus, Trash2, Pencil, Utensils, Users, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import { base_url } from "@/app/utils/baseUrl"

interface SchoolProgramsProps {
  schoolInfo: any
}

export function SchoolPrograms({ schoolInfo }: SchoolProgramsProps) {
  // Initialize with schoolInfo programs if they exist, otherwise create empty arrays
  const initialPrograms = {
    mentoringProgramme: schoolInfo?.mentoringProgramme || [
      {
        isAvailable: false,
        activities: [],
      },
    ],
    feedingProgramme: schoolInfo?.feedingProgramme || [],
  }

  const [programsData, setProgramsData] = useState(initialPrograms)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("mentoring")

  // State for modal forms
  const [showMentoringModal, setShowMentoringModal] = useState(false)
  const [showFeedingModal, setShowFeedingModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Form states for different program types
  const [mentoringForm, setMentoringForm] = useState({
    isAvailable: false,
    activities: [""],
  })

  const [feedingForm, setFeedingForm] = useState({
    name: "",
    organizationName: "",
    numberOfMeals: 0,
    kindStaff: "",
    isAvailable: false,
  })

  // Reset form states
  const resetForms = () => {
    setMentoringForm({
      isAvailable: false,
      activities: [""],
    })

    setFeedingForm({
      name: "",
      organizationName: "",
      numberOfMeals: 0,
      kindStaff: "",
      isAvailable: false,
    })

    setEditingIndex(null)
  }

  // Open edit modal for a specific program
  const openEditModal = (type: string, index: number) => {
    setEditingIndex(index)

    if (type === "mentoring") {
      const mentoring = programsData.mentoringProgramme[index]
      setMentoringForm({
        isAvailable: mentoring.isAvailable,
        activities: mentoring.activities.length > 0 ? [...mentoring.activities] : [""],
      })
      setShowMentoringModal(true)
    } else if (type === "feeding") {
      const feeding = programsData.feedingProgramme[index]
      setFeedingForm({
        name: feeding.name || "",
        organizationName: feeding.organizationName || "",
        numberOfMeals: feeding.numberOfMeals || 0,
        kindStaff: feeding.kindStaff || "",
        isAvailable: feeding.isAvailable,
      })
      setShowFeedingModal(true)
    }
  }

  // Handle adding/removing activity fields in mentoring form
  const handleActivityChange = (index: number, value: string) => {
    const updatedActivities = [...mentoringForm.activities]
    updatedActivities[index] = value
    setMentoringForm({ ...mentoringForm, activities: updatedActivities })
  }

  const addActivityField = () => {
    setMentoringForm({ ...mentoringForm, activities: [...mentoringForm.activities, ""] })
  }

  const removeActivityField = (index: number) => {
    if (mentoringForm.activities.length > 1) {
      const updatedActivities = [...mentoringForm.activities]
      updatedActivities.splice(index, 1)
      setMentoringForm({ ...mentoringForm, activities: updatedActivities })
    }
  }

  // Add or update mentoring program
  const handleSaveMentoring = () => {
    // Filter out empty activities
    const filteredActivities = mentoringForm.activities.filter((activity) => activity.trim() !== "")

    const updatedData = { ...programsData }
    const newMentoring = {
      ...mentoringForm,
      activities: filteredActivities,
    }

    if (editingIndex !== null) {
      // Update existing mentoring program
      updatedData.mentoringProgramme[editingIndex] = newMentoring
    } else {
      // Add new mentoring program
      updatedData.mentoringProgramme.push(newMentoring)
    }

    setProgramsData(updatedData)
    setShowMentoringModal(false)
    resetForms()
  }

  // Add or update feeding program
  const handleSaveFeeding = () => {
    const updatedData = { ...programsData }
    const newFeeding = { ...feedingForm }

    if (editingIndex !== null) {
      // Update existing feeding program
      updatedData.feedingProgramme[editingIndex] = newFeeding
    } else {
      // Add new feeding program
      updatedData.feedingProgramme.push(newFeeding)
    }

    setProgramsData(updatedData)
    setShowFeedingModal(false)
    resetForms()
  }

  // Delete program
  const deleteProgram = (type: string, index: number) => {
    const updatedData = { ...programsData }

    if (type === "mentoring") {
      updatedData.mentoringProgramme.splice(index, 1)
      // If all mentoring programs are deleted, add an empty one
      if (updatedData.mentoringProgramme.length === 0) {
        updatedData.mentoringProgramme.push({
          isAvailable: false,
          activities: [],
        })
      }
    } else if (type === "feeding") {
      updatedData.feedingProgramme.splice(index, 1)
    }

    setProgramsData(updatedData)
  }

  // Save changes to the server
  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Prepare the payload with the programs data
      const payload = {
        mentoringProgramme: programsData.mentoringProgramme,
        feedingProgramme: programsData.feedingProgramme,
      }

      const res = await axios.patch(`${base_url}school-data/school/${schoolInfo._id}`, payload)

      if (!res.data) throw new Error("Failed to update school programs")

      setSuccess(true)
      setIsEditing(false)

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Cancel editing and revert changes
  const handleCancel = () => {
    setProgramsData(initialPrograms) // Revert to original data
    setIsEditing(false)
    setError(null)
  }

  // Get the count of available programs
  const getProgramsCount = () => {
    let count = 0

    // Count mentoring programs that are available
    programsData.mentoringProgramme.forEach((program: any) => {
      if (program.isAvailable) count++
    })

    // Count feeding programs that are available
    programsData.feedingProgramme.forEach((program: any) => {
      if (program.isAvailable) count++
    })

    return count
  }

  const programsCount = getProgramsCount()

  // Render status badge
  const renderStatusBadge = (isAvailable: boolean) => (
    <Badge
      variant={isAvailable ? "default" : "outline"}
      className={isAvailable ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
    >
      {isAvailable ? "Active" : "Inactive"}
    </Badge>
  )

  // Render mentoring programs section
  const renderMentoringPrograms = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        {programsData.mentoringProgramme.map((program: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <CardTitle className="text-base">Mentoring Program {index + 1}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {renderStatusBadge(program.isAvailable)}
                  {isEditing && (
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditModal("mentoring", index)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteProgram("mentoring", index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Activities</h4>
                {program.activities && program.activities.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {program.activities.map((activity: string, actIndex: number) => (
                      <li key={actIndex} className="text-sm text-slate-600 dark:text-slate-400">
                        {activity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">No activities listed</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isEditing && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            resetForms()
            setShowMentoringModal(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Mentoring Program
        </Button>
      )}
    </div>
  )

  // Render feeding programs section
  const renderFeedingPrograms = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        {programsData.feedingProgramme.length > 0 ? (
          programsData.feedingProgramme.map((program: any, index: number) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900 pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-slate-500" />
                    <CardTitle className="text-base">{program.name || `Feeding Program ${index + 1}`}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(program.isAvailable)}
                    {isEditing && (
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => openEditModal("feeding", index)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteProgram("feeding", index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-slate-500">Organization</h4>
                    <p className="text-sm">{program.organizationName || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-slate-500">Number of Meals</h4>
                    <p className="text-sm">{program.numberOfMeals || 0}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <h4 className="text-xs font-medium text-slate-500">Staff</h4>
                    <p className="text-sm">{program.kindStaff || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No feeding programs available</p>
          </div>
        )}
      </div>

      {isEditing && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            resetForms()
            setShowFeedingModal(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feeding Program
        </Button>
      )}
    </div>
  )

  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle className="text-lg">School Programs</CardTitle>
          </div>
          {!isEditing && (
            <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-200">{programsCount} Active</Badge>
          )}
          {!isEditing && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="ml-auto">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Programs
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit school programs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription>Mentoring and feeding programs available at this school</CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50 text-red-800">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertDescription>Programs updated successfully!</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-10 bg-slate-100 dark:bg-slate-900 p-1 rounded-md mb-6">
            <TabsTrigger
              value="mentoring"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              Mentoring Programs
            </TabsTrigger>
            <TabsTrigger
              value="feeding"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              Feeding Programs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentoring" className="mt-0">
            {renderMentoringPrograms()}
          </TabsContent>

          <TabsContent value="feeding" className="mt-0">
            {renderFeedingPrograms()}
          </TabsContent>
        </Tabs>
      </CardContent>

      {isEditing && (
        <CardFooter className="flex justify-end gap-3 pt-2 pb-6 px-6 bg-slate-50 dark:bg-slate-900 rounded-b-lg">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="bg-slate-900 hover:bg-slate-800">
            {loading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      )}

      {/* Mentoring Program Modal */}
      <Dialog open={showMentoringModal} onOpenChange={setShowMentoringModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Mentoring Program" : "Add Mentoring Program"}</DialogTitle>
            <DialogDescription>
              Enter the details for the mentoring program. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="mentoring-available"
                checked={mentoringForm.isAvailable}
                onCheckedChange={(checked) => setMentoringForm({ ...mentoringForm, isAvailable: checked })}
              />
              <Label htmlFor="mentoring-available">Program is active</Label>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Activities</h4>
                <Button type="button" variant="outline" size="sm" onClick={addActivityField}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Activity
                </Button>
              </div>

              <ScrollArea className="max-h-[300px] pr-4">
                <div className="space-y-3">
                  {mentoringForm.activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={activity}
                        onChange={(e) => handleActivityChange(index, e.target.value)}
                        placeholder={`Activity ${index + 1}`}
                        className="flex-1"
                      />
                      {mentoringForm.activities.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeActivityField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMentoringModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMentoring}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feeding Program Modal */}
      <Dialog open={showFeedingModal} onOpenChange={setShowFeedingModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Feeding Program" : "Add Feeding Program"}</DialogTitle>
            <DialogDescription>
              Enter the details for the feeding program. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="feeding-available"
                checked={feedingForm.isAvailable}
                onCheckedChange={(checked) => setFeedingForm({ ...feedingForm, isAvailable: checked })}
              />
              <Label htmlFor="feeding-available">Program is active</Label>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label htmlFor="program-name">Program Name</Label>
              <Input
                id="program-name"
                value={feedingForm.name}
                onChange={(e) => setFeedingForm({ ...feedingForm, name: e.target.value })}
                placeholder="Enter program name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization-name">Organization Name</Label>
              <Input
                id="organization-name"
                value={feedingForm.organizationName}
                onChange={(e) => setFeedingForm({ ...feedingForm, organizationName: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number-of-meals">Number of Meals</Label>
              <Input
                id="number-of-meals"
                type="number"
                min="0"
                value={feedingForm.numberOfMeals}
                onChange={(e) =>
                  setFeedingForm({ ...feedingForm, numberOfMeals: Number.parseInt(e.target.value) || 0 })
                }
                placeholder="Enter number of meals"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kind-staff">Staff Details</Label>
              <Textarea
                id="kind-staff"
                value={feedingForm.kindStaff}
                onChange={(e) => setFeedingForm({ ...feedingForm, kindStaff: e.target.value })}
                placeholder="Enter staff details"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedingModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFeeding}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
