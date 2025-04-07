"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Percent, Calendar, MessageSquare, User, School, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { base_url } from "@/app/utils/baseUrl"
import axios from "axios"

interface EnrollmentCompleteModalProps {
  isOpen: boolean
  onClose: () => void
  schoolId: string
  session: any
  schoolInfo: {
    isEnrollmentComplete?: Array<{
      year: number
      isComplete: boolean
      completedBy: string
      comments: string
      percentageComplete: number
      learnerEnrollmentComplete: boolean
      _id: string
    }>
  }
}

export function EnrollmentCompleteModal({
  isOpen,
  onClose,
  schoolId,
  session,
  schoolInfo,
}: EnrollmentCompleteModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const currentYear = new Date().getFullYear()

  // Initialize form data with current enrollment data if available for current year
  const getCurrentEnrollmentData = () => {
    const currentYearData = schoolInfo?.isEnrollmentComplete?.find((item) => item.year === currentYear)

    if (currentYearData) {
      return {
        completedBy: `${session?.user?.name || ""} (${session?.user?.email || session?.user?.username || ""})`,
        year: currentYear,
        comments: currentYearData.comments,
        percentageComplete: currentYearData.percentageComplete,
        isComplete: currentYearData.isComplete,
        learnerEnrollmentComplete: currentYearData.learnerEnrollmentComplete,
        _id: currentYearData._id,
      }
    }

    return {
      completedBy: `${session?.user?.name || ""} (${session?.user?.email || session?.user?.username || ""})`,
      year: currentYear,
      comments: "",
      percentageComplete: 0,
      isComplete: false,
      learnerEnrollmentComplete: false,
    }
  }

  const [formData, setFormData] = useState(getCurrentEnrollmentData())

  // Update form data when session changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      completedBy: `${session?.user?.name || ""} (${session?.user?.email || session?.user?.username || ""})`,
    }))
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      percentageComplete: value[0],
      isComplete: value[0] === 100,
      learnerEnrollmentComplete: value[0] === 100,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => {
      // If turning on and progress is 0%, set to 1%
      const newPercentage = checked && prev.percentageComplete === 0 ? 1 : prev.percentageComplete

      // Show toast notification when turning on
      if (checked) {
        toast({
          title: "Action Required",
          description: "Please adjust the progress bar to estimate the actual enrollment progress percentage.",
          variant: "default",
          duration: 10000,
        })
      }

      return {
        ...prev,
        isComplete: checked,
        percentageComplete: newPercentage,
        // No longer affects learnerEnrollmentComplete
      }
    })
  }

  const handleLearnerEnrollmentCompleteChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      learnerEnrollmentComplete: checked,
      isComplete: checked,
      percentageComplete: checked ? 100 : 0,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!session) {
        throw new Error("User not authenticated")
      }
      if (!formData.completedBy || !formData.year || !formData.comments) {
        throw new Error("All fields are required! Please add comments.")
      }

      const response = await axios.post(`${base_url}school-data/${schoolId}/enrollment/complete`, formData)

      toast({
        title: "Success",
        description: "Enrollment status updated successfully",
        variant: "success" as "default",
      })

      router.refresh()
      onClose()
    } catch (error: any) {
      console.error("Error updating enrollment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to mark enrollment as complete",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="bg-slate-50 p-6 border-b">
          <DialogTitle className="text-xl flex items-center gap-2">
            <School className="h-5 w-5" />
            School Enrollment Status
          </DialogTitle>
          <DialogDescription>Update enrollment completion status for the academic year {currentYear}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Enrollment Progress Card */}
            <Card className="border-none shadow-none bg-slate-50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Percent className="h-4 w-4" />
                      Enrollment Progress
                    </span>
                    <Badge
                      variant={formData.isComplete ? "default" : "outline"}
                      className={formData.isComplete ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {formData.learnerEnrollmentComplete ? "Complete" : "In Progress"}
                    </Badge>
                  </div>
                  <Progress
                    value={formData.percentageComplete}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium">{formData.percentageComplete}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {/* User Info */}
              <div className="space-y-2">
                <Label htmlFor="completedBy" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Completed By
                </Label>
                <Input
                  id="completedBy"
                  name="completedBy"
                  value={formData.completedBy}
                  onChange={handleChange}
                  disabled
                  className="bg-slate-50"
                />
                <p className="text-xs text-muted-foreground">Logged in user</p>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Academic Year
                </Label>
                <Input id="year" name="year" value={formData.year} disabled className="bg-slate-50" />
                <p className="text-xs text-muted-foreground">Current year is automatically selected</p>
              </div>
            </div>

            <Separator />

            {/* Enrollment Percentage Slider */}
            <div className="space-y-3">
              <Label htmlFor="percentageComplete" className="flex items-center gap-1">
                <Percent className="h-4 w-4" />
                School Enrollment Percentage
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="percentageComplete"
                  value={[formData.percentageComplete]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{formData.percentageComplete}%</span>
              </div>
            </div>

            {/* Enrollment Status Switches */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="isComplete" className="flex items-center gap-1">
                  <School className="h-4 w-4" />
                  School Enrollment Started
                </Label>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md">
                  <span
                    className={`text-sm ${formData.isComplete ? "text-green-600 font-medium" : "text-muted-foreground"}`}
                  >
                    {formData.isComplete ? "Started" : "Not Started"}
                  </span>
                  <Switch id="isComplete" checked={formData.isComplete} onCheckedChange={handleSwitchChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="learnerEnrollmentComplete" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Learner Enrollment Complete
                </Label>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md">
                  <span
                    className={`text-sm ${formData.learnerEnrollmentComplete ? "text-green-600 font-medium" : "text-muted-foreground"}`}
                  >
                    {formData.learnerEnrollmentComplete ? "Completed" : "Not completed"}
                  </span>
                  <Switch
                    id="learnerEnrollmentComplete"
                    checked={formData.learnerEnrollmentComplete}
                    onCheckedChange={handleLearnerEnrollmentCompleteChange}
                  />
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Comments
              </Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Add any additional comments about the enrollment status"
                rows={3}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                Required field - please provide details about the enrollment status
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

