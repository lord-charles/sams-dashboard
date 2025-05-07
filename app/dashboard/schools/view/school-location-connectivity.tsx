"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  MapPin,
  Radio,
  Signal,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Pencil,
  Building,
  Home,
  ShoppingBag,
  SchoolIcon,
  Tent,
} from "lucide-react"
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
import axios from "axios"
import { base_url } from "@/app/utils/baseUrl"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const LocationMap = dynamic(() => import("./maps"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
      <div className="text-slate-500 dark:text-slate-400 flex flex-col items-center">
        <MapPin className="h-8 w-8 mb-2 animate-pulse" />
        <p>Loading map...</p>
      </div>
    </div>
  ),
})

interface SchoolLocationConnectivityProps {
  schoolInfo: any
}

export function SchoolLocationConnectivity({ schoolInfo }: SchoolLocationConnectivityProps) {
  // Initialize with schoolInfo location and connectivity if they exist, otherwise create empty objects
  const initialData = {
    location: schoolInfo?.location || {
      gpsLng: null,
      gpsLat: null,
      gpsElev: null,
      distanceToNearestVillage: null,
      distanceToNearestSchool: null,
      distanceToBank: null,
      distanceToMarket: null,
      distanceToCamp: null,
    },
    radioCoverage: schoolInfo?.radioCoverage || {
      stations: [],
    },
    cellphoneCoverage: schoolInfo?.cellphoneCoverage || {
      vivacel: false,
      mtn: false,
      zain: false,
      gemtel: false,
      digitel: false,
      other: false,
    },
  }

  const [locationData, setLocationData] = useState(initialData)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("location")
  const [showRadioStationModal, setShowRadioStationModal] = useState(false)
  const [editingStationIndex, setEditingStationIndex] = useState<number | null>(null)
  const [radioStationForm, setRadioStationForm] = useState({
    name: "",
    isActive: true,
  })

  // Check if coordinates are available for the map
  const hasCoordinates = !!(locationData.location.gpsLat && locationData.location.gpsLng)

  // Reset radio station form
  const resetRadioStationForm = () => {
    setRadioStationForm({
      name: "",
      isActive: true,
    })
    setEditingStationIndex(null)
  }

  // Open edit modal for a radio station
  const openEditRadioStationModal = (index: number) => {
    const station = locationData.radioCoverage.stations[index]
    setRadioStationForm({
      name: station.name || "",
      isActive: station.isActive,
    })
    setEditingStationIndex(index)
    setShowRadioStationModal(true)
  }

  // Add or update radio station
  const handleSaveRadioStation = () => {
    if (!radioStationForm.name.trim()) {
      setError("Station name cannot be empty")
      return
    }

    const updatedData = { ...locationData }
    const newStation = { ...radioStationForm }

    if (editingStationIndex !== null) {
      // Update existing station
      updatedData.radioCoverage.stations[editingStationIndex] = newStation
    } else {
      // Add new station
      updatedData.radioCoverage.stations.push(newStation)
    }

    setLocationData(updatedData)
    setShowRadioStationModal(false)
    resetRadioStationForm()
    setError(null)
  }

  // Delete radio station
  const deleteRadioStation = (index: number) => {
    const updatedData = { ...locationData }
    updatedData.radioCoverage.stations.splice(index, 1)
    setLocationData(updatedData)
  }

  // Handle location input change
  const handleLocationChange = (field: string, value: any) => {
    let parsedValue = value

    // Convert to number if the field expects a number
    if (
      [
        "gpsLng",
        "gpsLat",
        "gpsElev",
        "distanceToNearestVillage",
        "distanceToNearestSchool",
        "distanceToBank",
        "distanceToMarket",
        "distanceToCamp",
      ].includes(field)
    ) {
      parsedValue = value === "" ? null : Number(value)
    }

    setLocationData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: parsedValue,
      },
    }))
  }

  // Handle cellphone coverage change
  const handleCellphoneCoverageChange = (provider: string, value: boolean) => {
    setLocationData((prev) => ({
      ...prev,
      cellphoneCoverage: {
        ...prev.cellphoneCoverage,
        [provider]: value,
      },
    }))
  }

  // Save changes to the server
  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Prepare the payload
      const payload = {
        location: locationData.location,
        radioCoverage: locationData.radioCoverage,
        cellphoneCoverage: locationData.cellphoneCoverage,
      }

      const res = await axios.patch(`${base_url}school-data/school/${schoolInfo._id}`, payload)

      if (!res.data) throw new Error("Failed to update school location and connectivity")

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
    setLocationData(initialData) // Revert to original data
    setIsEditing(false)
    setError(null)
  }

  // Render location section
  const renderLocation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">GPS Coordinates</CardTitle>
            <CardDescription>Geographic location of the school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gps-lat">Latitude</Label>
                  {isEditing ? (
                    <Input
                      id="gps-lat"
                      type="number"
                      step="any"
                      value={locationData.location.gpsLat === null || locationData.location.gpsLat === undefined ? "" : locationData.location.gpsLat}
                      onChange={(e) => handleLocationChange("gpsLat", e.target.value)}
                      placeholder="Enter latitude"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                      {locationData.location.gpsLat !== null && locationData.location.gpsLat !== undefined
                        ? Number(locationData.location.gpsLat).toFixed(6)
                        : "Not set"}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gps-lng">Longitude</Label>
                  {isEditing ? (
                    <Input
                      id="gps-lng"
                      type="number"
                      step="any"
                      value={locationData.location.gpsLng === null || locationData.location.gpsLng === undefined ? "" : locationData.location.gpsLng}
                      onChange={(e) => handleLocationChange("gpsLng", e.target.value)}
                      placeholder="Enter longitude"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                      {locationData.location.gpsLng !== null && locationData.location.gpsLng !== undefined
                        ? Number(locationData.location.gpsLng).toFixed(6)
                        : "Not set"}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gps-elev">Elevation (meters)</Label>
                {isEditing ? (
                  <Input
                    id="gps-elev"
                    type="number"
                    step="any"
                    value={locationData.location.gpsElev === null || locationData.location.gpsElev === undefined ? "" : locationData.location.gpsElev}
                    onChange={(e) => handleLocationChange("gpsElev", e.target.value)}
                    placeholder="Enter elevation"
                  />
                ) : (
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                    {locationData.location.gpsElev !== null && locationData.location.gpsElev !== undefined
                      ? `${Number(locationData.location.gpsElev).toFixed(1)} m`
                      : "Not set"}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Distances (km)</CardTitle>
            <CardDescription>Distance to key locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="distance-village">Nearest Village</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      id="distance-village"
                      type="number"
                      step="0.1"
                      min="0"
                      value={locationData.location.distanceToNearestVillage === null || locationData.location.distanceToNearestVillage === undefined ? "" : locationData.location.distanceToNearestVillage}
                      onChange={(e) => handleLocationChange("distanceToNearestVillage", e.target.value)}
                      placeholder="Enter distance in km"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                      {locationData.location.distanceToNearestVillage !== null && locationData.location.distanceToNearestVillage !== undefined
                        ? `${Number(locationData.location.distanceToNearestVillage).toFixed(1)} km`
                        : "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <SchoolIcon className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="distance-school">Nearest School</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      id="distance-school"
                      type="number"
                      step="0.1"
                      min="0"
                      value={locationData.location.distanceToNearestSchool === null || locationData.location.distanceToNearestSchool === undefined ? "" : locationData.location.distanceToNearestSchool}
                      onChange={(e) => handleLocationChange("distanceToNearestSchool", e.target.value)}
                      placeholder="Enter distance in km"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                      {locationData.location.distanceToNearestSchool !== null && locationData.location.distanceToNearestSchool !== undefined
                        ? `${Number(locationData.location.distanceToNearestSchool).toFixed(1)} km`
                        : "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="distance-bank">Nearest Bank</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      id="distance-bank"
                      type="number"
                      step="0.1"
                      min="0"
                      value={locationData.location.distanceToBank === null || locationData.location.distanceToBank === undefined ? "" : locationData.location.distanceToBank}
                      onChange={(e) => handleLocationChange("distanceToBank", e.target.value)}
                      placeholder="Enter distance in km"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                      {locationData.location.distanceToBank !== null && locationData.location.distanceToBank !== undefined
                        ? `${Number(locationData.location.distanceToBank).toFixed(1)} km`
                        : "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="distance-market">Nearest Market</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      id="distance-market"
                      type="number"
                      step="0.1"
                      min="0"
                      value={locationData.location.distanceToMarket === null || locationData.location.distanceToMarket === undefined ? "" : locationData.location.distanceToMarket}
                      onChange={(e) => handleLocationChange("distanceToMarket", e.target.value)}
                      placeholder="Enter distance in km"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                      {locationData.location.distanceToMarket !== null && locationData.location.distanceToMarket !== undefined
                        ? `${Number(locationData.location.distanceToMarket).toFixed(1)} km`
                        : "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tent className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="distance-camp">Nearest Camp</Label>
                  </div>
                  {isEditing ? (
                    <Input
                      id="distance-camp"
                      type="number"
                      step="0.1"
                      min="0"
                      value={locationData.location.distanceToCamp === null || locationData.location.distanceToCamp === undefined ? "" : locationData.location.distanceToCamp}
                      onChange={(e) => handleLocationChange("distanceToCamp", e.target.value)}
                      placeholder="Enter distance in km"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                      {locationData.location.distanceToCamp !== null && locationData.location.distanceToCamp !== undefined
                        ? `${Number(locationData.location.distanceToCamp).toFixed(1)} km`
                        : "Not set"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Map View</CardTitle>
          <CardDescription>Visual representation of the school location</CardDescription>
        </CardHeader>
        <CardContent>
          {hasCoordinates ? (
            <LocationMap
              gpsLat={locationData.location.gpsLat}
              gpsLng={locationData.location.gpsLng}
              schoolName={schoolInfo.schoolName || "School Location"}
            />
          ) : (
            <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
              <div className="text-slate-500 dark:text-slate-400 flex flex-col items-center">
                <MapPin className="h-8 w-8 mb-2" />
                <p className="text-center max-w-md px-4">
                  {isEditing
                    ? "Enter latitude and longitude coordinates to display the map"
                    : "No coordinates available. Edit location to add coordinates."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Render radio coverage section
  const renderRadioCoverage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base">Radio Stations</CardTitle>
              <CardDescription>Available radio stations in the area</CardDescription>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetRadioStationForm()
                  setShowRadioStationModal(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Station
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {locationData.radioCoverage.stations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locationData.radioCoverage.stations.map((station: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Radio className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <Badge
                        variant={station.isActive ? "default" : "outline"}
                        className={station.isActive ? "bg-green-100 text-green-800 hover:bg-green-100 mt-1" : "mt-1"}
                      >
                        {station.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditRadioStationModal(index)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteRadioStation(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Radio className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No radio stations available</p>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    resetRadioStationForm()
                    setShowRadioStationModal(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Station
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Render cellphone coverage section
  const renderCellphoneCoverage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cellphone Network Coverage</CardTitle>
          <CardDescription>Available mobile network providers in the area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
              <div className="flex items-center gap-3">
                <Signal className="h-4 w-4 text-slate-500" />
                <p className="font-medium">Vivacel</p>
              </div>
              {isEditing ? (
                <Switch
                  checked={locationData.cellphoneCoverage.vivacel}
                  onCheckedChange={(checked) => handleCellphoneCoverageChange("vivacel", checked)}
                />
              ) : (
                <Badge
                  variant={locationData.cellphoneCoverage.vivacel ? "default" : "outline"}
                  className={
                    locationData.cellphoneCoverage.vivacel ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                  }
                >
                  {locationData.cellphoneCoverage.vivacel ? "Available" : "Unavailable"}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
              <div className="flex items-center gap-3">
                <Signal className="h-4 w-4 text-slate-500" />
                <p className="font-medium">MTN</p>
              </div>
              {isEditing ? (
                <Switch
                  checked={locationData.cellphoneCoverage.mtn}
                  onCheckedChange={(checked) => handleCellphoneCoverageChange("mtn", checked)}
                />
              ) : (
                <Badge
                  variant={locationData.cellphoneCoverage.mtn ? "default" : "outline"}
                  className={locationData.cellphoneCoverage.mtn ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                >
                  {locationData.cellphoneCoverage.mtn ? "Available" : "Unavailable"}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
              <div className="flex items-center gap-3">
                <Signal className="h-4 w-4 text-slate-500" />
                <p className="font-medium">Zain</p>
              </div>
              {isEditing ? (
                <Switch
                  checked={locationData.cellphoneCoverage.zain}
                  onCheckedChange={(checked) => handleCellphoneCoverageChange("zain", checked)}
                />
              ) : (
                <Badge
                  variant={locationData.cellphoneCoverage.zain ? "default" : "outline"}
                  className={
                    locationData.cellphoneCoverage.zain ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                  }
                >
                  {locationData.cellphoneCoverage.zain ? "Available" : "Unavailable"}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
              <div className="flex items-center gap-3">
                <Signal className="h-4 w-4 text-slate-500" />
                <p className="font-medium">Gemtel</p>
              </div>
              {isEditing ? (
                <Switch
                  checked={locationData.cellphoneCoverage.gemtel}
                  onCheckedChange={(checked) => handleCellphoneCoverageChange("gemtel", checked)}
                />
              ) : (
                <Badge
                  variant={locationData.cellphoneCoverage.gemtel ? "default" : "outline"}
                  className={
                    locationData.cellphoneCoverage.gemtel ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                  }
                >
                  {locationData.cellphoneCoverage.gemtel ? "Available" : "Unavailable"}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
              <div className="flex items-center gap-3">
                <Signal className="h-4 w-4 text-slate-500" />
                <p className="font-medium">Digitel</p>
              </div>
              {isEditing ? (
                <Switch
                  checked={locationData.cellphoneCoverage.digitel}
                  onCheckedChange={(checked) => handleCellphoneCoverageChange("digitel", checked)}
                />
              ) : (
                <Badge
                  variant={locationData.cellphoneCoverage.digitel ? "default" : "outline"}
                  className={
                    locationData.cellphoneCoverage.digitel ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                  }
                >
                  {locationData.cellphoneCoverage.digitel ? "Available" : "Unavailable"}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
              <div className="flex items-center gap-3">
                <Signal className="h-4 w-4 text-slate-500" />
                <p className="font-medium">Other Providers</p>
              </div>
              {isEditing ? (
                <Switch
                  checked={locationData.cellphoneCoverage.other}
                  onCheckedChange={(checked) => handleCellphoneCoverageChange("other", checked)}
                />
              ) : (
                <Badge
                  variant={locationData.cellphoneCoverage.other ? "default" : "outline"}
                  className={
                    locationData.cellphoneCoverage.other ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                  }
                >
                  {locationData.cellphoneCoverage.other ? "Available" : "Unavailable"}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle className="text-lg">Location & Connectivity</CardTitle>
          </div>
          {!isEditing && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="ml-auto">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Information
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit location and connectivity information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription>Geographic location and communication coverage details</CardDescription>
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
            <AlertDescription>Location and connectivity information updated successfully!</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-10 bg-slate-100 dark:bg-slate-900 p-1 rounded-md mb-6">
            <TabsTrigger
              value="location"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              Location
            </TabsTrigger>
            <TabsTrigger
              value="radio"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              Radio Coverage
            </TabsTrigger>
            <TabsTrigger
              value="cellphone"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              Cellphone Coverage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="mt-0">
            {renderLocation()}
          </TabsContent>

          <TabsContent value="radio" className="mt-0">
            {renderRadioCoverage()}
          </TabsContent>

          <TabsContent value="cellphone" className="mt-0">
            {renderCellphoneCoverage()}
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

      {/* Radio Station Modal */}
      <Dialog open={showRadioStationModal} onOpenChange={setShowRadioStationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingStationIndex !== null ? "Edit Radio Station" : "Add Radio Station"}</DialogTitle>
            <DialogDescription>Enter the details for the radio station. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="station-name">Station Name</Label>
              <Input
                id="station-name"
                value={radioStationForm.name}
                onChange={(e) => setRadioStationForm({ ...radioStationForm, name: e.target.value })}
                placeholder="Enter station name"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="station-active"
                checked={radioStationForm.isActive}
                onCheckedChange={(checked) => setRadioStationForm({ ...radioStationForm, isActive: checked })}
              />
              <Label htmlFor="station-active">Station is active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRadioStationModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRadioStation}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
