"use client"

import { useState } from "react"
import { Building, Edit, Save, Droplet, Wifi, Lightbulb, Book, PlayCircle, Utensils, AlertTriangle, CheckCircle, Computer, School, TableIcon as Toilet, FlaskRoundIcon as Flask, Users, Plus, Trash2, X, Calendar, Pencil } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import { base_url } from "@/app/utils/baseUrl"

interface SchoolFacilitiesProps {
  schoolInfo: any
}

// Defensive normalization function
function normalizeFacilities(facilities: any) {
  if (!facilities || !facilities.building) return {
    building: {
      hasBuilding: false,
      classrooms: {
        permanent: [],
        semiPermanent: [],
        outdoor: [],
        underTree: [],
      },
      latrines: [],
      library: [],
      kitchen: [],
      hasCleanWater: false,
      hasInternet: false,
      numberOfComputers: 0,
      hasElectricity: false,
      hasLibrary: false,
      hasKitchen: false,
      hasPlayground: false,
      learningMaterials: [],
      laboratory: [],
      staffRoom: [],
      playgroundCondition: "Good",
      hasSportsFacilities: false,
      sportsFacilitiesDetails: "",
      additionalFacilities: [],
    },
    lastVisited: [],
  };
  const building = facilities.building;
  return {
    ...facilities,
    building: {
      ...building,
      kitchen: Array.isArray(building.kitchen) ? building.kitchen : [],
      hasKitchen: typeof building.hasKitchen === 'boolean' ? building.hasKitchen : false,
      classrooms: {
        permanent: Array.isArray(building.classrooms?.permanent) ? building.classrooms.permanent : [],
        semiPermanent: Array.isArray(building.classrooms?.semiPermanent) ? building.classrooms.semiPermanent : [],
        outdoor: Array.isArray(building.classrooms?.outdoor) ? building.classrooms.outdoor : [],
        underTree: Array.isArray(building.classrooms?.underTree) ? building.classrooms.underTree : [],
      },
      latrines: Array.isArray(building.latrines) ? building.latrines : [],
      library: Array.isArray(building.library) ? building.library : [],
      laboratory: Array.isArray(building.laboratory) ? building.laboratory : [],
      staffRoom: Array.isArray(building.staffRoom) ? building.staffRoom : [],
      // add other arrays as needed
    },
  };
}

