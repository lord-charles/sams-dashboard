"use client"

import type React from "react"

import { useState } from "react"
import { Book, BookOpen, Edit, Save, Plus, X, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import axios from "axios"
import { base_url } from "@/app/utils/baseUrl"

interface SchoolSubjectsProps {
  schoolInfo: any
}

export function SchoolSubjects({ schoolInfo }: SchoolSubjectsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [schoolData, setSchoolData] = useState(schoolInfo)
  const [newSubject, setNewSubject] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Common subjects in schools for filtering/categorization
  const commonSubjectCategories = {
    Languages: ["English", "Arabic", "Kiswahili", "French", "Local Language"],
    Sciences: ["Biology", "Chemistry", "Physics", "Science", "Computer Science"],
    Mathematics: ["Mathematics", "Algebra", "Geometry", "Calculus"],
    Humanities: ["History", "Geography", "Religious Education", "Social Studies", "Civics"],
    Arts: ["Art", "Music", "Drama", "Physical Education", "Creative Arts"],
    Vocational: ["Agriculture", "Home Economics", "Business Studies", "Entrepreneurship"],
  }

  // Initialize subjects array if it doesn't exist
  if (!schoolData.subjects) {
    schoolData.subjects = []
  }

  // Check if subjects exist and have values
  const hasSubjects = schoolData.subjects && Array.isArray(schoolData.subjects) && schoolData.subjects.length > 0

  // Filter subjects based on search term
  const filteredSubjects = hasSubjects
    ? schoolData.subjects.filter((subject: string) => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    : []

  // Group subjects by category
  const categorizeSubjects = () => {
    const categorized: Record<string, string[]> = {}

    if (!hasSubjects) return categorized

    // Initialize categories
    Object.keys(commonSubjectCategories).forEach((category) => {
      categorized[category] = []
    })
    categorized["Other"] = []

    // Categorize each subject
    schoolData.subjects.forEach((subject: string) => {
      let found = false
      for (const [category, subjectList] of Object.entries(commonSubjectCategories)) {
        if (subjectList.some((s) => subject.toLowerCase().includes(s.toLowerCase()))) {
          categorized[category].push(subject)
          found = true
          break
        }
      }
      if (!found) {
        categorized["Other"].push(subject)
      }
    })

    // Remove empty categories
    Object.keys(categorized).forEach((category) => {
      if (categorized[category].length === 0) {
        delete categorized[category]
      }
    })

    return categorized
  }

  const categorizedSubjects = categorizeSubjects()

  // Add a new subject
  const handleAddSubject = () => {
    if (!newSubject.trim()) return

    // Check if subject already exists (case insensitive)
    if (schoolData.subjects.some((s: string) => s.toLowerCase() === newSubject.trim().toLowerCase())) {
      setError("This subject already exists")
      setTimeout(() => setError(null), 3000)
      return
    }

    setSchoolData((prev: any) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject.trim()],
    }))
    setNewSubject("")
  }

  // Remove a subject
  const handleRemoveSubject = (subjectToRemove: string) => {
    setSchoolData((prev: any) => ({
      ...prev,
      subjects: prev.subjects.filter((subject: string) => subject !== subjectToRemove),
    }))
  }

  // Handle key press in the new subject input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSubject()
    }
  }

  // Save changes to the server
  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Prepare the payload with only the subjects field
      const payload = {
        subjects: schoolData.subjects,
      }

      const res = await axios.patch(`${base_url}school-data/school/${schoolInfo._id}`, payload)
      console.log(res.data)
      if (!res.data) throw new Error("Failed to update school subjects")

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
    setSchoolData(schoolInfo) // Revert to original data
    setIsEditing(false)
    setError(null)
  }

  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle className="text-lg">School Subjects</CardTitle>
          </div>
          {hasSubjects && !isEditing && (
            <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-200">
              {schoolData.subjects.length} Subjects
            </Badge>
          )}
          {!isEditing && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="ml-auto">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Subjects
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit school subjects</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription>Subjects taught at this school</CardDescription>
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
            <AlertDescription>Subjects updated successfully!</AlertDescription>
          </Alert>
        )}

        {isEditing ? (
          <div className="space-y-6">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor="new-subject" className="text-sm font-medium mb-1 block">
                  Add New Subject
                </label>
                <Input
                  id="new-subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter subject name"
                  className="border-slate-300"
                />
              </div>
              <Button
                onClick={handleAddSubject}
                disabled={!newSubject.trim() || loading}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">Current Subjects ({schoolData.subjects.length})</h3>
                {schoolData.subjects.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSchoolData((prev: any) => ({ ...prev, subjects: [] }))}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {schoolData.subjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {schoolData.subjects.map((subject: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Book className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{subject}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSubject(subject)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove {subject}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                  <p className="text-slate-600 dark:text-slate-400">No subjects added yet</p>
                  <p className="text-sm text-slate-500 mt-1">Add subjects using the form above</p>
                </div>
              )}
            </div>
          </div>
        ) : hasSubjects ? (
          <div className="space-y-6">
            {/* Search input */}
            {schoolData.subjects.length > 5 && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            )}

            {searchTerm ? (
              // Display search results
              <div className="space-y-4">
                {filteredSubjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredSubjects.map((subject: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                      >
                        <Book className="h-4 w-4 text-slate-500" />
                        <span>{subject}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                    <p className="text-slate-600 dark:text-slate-400">No subjects match your search</p>
                  </div>
                )}
              </div>
            ) : (
              // Display categorized subjects
              <div className="space-y-6">
                {Object.entries(categorizedSubjects).map(([category, subjects]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-md font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      {category} <span className="text-sm text-slate-500">({subjects.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {subjects.map((subject: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                          <Book className="h-4 w-4 text-slate-500" />
                          <span>{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Clear search button */}
            {searchTerm && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={() => setSearchTerm("")} className="text-sm">
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-lg border">
            <BookOpen className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">No subjects available</p>
            <p className="text-sm text-slate-500 mt-1">
              {isEditing ? "Add subjects using the form above" : "Click the Edit button to add subjects"}
            </p>
          </div>
        )}
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
    </Card>
  )
}
