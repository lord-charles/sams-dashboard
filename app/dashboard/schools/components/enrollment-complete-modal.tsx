"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
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
      _id: string
    }>
  }
}

export function EnrollmentCompleteModal({ isOpen, onClose, schoolId, session, schoolInfo }: EnrollmentCompleteModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const currentYear = new Date().getFullYear()
  
  // Initialize form data with current enrollment data if available for current year
  const getCurrentEnrollmentData = () => {
    const currentYearData = schoolInfo?.isEnrollmentComplete?.find(
      (item) => item.year === currentYear
    );

    if (currentYearData) {
      return {
        completedBy: `${session?.user?.name || ''} (${session?.user?.email || session?.user?.username || ''})`,
        year: currentYear,
        comments: currentYearData.comments,
        percentageComplete: currentYearData.percentageComplete,
        isComplete: currentYearData.isComplete,
      }
    }

    return {
      completedBy: `${session?.user?.name || ''} (${session?.user?.email || session?.user?.username || ''})`,
      year: currentYear,
      comments: "",
      percentageComplete: 0,
      isComplete: false,
    }
  }

  const [formData, setFormData] = useState(getCurrentEnrollmentData())

  // Update form data when session changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      completedBy: `${session?.user?.name || ''} (${session?.user?.email || session?.user?.username || ''})`,
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
      isComplete: value[0] === 100
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isComplete: checked,
      percentageComplete: checked ? 100 : prev.percentageComplete,
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
        throw new Error("All fields are required! ie comments.")
      }
      
      const response = await axios.post(`${base_url}school-data/${schoolId}/enrollment/complete`, formData)
      
      toast({
        title: "Success",
        description: "Enrollment status updated successfully",
        variant: "success" as "default",
      })

      router.refresh()
      onClose()
    } catch (error:any) {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark Enrollment Status</DialogTitle>
          <DialogDescription>Update the enrollment completion status for this school.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="completedBy">Completed By</Label>
              <Input
                id="completedBy"
                name="completedBy"
                value={formData.completedBy}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                disabled
              />
              <p className="text-xs text-muted-foreground">Logged in user</p>

            </div>

            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" value={formData.year} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Current year is automatically selected</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="percentageComplete">Percentage Complete: {formData.percentageComplete}%</Label>
              <Slider
                id="percentageComplete"
                value={[formData.percentageComplete]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleSliderChange}
                className="py-2"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isComplete">Mark as Complete</Label>
                <Switch id="isComplete" checked={formData.isComplete} onCheckedChange={handleSwitchChange} />
                
              </div>
              <p className="text-xs text-muted-foreground">Estimated completion date: {formData.percentageComplete === 100 ? "Completed" : "Not completed"}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Add any additional comments"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Processing...
                </span>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
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