export function SchoolFacilities({ schoolInfo }: SchoolFacilitiesProps) {
  const initialFacilities = normalizeFacilities(schoolInfo?.facilities)

  const [facilitiesData, setFacilitiesData] = useState(initialFacilities)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // State for modal forms
  const [showClassroomModal, setShowClassroomModal] = useState(false)
  const [showLatrineModal, setShowLatrineModal] = useState(false)
  const [showLibraryModal, setShowLibraryModal] = useState(false)
  const [showKitchenModal, setShowKitchenModal] = useState(false)
  const [showLaboratoryModal, setShowLaboratoryModal] = useState(false)
  const [showStaffRoomModal, setShowStaffRoomModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingType, setEditingType] = useState<string | null>(null)

  // Form states for different facility types
  const [classroomForm, setClassroomForm] = useState({
    classroomType: "Permanent",
    constructionDate: "",
    desk: "Desk",
    boards: "Blackboard",
    chairs: "Chairs",
    capacity: 0,
    condition: "Good",
    accessibility: "Accessible",
  })

  const [latrineForm, setLatrineForm] = useState({
    type: "Pit Latrine",
    condition: "Good",
    constructionDate: "",
    accessibility: "Accessible",
  })

  const [libraryForm, setLibraryForm] = useState({
    hasLibrary: true,
    libraryName: "",
    numberOfBooks: 0,
    libraryStaff: {
      hasLibrarian: false,
      librarianName: "",
      librarianContact: "",
      librarianEmail: "",
    },
    libraryFacilities: {
      hasComputers: false,
      numberOfComputers: 0,
      hasStudyRooms: false,
      numberOfStudyRooms: 0,
      hasInternet: false,
      hasPrinting: false,
    },
    libraryCondition: "Good",
    additionalNotes: "",
  })

  const [kitchenForm, setKitchenForm] = useState({
    hasKitchen: true,
    kitchenType: "Indoor",
    kitchenFacilities: {
      hasCookingStove: false,
      numberOfCookingStoves: 0,
      hasRefrigerator: false,
      numberOfRefrigerators: 0,
      hasSink: false,
      numberOfSinks: 0,
      hasStorage: false,
      storageCapacity: 0,
      hasUtensils: false,
      hasCookingEquipment: false,
      cookingEquipmentDetails: "",
    },
    kitchenCondition: "Good",
    additionalNotes: "",
  })

  const [laboratoryForm, setLaboratoryForm] = useState({
    name: "",
    details: "",
    hasLaboratory: true,
    laboratoryType: "Science Lab",
    laboratoryFacilities: {
      hasComputers: false,
      numberOfComputers: 0,
      hasInternet: false,
      hasPrinting: false,
    },
    laboratoryCondition: "Good",
    equipment: [],
    additionalNotes: "",
  })

  const [staffRoomForm, setStaffRoomForm] = useState({
    name: "",
    details: "",
    condition: "Good",
    hasStaffRoom: true,
    filingCabinets: 0,
    desks: 0,
    chairs: 0,
    shelves: 0,
    computers: 0,
    printers: 0,
    internetAccess: false,
    additionalNotes: "",
  })

  // Handle input change for boolean values (switches)
  const handleSwitchChange = (field: string, value: boolean) => {
    setFacilitiesData((prev: any) => ({
      ...prev,
      building: {
        ...prev.building,
        [field]: value,
      },
    }))
  }

  // Handle input change for text/number values
  const handleInputChange = (field: string, value: any) => {
    setFacilitiesData((prev: any) => ({
      ...prev,
      building: {
        ...prev.building,
        [field]: value,
      },
    }))
  }

  // Reset form states
  const resetForms = () => {
    setClassroomForm({
      classroomType: "Permanent",
      constructionDate: "",
      desk: "Desk",
      boards: "Blackboard",
      chairs: "Chairs",
      capacity: 0,
      condition: "Good",
      accessibility: "Accessible",
    })

    setLatrineForm({
      type: "Pit Latrine",
      condition: "Good",
      constructionDate: "",
      accessibility: "Accessible",
    })

    setLibraryForm({
      hasLibrary: true,
      libraryName: "",
      numberOfBooks: 0,
      libraryStaff: {
        hasLibrarian: false,
        librarianName: "",
        librarianContact: "",
        librarianEmail: "",
      },
      libraryFacilities: {
        hasComputers: false,
        numberOfComputers: 0,
        hasStudyRooms: false,
        numberOfStudyRooms: 0,
        hasInternet: false,
        hasPrinting: false,
      },
      libraryCondition: "Good",
      additionalNotes: "",
    })

    setKitchenForm({
      hasKitchen: true,
      kitchenType: "Indoor",
      kitchenFacilities: {
        hasCookingStove: false,
        numberOfCookingStoves: 0,
        hasRefrigerator: false,
        numberOfRefrigerators: 0,
        hasSink: false,
        numberOfSinks: 0,
        hasStorage: false,
        storageCapacity: 0,
        hasUtensils: false,
        hasCookingEquipment: false,
        cookingEquipmentDetails: "",
      },
      kitchenCondition: "Good",
      additionalNotes: "",
    })

    setLaboratoryForm({
      name: "",
      details: "",
      hasLaboratory: true,
      laboratoryType: "Science Lab",
      laboratoryFacilities: {
        hasComputers: false,
        numberOfComputers: 0,
        hasInternet: false,
        hasPrinting: false,
      },
      laboratoryCondition: "Good",
      equipment: [],
      additionalNotes: "",
    })

    setStaffRoomForm({
      name: "",
      details: "",
      condition: "Good",
      hasStaffRoom: true,
      filingCabinets: 0,
      desks: 0,
      chairs: 0,
      shelves: 0,
      computers: 0,
      printers: 0,
      internetAccess: false,
      additionalNotes: "",
    })

    setEditingIndex(null)
    setEditingType(null)
  }

  // Open edit modal for a specific facility
  const openEditModal = (type: string, index: number) => {
    setEditingIndex(index)
    setEditingType(type)

    switch (type) {
      case "permanent":
      case "semiPermanent":
      case "outdoor":
      case "underTree":
        const classroom = facilitiesData.building.classrooms[type][index]
        setClassroomForm({
          classroomType: classroom.classroomType || "Permanent",
          constructionDate: classroom.constructionDate
            ? new Date(classroom.constructionDate).toISOString().split("T")[0]
            : "",
          desk: classroom.desk || "Desk",
          boards: classroom.boards || "Blackboard",
          chairs: classroom.chairs || "Chairs",
          capacity: classroom.capacity || 0,
          condition: classroom.condition || "Good",
          accessibility: classroom.accessibility || "Accessible",
        })
        setShowClassroomModal(true)
        break

      case "latrines":
        const latrine = facilitiesData.building.latrines[index]
        setLatrineForm({
          type: latrine.type || "Pit Latrine",
          condition: latrine.condition || "Good",
          constructionDate: latrine.constructionDate
            ? new Date(latrine.constructionDate).toISOString().split("T")[0]
            : "",
          accessibility: latrine.accessibility || "Accessible",
        })
        setShowLatrineModal(true)
        break

      case "library":
        const library = facilitiesData.building.library[index]
        setLibraryForm({
          hasLibrary: library.hasLibrary !== undefined ? library.hasLibrary : true,
          libraryName: library.libraryName || "",
          numberOfBooks: library.numberOfBooks || 0,
          libraryStaff: {
            hasLibrarian: library.libraryStaff?.hasLibrarian || false,
            librarianName: library.libraryStaff?.librarianName || "",
            librarianContact: library.libraryStaff?.librarianContact || "",
            librarianEmail: library.libraryStaff?.librarianEmail || "",
          },
          libraryFacilities: {
            hasComputers: library.libraryFacilities?.hasComputers || false,
            numberOfComputers: library.libraryFacilities?.numberOfComputers || 0,
            hasStudyRooms: library.libraryFacilities?.hasStudyRooms || false,
            numberOfStudyRooms: library.libraryFacilities?.numberOfStudyRooms || 0,
            hasInternet: library.libraryFacilities?.hasInternet || false,
            hasPrinting: library.libraryFacilities?.hasPrinting || false,
          },
          libraryCondition: library.libraryCondition || "Good",
          additionalNotes: library.additionalNotes || "",
        })
        setShowLibraryModal(true)
        break

      case "kitchen":
        const kitchen = facilitiesData.building.kitchen[index]
        setKitchenForm({
          hasKitchen: kitchen.hasKitchen !== undefined ? kitchen.hasKitchen : true,
          kitchenType: kitchen.kitchenType || "Indoor",
          kitchenFacilities: {
            hasCookingStove: kitchen.kitchenFacilities?.hasCookingStove || false,
            numberOfCookingStoves: kitchen.kitchenFacilities?.numberOfCookingStoves || 0,
            hasRefrigerator: kitchen.kitchenFacilities?.hasRefrigerator || false,
            numberOfRefrigerators: kitchen.kitchenFacilities?.numberOfRefrigerators || 0,
            hasSink: kitchen.kitchenFacilities?.hasSink || false,
            numberOfSinks: kitchen.kitchenFacilities?.numberOfSinks || 0,
            hasStorage: kitchen.kitchenFacilities?.hasStorage || false,
            storageCapacity: kitchen.kitchenFacilities?.storageCapacity || 0,
            hasUtensils: kitchen.kitchenFacilities?.hasUtensils || false,
            hasCookingEquipment: kitchen.kitchenFacilities?.hasCookingEquipment || false,
            cookingEquipmentDetails: kitchen.kitchenFacilities?.cookingEquipmentDetails || "",
          },
          kitchenCondition: kitchen.kitchenCondition || "Good",
          additionalNotes: kitchen.additionalNotes || "",
        })
        setShowKitchenModal(true)
        break

      case "laboratory":
        const lab = facilitiesData.building.laboratory[index]
        setLaboratoryForm({
          name: lab.name || "",
          details: lab.details || "",
          hasLaboratory: lab.hasLaboratory !== undefined ? lab.hasLaboratory : true,
          laboratoryType: lab.laboratoryType || "Science Lab",
          laboratoryFacilities: {
            hasComputers: lab.laboratoryFacilities?.hasComputers || false,
            numberOfComputers: lab.laboratoryFacilities?.numberOfComputers || 0,
            hasInternet: lab.laboratoryFacilities?.hasInternet || false,
            hasPrinting: lab.laboratoryFacilities?.hasPrinting || false,
          },
          laboratoryCondition: lab.laboratoryCondition || "Good",
          equipment: lab.equipment || [],
          additionalNotes: lab.additionalNotes || "",
        })
        setShowLaboratoryModal(true)
        break

      case "staffRoom":
        const staffRoom = facilitiesData.building.staffRoom[index]
        setStaffRoomForm({
          name: staffRoom.name || "",
          details: staffRoom.details || "",
          condition: staffRoom.condition || "Good",
          hasStaffRoom: staffRoom.hasStaffRoom !== undefined ? staffRoom.hasStaffRoom : true,
          filingCabinets: staffRoom.filingCabinets || 0,
          desks: staffRoom.desks || 0,
          chairs: staffRoom.chairs || 0,
          shelves: staffRoom.shelves || 0,
          computers: staffRoom.computers || 0,
          printers: staffRoom.printers || 0,
          internetAccess: staffRoom.internetAccess || false,
          additionalNotes: staffRoom.additionalNotes || "",
        })
        setShowStaffRoomModal(true)
        break
    }
  }

  // Add or update classroom
  const handleSaveClassroom = () => {
    const updatedData = { ...facilitiesData }
    const classroomType = classroomForm.classroomType.toLowerCase()
    const classroomTypeKey = classroomType === "permanent" ? "permanent" :
      classroomType === "semi-permanent" ? "semiPermanent" :
        classroomType === "outdoor" ? "outdoor" : "underTree"

    const newClassroom = {
      ...classroomForm,
      constructionDate: classroomForm.constructionDate ? new Date(classroomForm.constructionDate) : undefined,
    }

    if (editingIndex !== null && editingType) {
      // Update existing classroom
      updatedData.building.classrooms[editingType][editingIndex] = newClassroom
    } else {
      // Add new classroom
      if (!updatedData.building.classrooms[classroomTypeKey]) {
        updatedData.building.classrooms[classroomTypeKey] = []
      }
      updatedData.building.classrooms[classroomTypeKey].push(newClassroom)
    }

    setFacilitiesData(updatedData)
    setShowClassroomModal(false)
    resetForms()
  }

  // Add or update latrine
  const handleSaveLatrine = () => {
    const updatedData = { ...facilitiesData }
    const newLatrine = {
      ...latrineForm,
      constructionDate: latrineForm.constructionDate ? new Date(latrineForm.constructionDate) : undefined,
    }

    if (editingIndex !== null) {
      // Update existing latrine
      updatedData.building.latrines[editingIndex] = newLatrine
    } else {
      // Add new latrine
      if (!updatedData.building.latrines) {
        updatedData.building.latrines = []
      }
      updatedData.building.latrines.push(newLatrine)
    }

    setFacilitiesData(updatedData)
    setShowLatrineModal(false)
    resetForms()
  }

  // Add or update library
  const handleSaveLibrary = () => {
    const updatedData = { ...facilitiesData }
    const newLibrary = { ...libraryForm }

    if (editingIndex !== null) {
      // Update existing library
      updatedData.building.library[editingIndex] = newLibrary
    } else {
      // Add new library
      if (!updatedData.building.library) {
        updatedData.building.library = []
      }
      updatedData.building.library.push(newLibrary)
    }

    // Also update the hasLibrary flag in the building
    updatedData.building.hasLibrary = true

    setFacilitiesData(updatedData)
    setShowLibraryModal(false)
    resetForms()
  }

  // Add or update kitchen
  const handleSaveKitchen = () => {
    const updatedData = { ...facilitiesData }
    const newKitchen = { ...kitchenForm }

    if (!Array.isArray(updatedData.building.kitchen)) {
      updatedData.building.kitchen = [];
    }

    if (editingIndex !== null) {
      // Update existing kitchen
      updatedData.building.kitchen[editingIndex] = newKitchen
    } else {
      // Add new kitchen
      updatedData.building.kitchen.push(newKitchen)
    }

    // Also update the hasKitchen flag in the building
    updatedData.building.hasKitchen = true

    setFacilitiesData(updatedData)
    setShowKitchenModal(false)
    resetForms()
  }

  // Add or update laboratory
  const handleSaveLaboratory = () => {
    const updatedData = { ...facilitiesData }
    const newLaboratory = { ...laboratoryForm }

    if (editingIndex !== null) {
      // Update existing laboratory
      updatedData.building.laboratory[editingIndex] = newLaboratory
    } else {
      // Add new laboratory
      if (!updatedData.building.laboratory) {
        updatedData.building.laboratory = []
      }
      updatedData.building.laboratory.push(newLaboratory)
    }

    setFacilitiesData(updatedData)
    setShowLaboratoryModal(false)
    resetForms()
  }

  // Add or update staff room
  const handleSaveStaffRoom = () => {
    const updatedData = { ...facilitiesData }
    const newStaffRoom = { ...staffRoomForm }

    if (editingIndex !== null) {
      // Update existing staff room
      updatedData.building.staffRoom[editingIndex] = newStaffRoom
    } else {
      // Add new staff room
      if (!updatedData.building.staffRoom) {
        updatedData.building.staffRoom = []
      }
      updatedData.building.staffRoom.push(newStaffRoom)
    }

    setFacilitiesData(updatedData)
    setShowStaffRoomModal(false)
    resetForms()
  }

  // Delete facility
  const deleteFacility = (type: string, index: number) => {
    const updatedData = { ...facilitiesData }

    switch (type) {
      case "permanent":
      case "semiPermanent":
      case "outdoor":
      case "underTree":
        updatedData.building.classrooms[type].splice(index, 1)
        break
      case "latrines":
        updatedData.building.latrines.splice(index, 1)
        break
      case "library":
        updatedData.building.library.splice(index, 1)
        if (updatedData.building.library.length === 0) {
          updatedData.building.hasLibrary = false
        }
        break
      case "kitchen":
        updatedData.building.kitchen.splice(index, 1)
        if (updatedData.building.kitchen.length === 0) {
          updatedData.building.hasKitchen = false
        }
        break
      case "laboratory":
        updatedData.building.laboratory.splice(index, 1)
        break
      case "staffRoom":
        updatedData.building.staffRoom.splice(index, 1)
        break
    }

    setFacilitiesData(updatedData)
  }

  // Save changes to the server
  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Prepare the payload with the schoolFacilities field
      const payload = {
        facilities: facilitiesData
      }
      console.log(payload)
      const res = await axios.patch(`${base_url}school-data/school/${schoolInfo._id}`, payload)
      console.log(res.data)
      if (!res.data) throw new Error("Failed to update school facilities")

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
    setFacilitiesData(initialFacilities) // Revert to original data
    setIsEditing(false)
    setError(null)
  }

  // Get the count of available facilities
  const getFacilitiesCount = () => {
    let count = 0
    const building = facilitiesData.building

    if (building.hasBuilding) count++
    if (building.hasCleanWater) count++
    if (building.hasInternet) count++
    if (building.hasElectricity) count++
    if (building.hasLibrary) count++
    if (building.hasPlayground) count++
    if (building.hasSportsFacilities) count++
    if (building.kitchen) count++
    if (building.classrooms?.permanent?.length > 0) count++
    if (building.classrooms?.semiPermanent?.length > 0) count++
    if (building.classrooms?.outdoor?.length > 0) count++
    if (building.classrooms?.underTree?.length > 0) count++
    if (building.latrines?.length > 0) count++
    if (building.laboratory?.length > 0) count++
    if (building.staffRoom?.length > 0) count++

    return count
  }

  const facilitiesCount = getFacilitiesCount()

  // Render status badge
  const renderStatusBadge = (isAvailable: boolean) => (
    <Badge
      variant={isAvailable ? "default" : "outline"}
      className={isAvailable ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
    >
      {isAvailable ? "Yes" : "No"}
    </Badge>
  )

  // Render condition badge
  const renderConditionBadge = (condition: string) => {
    let bgColor = "bg-green-100 text-green-800"
    if (condition === "Needs Repair" || condition === "Fair") {
      bgColor = "bg-yellow-100 text-yellow-800"
    } else if (condition === "Poor") {
      bgColor = "bg-red-100 text-red-800"
    }

    return <Badge className={bgColor}>{condition}</Badge>
  }

  // Render basic facilities section
  const renderBasicFacilities = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <div className="flex-1">
            <Label htmlFor="has-building" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-500" />
              Building
            </Label>
          </div>
          {isEditing ? (
            <Switch
              id="has-building"
              checked={!!facilitiesData.building.hasBuilding}
              onCheckedChange={(checked) => handleSwitchChange("hasBuilding", checked)}
              disabled={loading}
            />
          ) : (
            renderStatusBadge(facilitiesData.building.hasBuilding)
          )}
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <div className="flex-1">
            <Label htmlFor="has-clean-water" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <Droplet className="h-4 w-4 text-slate-500" />
              Clean Water
            </Label>
          </div>
          {isEditing ? (
            <Switch
              id="has-clean-water"
              checked={!!facilitiesData.building.hasCleanWater}
              onCheckedChange={(checked) => handleSwitchChange("hasCleanWater", checked)}
              disabled={loading}
            />
          ) : (
            renderStatusBadge(facilitiesData.building.hasCleanWater)
          )}
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <div className="flex-1">
            <Label htmlFor="has-internet" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <Wifi className="h-4 w-4 text-slate-500" />
              Internet
            </Label>
          </div>
          {isEditing ? (
            <Switch
              id="has-internet"
              checked={!!facilitiesData.building.hasInternet}
              onCheckedChange={(checked) => handleSwitchChange("hasInternet", checked)}
              disabled={loading}
            />
          ) : (
            renderStatusBadge(facilitiesData.building.hasInternet)
          )}
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <div className="flex-1">
            <Label htmlFor="has-electricity" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-slate-500" />
              Electricity
            </Label>
          </div>
          {isEditing ? (
            <Switch
              id="has-electricity"
              checked={!!facilitiesData.building.hasElectricity}
              onCheckedChange={(checked) => handleSwitchChange("hasElectricity", checked)}
              disabled={loading}
            />
          ) : (
            renderStatusBadge(facilitiesData.building.hasElectricity)
          )}
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="classrooms">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-slate-500" />
              <span>Classrooms</span>
              <Badge className="ml-2 bg-slate-200 text-slate-800">
                {(facilitiesData.building.classrooms?.permanent?.length || 0) +
                  (facilitiesData.building.classrooms?.semiPermanent?.length || 0) +
                  (facilitiesData.building.classrooms?.outdoor?.length || 0) +
                  (facilitiesData.building.classrooms?.underTree?.length || 0)}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {/* Permanent Classrooms */}
              {facilitiesData.building.classrooms?.permanent?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Permanent Classrooms</h4>
                  {facilitiesData.building.classrooms.permanent.map((classroom: any, index: number) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">Classroom {index + 1}</span>
                          <Badge className="ml-2">{classroom.condition}</Badge>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditModal("permanent", index)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteFacility("permanent", index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-slate-600">
                        <div>Capacity: {classroom.capacity}</div>
                        <div>Furniture: {classroom.desk}, {classroom.chairs}</div>
                        <div>Board: {classroom.boards}</div>
                        <div>Accessibility: {classroom.accessibility}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Semi-Permanent Classrooms */}
              {facilitiesData.building.classrooms?.semiPermanent?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Semi-Permanent Classrooms</h4>
                  {facilitiesData.building.classrooms.semiPermanent.map((classroom: any, index: number) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">Classroom {index + 1}</span>
                          <Badge className="ml-2">{classroom.condition}</Badge>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditModal("semiPermanent", index)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteFacility("semiPermanent", index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-slate-600">
                        <div>Capacity: {classroom.capacity}</div>
                        <div>Furniture: {classroom.desk}, {classroom.chairs}</div>
                        <div>Board: {classroom.boards}</div>
                        <div>Accessibility: {classroom.accessibility}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Outdoor Classrooms */}
              {facilitiesData.building.classrooms?.outdoor?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Outdoor Classrooms</h4>
                  {facilitiesData.building.classrooms.outdoor.map((classroom: any, index: number) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">Classroom {index + 1}</span>
                          <Badge className="ml-2">{classroom.condition}</Badge>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditModal("outdoor", index)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteFacility("outdoor", index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-slate-600">
                        <div>Capacity: {classroom.capacity}</div>
                        <div>Furniture: {classroom.desk}, {classroom.chairs}</div>
                        <div>Board: {classroom.boards}</div>
                        <div>Accessibility: {classroom.accessibility}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Under Tree Classrooms */}
              {facilitiesData.building.classrooms?.underTree?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Under Tree Classrooms</h4>
                  {facilitiesData.building.classrooms.underTree.map((classroom: any, index: number) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">Classroom {index + 1}</span>
                          <Badge className="ml-2">{classroom.condition}</Badge>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditModal("underTree", index)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteFacility("underTree", index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-slate-600">
                        <div>Capacity: {classroom.capacity}</div>
                        <div>Furniture: {classroom.desk}, {classroom.chairs}</div>
                        <div>Board: {classroom.boards}</div>
                        <div>Accessibility: {classroom.accessibility}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No classrooms message */}
              {!facilitiesData.building.classrooms?.permanent?.length &&
                !facilitiesData.building.classrooms?.semiPermanent?.length &&
                !facilitiesData.building.classrooms?.outdoor?.length &&
                !facilitiesData.building.classrooms?.underTree?.length && (
                  <div className="text-center text-sm text-slate-500 py-2">No classrooms available</div>
                )}

              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    resetForms();
                    setShowClassroomModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Classroom
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="latrines">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Toilet className="h-4 w-4 text-slate-500" />
              <span>Latrines</span>
              <Badge className="ml-2 bg-slate-200 text-slate-800">
                {facilitiesData.building.latrines?.length || 0}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {facilitiesData.building.latrines?.length > 0 ? (
                <div className="space-y-2">
                  {facilitiesData.building.latrines.map((latrine: any, index: number) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">{latrine.type}</span>
                          <Badge className="ml-2">{latrine.condition}</Badge>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditModal("latrines", index)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteFacility("latrines", index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        <div>Accessibility: {latrine.accessibility}</div>
                        {latrine.constructionDate && (
                          <div>
                            Construction Date: {new Date(latrine.constructionDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-slate-500 py-2">No latrines available</div>
              )}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    resetForms();
                    setShowLatrineModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Latrine
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  // Render educational facilities section
  const renderEducationalFacilities = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <div className="flex-1">
            <Label htmlFor="has-library" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <Book className="h-4 w-4 text-slate-500" />
              Library
            </Label>
          </div>
          {isEditing ? (
            <Switch
              id="has-library"
              checked={!!facilitiesData.building.hasLibrary}
              onCheckedChange={(checked) => handleSwitchChange("hasLibrary", checked)}
              disabled={loading}
            />
          ) : (
            renderStatusBadge(facilitiesData.building.hasLibrary)
          )}
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <div className="flex-1">
            <Label htmlFor="computers" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <Computer className="h-4 w-4 text-slate-500" />
              Computers
            </Label>
          </div>
          {isEditing ? (
            <Input
              id="computers"
              type="number"
              min="0"
              value={facilitiesData.building.numberOfComputers || 0}
              onChange={(e) => handleInputChange("numberOfComputers", Number.parseInt(e.target.value) || 0)}
              className="w-20 text-right"
              disabled={loading}
            />
          ) : (
            <span className="font-medium">{facilitiesData.building.numberOfComputers || 0}</span>
          )}
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="library">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4 text-slate-500" />
              <span>Library Details</span>
              <Badge className="ml-2 bg-slate-200 text-slate-800">
                {facilitiesData.building.library?.length || 0}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {facilitiesData.building.library?.length > 0 ? (
                <div className="space-y-2">
                  {facilitiesData.building.library.map((library: any, index: number) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">{library.libraryName || "Library"}</span>
                          <Badge className="ml-2">{library.libraryCondition}</Badge>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditModal("library", index)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteFacility("library", index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-slate-600">
                        <div>Books: {library.numberOfBooks || 0}</div>
                        <div>Has Librarian: {library.libraryStaff?.hasLibrarian ? "Yes" : "No"}</div>
                        <div>Has Computers: {library.libraryFacilities?.hasComputers ? "Yes" : "No"}</div>
                        <div>Has Internet: {library.libraryFacilities?.hasInternet ? "Yes" : "No"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-slate-500 py-2">No library details available</div>
              )}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    resetForms();
                    setShowLibraryModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Library
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="laboratory">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Flask className="h-4 w-4 text-slate-500" />
              <span>Laboratories</span>
              <Badge className="ml-2 bg-slate-200 text-slate-800">
                {facilitiesData.building.laboratory?.length || 0}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {facilitiesData.building.laboratory?.length > 0 ? (
                <div className="space-y-2">
                  {facilitiesData.building.laboratory.map((lab: any, index: number) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">{lab.name || lab.laboratoryType || "Laboratory"}</span>
                          <Badge className="ml-2">{lab.laboratoryCondition}</Badge>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditModal("laboratory", index)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteFacility("laboratory", index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-slate-600">
                        <div>Type: {lab.laboratoryType}</div>
                        <div>Has Computers: {lab.laboratoryFacilities?.hasComputers ? "Yes" : "No"}</div>
                        <div>Has Internet: {lab.laboratoryFacilities?.hasInternet ? "Yes" : "No"}</div>
                        <div>Has Printing: {lab.laboratoryFacilities?.hasPrinting ? "Yes" : "No"}</div>
                      </div>
                      {lab.details && <div className="mt-1 text-xs text-slate-600">{lab.details}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-slate-500 py-2">No laboratories available</div>
              )}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    resetForms();
                    setShowLaboratoryModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Laboratory
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="staffRoom">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              <span>Staff Rooms</span>
              <Badge className="ml-2 bg-slate-200 text-slate-800">
                {facilitiesData.building.staffRoom?.length || 0}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {facilitiesData.building.staffRoom?.length > 0 ? (
                <div className="space-y-2">
                  {facilitiesData.building.staffRoom.map((room: any, index: number) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">{room.name || "Staff Room"}</span>
                          <Badge className="ml-2">{room.condition}</Badge>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditModal("staffRoom", index)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteFacility("staffRoom", index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-slate-600">
                        <div>Desks: {room.desks || 0}</div>
                        <div>Chairs: {room.chairs || 0}</div>
                        <div>Computers: {room.computers || 0}</div>
                        <div>Internet: {room.internetAccess ? "Yes" : "No"}</div>
                      </div>
                      {room.details && <div className="mt-1 text-xs text-slate-600">{room.details}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-slate-500 py-2">No staff rooms available</div>
              )}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    resetForms();
                    setShowStaffRoomModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Room
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  // Render recreational facilities section
  const renderRecreationalFacilities = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <div className="flex-1">
            <Label htmlFor="has-playground" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-slate-500" />
              Playground
            </Label>
          </div>
          {isEditing ? (
            <Switch
              id="has-playground"
              checked={!!facilitiesData.building.hasPlayground}
              onCheckedChange={(checked) => handleSwitchChange("hasPlayground", checked)}
              disabled={loading}
            />
          ) : (
            renderStatusBadge(facilitiesData.building.hasPlayground)
          )}
        </div>

        {(isEditing || facilitiesData.building.hasPlayground) && (
          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
            <div className="flex-1">
              <Label htmlFor="playground-condition" className="text-sm font-medium">
                Playground Condition
              </Label>
            </div>
            {isEditing ? (
              <Select
                value={facilitiesData.building.playgroundCondition || "Good"}
                onValueChange={(value) => handleInputChange("playgroundCondition", value)}
                disabled={loading || !facilitiesData.building.hasPlayground}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant="outline"
                className={
                  facilitiesData.building.playgroundCondition === "Good"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : facilitiesData.building.playgroundCondition === "Fair"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                }
              >
                {facilitiesData.building.playgroundCondition || "Good"}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <div className="flex-1">
            <Label htmlFor="has-sports" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-slate-500" />
              Sports Facilities
            </Label>
          </div>
          {isEditing ? (
            <Switch
              id="has-sports"
              checked={!!facilitiesData.building.hasSportsFacilities}
              onCheckedChange={(checked) => handleSwitchChange("hasSportsFacilities", checked)}
              disabled={loading}
            />
          ) : (
            renderStatusBadge(facilitiesData.building.hasSportsFacilities)
          )}
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <div className="flex-1">
            <Label htmlFor="has-kitchen" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <Utensils className="h-4 w-4 text-slate-500" />
              Kitchen
            </Label>
          </div>
          {isEditing ? (
            <Switch
              id="has-kitchen"
              checked={!!facilitiesData.building.hasKitchen}
              onCheckedChange={(checked) => handleSwitchChange("hasKitchen", checked)}
              disabled={loading}
            />
          ) : (
            renderStatusBadge(facilitiesData.building.hasKitchen)
          )}
        </div>
      </div>

      {(isEditing || facilitiesData.building.hasSportsFacilities) && (
        <div className="space-y-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
          <Label htmlFor="sports-details" className="text-sm font-medium">
            Sports Facilities Details
          </Label>
          {isEditing ? (
            <Input
              id="sports-details"
              value={facilitiesData.building.sportsFacilitiesDetails || ""}
              onChange={(e) => handleInputChange("sportsFacilitiesDetails", e.target.value)}
              placeholder="Describe available sports facilities"
              disabled={loading || !facilitiesData.building.hasSportsFacilities}
            />
          ) : (
            <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              {facilitiesData.building.sportsFacilitiesDetails || "No details provided"}
            </div>
          )}
        </div>
      )}
      {facilitiesData.building.hasKitchen && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="kitchen">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-slate-500" />
                <span>Kitchen Details</span>
                <Badge className="ml-2 bg-slate-200 text-slate-800">{facilitiesData.building.kitchen?.length || 0}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {facilitiesData.building.kitchen?.length > 0 ? (
                  <div className="space-y-2">
                    {facilitiesData.building.kitchen.map((kitchen: any, index: number) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-base font-semibold">
                              {kitchen.kitchenType || "Kitchen"} Kitchen
                            </span>
                            <Badge className="ml-2">{kitchen.kitchenCondition}</Badge>
                          </div>
                          {isEditing && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal("kitchen", index)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteFacility("kitchen", index)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
                          <div><b>Cooking Stove:</b> <Badge variant={kitchen.kitchenFacilities?.hasCookingStove ? "default" : "outline"}>{kitchen.kitchenFacilities?.hasCookingStove ? "Yes" : "No"}</Badge> ({kitchen.kitchenFacilities?.numberOfCookingStoves || 0})</div>
                          <div><b>Refrigerator:</b> <Badge variant={kitchen.kitchenFacilities?.hasRefrigerator ? "default" : "outline"}>{kitchen.kitchenFacilities?.hasRefrigerator ? "Yes" : "No"}</Badge> ({kitchen.kitchenFacilities?.numberOfRefrigerators || 0})</div>
                          <div><b>Sink:</b> <Badge variant={kitchen.kitchenFacilities?.hasSink ? "default" : "outline"}>{kitchen.kitchenFacilities?.hasSink ? "Yes" : "No"}</Badge> ({kitchen.kitchenFacilities?.numberOfSinks || 0})</div>
                          <div><b>Storage:</b> <Badge variant={kitchen.kitchenFacilities?.hasStorage ? "default" : "outline"}>{kitchen.kitchenFacilities?.hasStorage ? "Yes" : "No"}</Badge> (Capacity: {kitchen.kitchenFacilities?.storageCapacity || 0})</div>
                          <div><b>Utensils:</b> <Badge variant={kitchen.kitchenFacilities?.hasUtensils ? "default" : "outline"}>{kitchen.kitchenFacilities?.hasUtensils ? "Yes" : "No"}</Badge></div>
                          <div><b>Cooking Equipment:</b> <Badge variant={kitchen.kitchenFacilities?.hasCookingEquipment ? "default" : "outline"}>{kitchen.kitchenFacilities?.hasCookingEquipment ? "Yes" : "No"}</Badge></div>
                          {kitchen.kitchenFacilities?.cookingEquipmentDetails && (
                            <div className="md:col-span-2"><b>Equipment Details:</b> {kitchen.kitchenFacilities.cookingEquipmentDetails}</div>
                          )}
                        </div>
                        {kitchen.additionalNotes && (
                          <div className="mt-2 text-xs text-slate-500">
                            <b>Additional Notes:</b> {kitchen.additionalNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm text-slate-500 py-2">No kitchen details available</div>
                )}
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      resetForms();
                      setShowKitchenModal(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Kitchen
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )

  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle className="text-lg">School Facilities</CardTitle>
          </div>
          {!isEditing && (
            <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-200">{facilitiesCount} Available</Badge>
          )}
          {!isEditing && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="ml-auto">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Facilities
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit school facilities</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription>Infrastructure and facilities available at this school</CardDescription>
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
            <AlertDescription>Facilities updated successfully!</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-10 bg-slate-100 dark:bg-slate-900 p-1 rounded-md mb-6">
            <TabsTrigger
              value="basic"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              Basic Facilities
            </TabsTrigger>
            <TabsTrigger
              value="educational"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              Educational
            </TabsTrigger>
            <TabsTrigger
              value="recreational"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              Recreational
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-0">
            {renderBasicFacilities()}
          </TabsContent>

          <TabsContent value="educational" className="mt-0">
            {renderEducationalFacilities()}
          </TabsContent>

          <TabsContent value="recreational" className="mt-0">
            {renderRecreationalFacilities()}
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

      {/* Classroom Modal */}
      <Dialog open={showClassroomModal} onOpenChange={setShowClassroomModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Classroom" : "Add Classroom"}</DialogTitle>
            <DialogDescription>
              Enter the details for the classroom. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="classroom-type">Classroom Type</Label>
                <Select
                  value={classroomForm.classroomType}
                  onValueChange={(value) => setClassroomForm({ ...classroomForm, classroomType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="Semi-Permanent">Semi-Permanent</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                    <SelectItem value="Under Tree">Under Tree</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="construction-date">Construction Date</Label>
                <Input
                  id="construction-date"
                  type="date"
                  value={classroomForm.constructionDate}
                  onChange={(e) => setClassroomForm({ ...classroomForm, constructionDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={classroomForm.capacity}
                  onChange={(e) =>
                    setClassroomForm({ ...classroomForm, capacity: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desk-type">Desk Type</Label>
                <Select
                  value={classroomForm.desk}
                  onValueChange={(value) => setClassroomForm({ ...classroomForm, desk: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select desk type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desk">Desk</SelectItem>
                    <SelectItem value="Bench">Bench</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chairs-type">Chairs Type</Label>
                <Select
                  value={classroomForm.chairs}
                  onValueChange={(value) => setClassroomForm({ ...classroomForm, chairs: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chairs type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chairs">Chairs</SelectItem>
                    <SelectItem value="Benches">Benches</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="boards-type">Board Type</Label>
                <Select
                  value={classroomForm.boards}
                  onValueChange={(value) => setClassroomForm({ ...classroomForm, boards: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select board type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blackboard">Blackboard</SelectItem>
                    <SelectItem value="Whiteboard">Whiteboard</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={classroomForm.condition}
                  onValueChange={(value) => setClassroomForm({ ...classroomForm, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessibility">Accessibility</Label>
                <Select
                  value={classroomForm.accessibility}
                  onValueChange={(value) => setClassroomForm({ ...classroomForm, accessibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select accessibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Accessible">Accessible</SelectItem>
                    <SelectItem value="Inaccessible">Inaccessible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClassroomModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClassroom}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Latrine Modal */}
      <Dialog open={showLatrineModal} onOpenChange={setShowLatrineModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Latrine" : "Add Latrine"}</DialogTitle>
            <DialogDescription>
              Enter the details for the latrine. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="latrine-type">Latrine Type</Label>
              <Select
                value={latrineForm.type}
                onValueChange={(value) => setLatrineForm({ ...latrineForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pit Latrine">Pit Latrine</SelectItem>
                  <SelectItem value="Flush Latrine">Flush Latrine</SelectItem>
                  <SelectItem value="Composting Latrine">Composting Latrine</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="latrine-condition">Condition</Label>
              <Select
                value={latrineForm.condition}
                onValueChange={(value) => setLatrineForm({ ...latrineForm, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="latrine-construction-date">Construction Date</Label>
              <Input
                id="latrine-construction-date"
                type="date"
                value={latrineForm.constructionDate}
                onChange={(e) => setLatrineForm({ ...latrineForm, constructionDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="latrine-accessibility">Accessibility</Label>
              <Select
                value={latrineForm.accessibility}
                onValueChange={(value) => setLatrineForm({ ...latrineForm, accessibility: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select accessibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accessible">Accessible</SelectItem>
                  <SelectItem value="Inaccessible">Inaccessible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLatrineModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLatrine}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Library Modal */}
      <Dialog open={showLibraryModal} onOpenChange={setShowLibraryModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Library" : "Add Library"}</DialogTitle>
            <DialogDescription>
              Enter the details for the library. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="library-name">Library Name</Label>
                <Input
                  id="library-name"
                  value={libraryForm.libraryName}
                  onChange={(e) => setLibraryForm({ ...libraryForm, libraryName: e.target.value })}
                  placeholder="Enter library name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number-of-books">Number of Books</Label>
                <Input
                  id="number-of-books"
                  type="number"
                  min="0"
                  value={libraryForm.numberOfBooks}
                  onChange={(e) =>
                    setLibraryForm({ ...libraryForm, numberOfBooks: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="library-condition">Condition</Label>
                <Select
                  value={libraryForm.libraryCondition}
                  onValueChange={(value) => setLibraryForm({ ...libraryForm, libraryCondition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Library Staff</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-librarian"
                    checked={libraryForm.libraryStaff.hasLibrarian}
                    onCheckedChange={(checked) =>
                      setLibraryForm({
                        ...libraryForm,
                        libraryStaff: {
                          ...libraryForm.libraryStaff,
                          hasLibrarian: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="has-librarian">Has Librarian</Label>
                </div>

                {libraryForm.libraryStaff.hasLibrarian && (
                  <div className="space-y-2 pl-6 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="librarian-name">Librarian Name</Label>
                      <Input
                        id="librarian-name"
                        value={libraryForm.libraryStaff.librarianName}
                        onChange={(e) =>
                          setLibraryForm({
                            ...libraryForm,
                            libraryStaff: {
                              ...libraryForm.libraryStaff,
                              librarianName: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter librarian name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="librarian-contact">Librarian Contact</Label>
                      <Input
                        id="librarian-contact"
                        value={libraryForm.libraryStaff.librarianContact}
                        onChange={(e) =>
                          setLibraryForm({
                            ...libraryForm,
                            libraryStaff: {
                              ...libraryForm.libraryStaff,
                              librarianContact: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter contact number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="librarian-email">Librarian Email</Label>
                      <Input
                        id="librarian-email"
                        type="email"
                        value={libraryForm.libraryStaff.librarianEmail}
                        onChange={(e) =>
                          setLibraryForm({
                            ...libraryForm,
                            libraryStaff: {
                              ...libraryForm.libraryStaff,
                              librarianEmail: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Library Facilities</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-computers"
                      checked={libraryForm.libraryFacilities.hasComputers}
                      onCheckedChange={(checked) =>
                        setLibraryForm({
                          ...libraryForm,
                          libraryFacilities: {
                            ...libraryForm.libraryFacilities,
                            hasComputers: !!checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="has-computers">Has Computers</Label>
                  </div>

                  {libraryForm.libraryFacilities.hasComputers && (
                    <div className="pl-6">
                      <Label htmlFor="number-of-computers">Number of Computers</Label>
                      <Input
                        id="number-of-computers"
                        type="number"
                        min="0"
                        value={libraryForm.libraryFacilities.numberOfComputers}
                        onChange={(e) =>
                          setLibraryForm({
                            ...libraryForm,
                            libraryFacilities: {
                              ...libraryForm.libraryFacilities,
                              numberOfComputers: Number.parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-study-rooms"
                      checked={libraryForm.libraryFacilities.hasStudyRooms}
                      onCheckedChange={(checked) =>
                        setLibraryForm({
                          ...libraryForm,
                          libraryFacilities: {
                            ...libraryForm.libraryFacilities,
                            hasStudyRooms: !!checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="has-study-rooms">Has Study Rooms</Label>
                  </div>

                  {libraryForm.libraryFacilities.hasStudyRooms && (
                    <div className="pl-6">
                      <Label htmlFor="number-of-study-rooms">Number of Study Rooms</Label>
                      <Input
                        id="number-of-study-rooms"
                        type="number"
                        min="0"
                        value={libraryForm.libraryFacilities.numberOfStudyRooms}
                        onChange={(e) =>
                          setLibraryForm({
                            ...libraryForm,
                            libraryFacilities: {
                              ...libraryForm.libraryFacilities,
                              numberOfStudyRooms: Number.parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-internet"
                    checked={libraryForm.libraryFacilities.hasInternet}
                    onCheckedChange={(checked) =>
                      setLibraryForm({
                        ...libraryForm,
                        libraryFacilities: {
                          ...libraryForm.libraryFacilities,
                          hasInternet: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="has-internet">Has Internet</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-printing"
                    checked={libraryForm.libraryFacilities.hasPrinting}
                    onCheckedChange={(checked) =>
                      setLibraryForm({
                        ...libraryForm,
                        libraryFacilities: {
                          ...libraryForm.libraryFacilities,
                          hasPrinting: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="has-printing">Has Printing</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-notes">Additional Notes</Label>
                <Textarea
                  id="additional-notes"
                  value={libraryForm.additionalNotes}
                  onChange={(e) => setLibraryForm({ ...libraryForm, additionalNotes: e.target.value })}
                  placeholder="Enter any additional information"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLibraryModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLibrary}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Kitchen Modal */}
      <Dialog open={showKitchenModal} onOpenChange={setShowKitchenModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Kitchen" : "Add Kitchen"}</DialogTitle>
            <DialogDescription>
              Enter the details for the kitchen. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="kitchen-type">Kitchen Type</Label>
                <Select
                  value={kitchenForm.kitchenType}
                  onValueChange={(value) => setKitchenForm({ ...kitchenForm, kitchenType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indoor">Indoor</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                    <SelectItem value="Semi-Outdoor">Semi-Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kitchen-condition">Condition</Label>
                <Select
                  value={kitchenForm.kitchenCondition}
                  onValueChange={(value) => setKitchenForm({ ...kitchenForm, kitchenCondition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Kitchen Facilities</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-cooking-stove"
                      checked={kitchenForm.kitchenFacilities.hasCookingStove}
                      onCheckedChange={(checked) =>
                        setKitchenForm({
                          ...kitchenForm,
                          kitchenFacilities: {
                            ...kitchenForm.kitchenFacilities,
                            hasCookingStove: !!checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="has-cooking-stove">Has Cooking Stove</Label>
                  </div>

                  {kitchenForm.kitchenFacilities.hasCookingStove && (
                    <div className="pl-6">
                      <Label htmlFor="number-of-cooking-stoves">Number of Cooking Stoves</Label>
                      <Input
                        id="number-of-cooking-stoves"
                        type="number"
                        min="0"
                        value={kitchenForm.kitchenFacilities.numberOfCookingStoves}
                        onChange={(e) =>
                          setKitchenForm({
                            ...kitchenForm,
                            kitchenFacilities: {
                              ...kitchenForm.kitchenFacilities,
                              numberOfCookingStoves: Number.parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-refrigerator"
                      checked={kitchenForm.kitchenFacilities.hasRefrigerator}
                      onCheckedChange={(checked) =>
                        setKitchenForm({
                          ...kitchenForm,
                          kitchenFacilities: {
                            ...kitchenForm.kitchenFacilities,
                            hasRefrigerator: !!checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="has-refrigerator">Has Refrigerator</Label>
                  </div>

                  {kitchenForm.kitchenFacilities.hasRefrigerator && (
                    <div className="pl-6">
                      <Label htmlFor="number-of-refrigerators">Number of Refrigerators</Label>
                      <Input
                        id="number-of-refrigerators"
                        type="number"
                        min="0"
                        value={kitchenForm.kitchenFacilities.numberOfRefrigerators}
                        onChange={(e) =>
                          setKitchenForm({
                            ...kitchenForm,
                            kitchenFacilities: {
                              ...kitchenForm.kitchenFacilities,
                              numberOfRefrigerators: Number.parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-sink"
                      checked={kitchenForm.kitchenFacilities.hasSink}
                      onCheckedChange={(checked) =>
                        setKitchenForm({
                          ...kitchenForm,
                          kitchenFacilities: {
                            ...kitchenForm.kitchenFacilities,
                            hasSink: !!checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="has-sink">Has Sink</Label>
                  </div>

                  {kitchenForm.kitchenFacilities.hasSink && (
                    <div className="pl-6">
                      <Label htmlFor="number-of-sinks">Number of Sinks</Label>
                      <Input
                        id="number-of-sinks"
                        type="number"
                        min="0"
                        value={kitchenForm.kitchenFacilities.numberOfSinks}
                        onChange={(e) =>
                          setKitchenForm({
                            ...kitchenForm,
                            kitchenFacilities: {
                              ...kitchenForm.kitchenFacilities,
                              numberOfSinks: Number.parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-storage"
                    checked={kitchenForm.kitchenFacilities.hasStorage}
                    onCheckedChange={(checked) =>
                      setKitchenForm({
                        ...kitchenForm,
                        kitchenFacilities: {
                          ...kitchenForm.kitchenFacilities,
                          hasStorage: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="has-storage">Has Storage</Label>
                </div>

                {kitchenForm.kitchenFacilities.hasStorage && (
                  <div className="pl-6">
                    <Label htmlFor="storage-capacity">Storage Capacity</Label>
                    <Input
                      id="storage-capacity"
                      type="number"
                      min="0"
                      value={kitchenForm.kitchenFacilities.storageCapacity}
                      onChange={(e) =>
                        setKitchenForm({
                          ...kitchenForm,
                          kitchenFacilities: {
                            ...kitchenForm.kitchenFacilities,
                            storageCapacity: Number.parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-utensils"
                    checked={kitchenForm.kitchenFacilities.hasUtensils}
                    onCheckedChange={(checked) =>
                      setKitchenForm({
                        ...kitchenForm,
                        kitchenFacilities: {
                          ...kitchenForm.kitchenFacilities,
                          hasUtensils: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="has-utensils">Has Utensils</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-cooking-equipment"
                    checked={kitchenForm.kitchenFacilities.hasCookingEquipment}
                    onCheckedChange={(checked) =>
                      setKitchenForm({
                        ...kitchenForm,
                        kitchenFacilities: {
                          ...kitchenForm.kitchenFacilities,
                          hasCookingEquipment: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="has-cooking-equipment">Has Cooking Equipment</Label>
                </div>

                {kitchenForm.kitchenFacilities.hasCookingEquipment && (
                  <div className="pl-6">
                    <Label htmlFor="cooking-equipment-details">Cooking Equipment Details</Label>
                    <Textarea
                      id="cooking-equipment-details"
                      value={kitchenForm.kitchenFacilities.cookingEquipmentDetails}
                      onChange={(e) =>
                        setKitchenForm({
                          ...kitchenForm,
                          kitchenFacilities: {
                            ...kitchenForm.kitchenFacilities,
                            cookingEquipmentDetails: e.target.value,
                          },
                        })
                      }
                      placeholder="Describe cooking equipment"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kitchen-additional-notes">Additional Notes</Label>
                <Textarea
                  id="kitchen-additional-notes"
                  value={kitchenForm.additionalNotes}
                  onChange={(e) => setKitchenForm({ ...kitchenForm, additionalNotes: e.target.value })}
                  placeholder="Enter any additional information"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowKitchenModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveKitchen}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Laboratory Modal */}
      <Dialog open={showLaboratoryModal} onOpenChange={setShowLaboratoryModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Laboratory" : "Add Laboratory"}</DialogTitle>
            <DialogDescription>
              Enter the details for the laboratory. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="lab-name">Laboratory Name</Label>
                <Input
                  id="lab-name"
                  value={laboratoryForm.name}
                  onChange={(e) => setLaboratoryForm({ ...laboratoryForm, name: e.target.value })}
                  placeholder="Enter laboratory name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lab-type">Laboratory Type</Label>
                <Select
                  value={laboratoryForm.laboratoryType}
                  onValueChange={(value) => setLaboratoryForm({ ...laboratoryForm, laboratoryType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Science Lab">Science Lab</SelectItem>
                    <SelectItem value="Computer Lab">Computer Lab</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lab-details">Details</Label>
                <Textarea
                  id="lab-details"
                  value={laboratoryForm.details}
                  onChange={(e) => setLaboratoryForm({ ...laboratoryForm, details: e.target.value })}
                  placeholder="Enter laboratory details"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lab-condition">Condition</Label>
                <Select
                  value={laboratoryForm.laboratoryCondition}
                  onValueChange={(value) => setLaboratoryForm({ ...laboratoryForm, laboratoryCondition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Laboratory Facilities</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lab-has-computers"
                      checked={laboratoryForm.laboratoryFacilities.hasComputers}
                      onCheckedChange={(checked) =>
                        setLaboratoryForm({
                          ...laboratoryForm,
                          laboratoryFacilities: {
                            ...laboratoryForm.laboratoryFacilities,
                            hasComputers: !!checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="lab-has-computers">Has Computers</Label>
                  </div>

                  {laboratoryForm.laboratoryFacilities.hasComputers && (
                    <div className="pl-6">
                      <Label htmlFor="lab-number-of-computers">Number of Computers</Label>
                      <Input
                        id="lab-number-of-computers"
                        type="number"
                        min="0"
                        value={laboratoryForm.laboratoryFacilities.numberOfComputers}
                        onChange={(e) =>
                          setLaboratoryForm({
                            ...laboratoryForm,
                            laboratoryFacilities: {
                              ...laboratoryForm.laboratoryFacilities,
                              numberOfComputers: Number.parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lab-has-internet"
                    checked={laboratoryForm.laboratoryFacilities.hasInternet}
                    onCheckedChange={(checked) =>
                      setLaboratoryForm({
                        ...laboratoryForm,
                        laboratoryFacilities: {
                          ...laboratoryForm.laboratoryFacilities,
                          hasInternet: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="lab-has-internet">Has Internet</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lab-has-printing"
                    checked={laboratoryForm.laboratoryFacilities.hasPrinting}
                    onCheckedChange={(checked) =>
                      setLaboratoryForm({
                        ...laboratoryForm,
                        laboratoryFacilities: {
                          ...laboratoryForm.laboratoryFacilities,
                          hasPrinting: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="lab-has-printing">Has Printing</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lab-additional-notes">Additional Notes</Label>
                <Textarea
                  id="lab-additional-notes"
                  value={laboratoryForm.additionalNotes}
                  onChange={(e) => setLaboratoryForm({ ...laboratoryForm, additionalNotes: e.target.value })}
                  placeholder="Enter any additional information"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLaboratoryModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLaboratory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Staff Room Modal */}
      <Dialog open={showStaffRoomModal} onOpenChange={setShowStaffRoomModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Staff Room" : "Add Staff Room"}</DialogTitle>
            <DialogDescription>
              Enter the details for the staff room. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="staff-room-name">Name</Label>
                <Input
                  id="staff-room-name"
                  value={staffRoomForm.name}
                  onChange={(e) => setStaffRoomForm({ ...staffRoomForm, name: e.target.value })}
                  placeholder="Enter staff room name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-room-details">Details</Label>
                <Textarea
                  id="staff-room-details"
                  value={staffRoomForm.details}
                  onChange={(e) => setStaffRoomForm({ ...staffRoomForm, details: e.target.value })}
                  placeholder="Enter staff room details"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-room-condition">Condition</Label>
                <Select
                  value={staffRoomForm.condition}
                  onValueChange={(value) => setStaffRoomForm({ ...staffRoomForm, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Furniture & Equipment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="filing-cabinets">Filing Cabinets</Label>
                    <Input
                      id="filing-cabinets"
                      type="number"
                      min="0"
                      value={staffRoomForm.filingCabinets}
                      onChange={(e) =>
                        setStaffRoomForm({
                          ...staffRoomForm,
                          filingCabinets: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desks">Desks</Label>
                    <Input
                      id="desks"
                      type="number"
                      min="0"
                      value={staffRoomForm.desks}
                      onChange={(e) =>
                        setStaffRoomForm({
                          ...staffRoomForm,
                          desks: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chairs">Chairs</Label>
                    <Input
                      id="chairs"
                      type="number"
                      min="0"
                      value={staffRoomForm.chairs}
                      onChange={(e) =>
                        setStaffRoomForm({
                          ...staffRoomForm,
                          chairs: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shelves">Shelves</Label>
                    <Input
                      id="shelves"
                      type="number"
                      min="0"
                      value={staffRoomForm.shelves}
                      onChange={(e) =>
                        setStaffRoomForm({
                          ...staffRoomForm,
                          shelves: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="computers">Computers</Label>
                    <Input
                      id="computers"
                      type="number"
                      min="0"
                      value={staffRoomForm.computers}
                      onChange={(e) =>
                        setStaffRoomForm({
                          ...staffRoomForm,
                          computers: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printers">Printers</Label>
                    <Input
                      id="printers"
                      type="number"
                      min="0"
                      value={staffRoomForm.printers}
                      onChange={(e) =>
                        setStaffRoomForm({
                          ...staffRoomForm,
                          printers: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="internet-access"
                    checked={staffRoomForm.internetAccess}
                    onCheckedChange={(checked) =>
                      setStaffRoomForm({
                        ...staffRoomForm,
                        internetAccess: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="internet-access">Internet Access</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-room-additional-notes">Additional Notes</Label>
                <Textarea
                  id="staff-room-additional-notes"
                  value={staffRoomForm.additionalNotes}
                  onChange={(e) => setStaffRoomForm({ ...staffRoomForm, additionalNotes: e.target.value })}
                  placeholder="Enter any additional information"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStaffRoomModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStaffRoom}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
