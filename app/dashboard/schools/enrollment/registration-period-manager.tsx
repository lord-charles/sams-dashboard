"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { base_url } from "@/app/utils/baseUrl"
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";


type RegistrationPeriod = {
  _id: string
  startDate: string
  endDate: string
  isOpen: boolean
  createdBy?: string
  updatedBy?: string
  deletedBy?: string | null
  createdAt?: string
  updatedAt?: string
}

export default function RegistrationPeriodManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [registrationPeriod, setRegistrationPeriod] = useState<RegistrationPeriod | null>(null)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    isOpen: false,
  })
  const { data: session, status } = useSession();

  const { toast } = useToast();
  const [username] = useState(status === "authenticated" && session?.user?.username ? session?.user?.username : "unknown")

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP")
    } catch (error) {
      return dateString
    }
  }

  // Format date for input field
  const formatDateForInput = (dateString: string) => {
    try {
      return format(parseISO(dateString), "yyyy-MM-dd")
    } catch (error) {
      return ""
    }
  }

  // Check if registration is currently active
  const isRegistrationActive = () => {
    if (!registrationPeriod) return false

    const now = new Date()
    const start = new Date(registrationPeriod.startDate)
    const end = new Date(registrationPeriod.endDate)

    return now >= start && now <= end && registrationPeriod.isOpen
  }

  // Get registration period status text
  const getStatusText = () => {
    if (!registrationPeriod) return "Unknown"

    if (!registrationPeriod.isOpen) return "Closed"

    const now = new Date()
    const start = new Date(registrationPeriod.startDate)
    const end = new Date(registrationPeriod.endDate)

    if (now < start) return "Not Started Yet"
    if (now > end) return "Ended"
    return "Open"
  }


  // Fetch current registration period
  const fetchRegistrationPeriod = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${base_url}registration-period/current`)
      if (!response.ok) {
        throw new Error("Failed to fetch registration period")
      }
      const data = await response.json()
      if (data.success) {
        setRegistrationPeriod(data.data)
        setFormData({
          startDate: formatDateForInput(data.data.startDate),
          endDate: formatDateForInput(data.data.endDate),
          isOpen: data.data.isOpen,
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch registration period",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching registration period:", error)
      toast({
        title: "Error",
        description: "Failed to fetch registration period",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update registration period
  const updateRegistrationPeriod = async () => {
    if (!registrationPeriod) return

    setUpdating(true)
    try {
      const response = await fetch(
        `${base_url}registration-period/update/${registrationPeriod._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: formData.startDate,
            endDate: formData.endDate,
            isOpen: formData.isOpen,
            username,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update registration period")
      }

      const data = await response.json()
      if (data.success) {
        setRegistrationPeriod(data.data)
        toast({
          title: "Success",
          description: "Registration period updated successfully",
        })
        setIsOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update registration period",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating registration period:", error)
      toast({
        title: "Error",
        description: "Failed to update registration period",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Deactivate registration period
  const deactivateRegistrationPeriod = async () => {
    if (!registrationPeriod) return

    setUpdating(true)
    try {
      const response = await fetch(
        `${base_url}registration-period/period/${registrationPeriod._id}?username=${username}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        throw new Error("Failed to deactivate registration period")
      }

      const data = await response.json()
      if (data.success) {
        // Update local state to reflect the change
        setRegistrationPeriod({
          ...registrationPeriod,
          isOpen: false,
          deletedBy: username,
        })

        toast({
          title: "Success",
          description: "Registration period deactivated successfully",
        })
        setIsOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to deactivate registration period",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deactivating registration period:", error)
      toast({
        title: "Error",
        description: "Failed to deactivate registration period",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Reactivate registration period
  const reactivateRegistrationPeriod = async () => {
    if (!registrationPeriod) return

    setUpdating(true)
    try {
      const response = await fetch(
        `${base_url}registration-period/period/${registrationPeriod._id}/restore`,
        {
          method: "PATCH",
        },
      )

      if (!response.ok) {
        throw new Error("Failed to reactivate registration period")
      }

      const data = await response.json()
      if (data.success) {
        // Update local state to reflect the change
        setRegistrationPeriod({
          ...registrationPeriod,
          isOpen: true,
          deletedBy: null,
        })

        toast({
          title: "Success",
          description: "Registration period reactivated successfully",
        })
        setIsOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reactivate registration period",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error reactivating registration period:", error)
      toast({
        title: "Error",
        description: "Failed to reactivate registration period",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Load registration period on component mount
  useEffect(() => {
    fetchRegistrationPeriod()
  }, [])

  return (
    <div className="space-y-4">
      {/* Registration Period Button */}
      <Card className="overflow-hidden">
        <Button
          className="w-full h-full p-0 border-0 shadow-none hover:bg-transparent"
          variant="ghost"
          onClick={() => {
            status === "authenticated" &&
              session?.user?.userType === "SuperAdmin"
              ? setIsOpen(true)
              : toast({
                title: "Error",
                description:
                  "You do not have permission to edit registration period",
                variant: "destructive",
              });
          }}
        >
          <div className="w-full flex flex-col">
            {/* Header with status */}
            <div className="bg-primary/10 w-full p-0.5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium text-xs">Registration Period</span>
              </div>
              {registrationPeriod && (
                <span className="ml-1 text-xs">
                  ({Math.min(
                    100,
                    Math.max(
                      0,
                      Math.round(
                        ((new Date().getTime() - new Date(registrationPeriod.startDate).getTime()) /
                          (new Date(registrationPeriod.endDate).getTime() -
                            new Date(registrationPeriod.startDate).getTime())) *
                        100,
                      ),
                    ),
                  )}
                  % done)
                </span>)}
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <Badge variant={isRegistrationActive() ? "default" : "outline"} className="ml-auto h-4 ">
                  <span className="text-[10px]">
                    {getStatusText()}
                  </span>
                </Badge>
              )}

            </div>
            {/* Progress indicator */}
            {isRegistrationActive() && (
              <div className="mt-0">
                <div className="flex justify-between text-xs text-muted-foreground">

                </div>
                <div className="w-full bg-muted rounded-full">
                  <div
                    className="bg-primary h-0.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          Math.round(
                            ((new Date().getTime() - new Date(registrationPeriod?.startDate || '').getTime()) /
                              (new Date(registrationPeriod?.endDate || '').getTime() -
                                new Date(registrationPeriod?.startDate || '').getTime())) *
                            100,
                          ),
                        ),
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Date information */}
            <div className="p-0.5 w-full text-left">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : registrationPeriod ? (
                <div >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-0.5 rounded">
                        <Calendar className="h-2 w-2 text-primary" />
                      </div>
                      <span className="text-xs">
                        From: <span className="font-medium text-xs">{formatDate(registrationPeriod.startDate)}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-0.5 rounded">
                        <Clock className="h-2 w-2 text-primary" />
                      </div>
                      <span className="text-xs">
                        To: <span className="font-medium text-xs">{formatDate(registrationPeriod.endDate)}</span>
                      </span>
                    </div>
                  </div>


                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No registration period available</p>
              )}
            </div>
          </div>

        </Button>

      </Card>

      {/* Registration Period Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registration Period</DialogTitle>
            <DialogDescription>View and manage the current registration period.</DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : registrationPeriod ? (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 py-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge variant={registrationPeriod.isOpen ? "default" : "outline"}>
                          {registrationPeriod.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                        <Badge variant={isRegistrationActive() ? "default" : "outline"}>{getStatusText()}</Badge>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(registrationPeriod.startDate)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">End Date</p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatDate(registrationPeriod.endDate)}
                      </p>
                    </div>

                    {registrationPeriod.createdBy && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Created By</p>
                        <p className="text-sm">{registrationPeriod.createdBy}</p>
                      </div>
                    )}

                    {registrationPeriod.updatedBy && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Last Updated By</p>
                        <p className="text-sm">{registrationPeriod.updatedBy}</p>
                      </div>
                    )}

                    {registrationPeriod.deletedBy && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Deactivated By</p>
                        <p className="text-sm">{registrationPeriod.deletedBy}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  {registrationPeriod.isOpen ? (
                    <Button variant="destructive" onClick={deactivateRegistrationPeriod} disabled={updating}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={reactivateRegistrationPeriod} disabled={updating}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reactivate
                    </Button>
                  )}
                  <Button variant="default" onClick={() => fetchRegistrationPeriod()} disabled={updating}>
                    Refresh
                  </Button>
                </div>
              </TabsContent>

              {/* Edit Tab */}
              <TabsContent value="edit" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isOpen"
                      name="isOpen"
                      checked={formData.isOpen}
                      onCheckedChange={(checked) => setFormData({ ...formData, isOpen: checked })}
                    />
                    <Label htmlFor="isOpen">Registration Open</Label>
                  </div>

                  {new Date(formData.startDate) >= new Date(formData.endDate) && (
                    <Alert variant="destructive">
                      <AlertDescription>Start date must be before end date</AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpen(false)} disabled={updating}>
                    Cancel
                  </Button>
                  <Button
                    onClick={updateRegistrationPeriod}
                    disabled={
                      updating ||
                      new Date(formData.startDate) >= new Date(formData.endDate) ||
                      !formData.startDate ||
                      !formData.endDate
                    }
                  >
                    {updating ? "Updating..." : "Update"}
                  </Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">No registration period found.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
