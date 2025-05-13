"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Users, Search, School, MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from "@/lib/utils"

interface NoLearnersYetProps {
  selectedState: string | null
  selectedCounty: string | null
  selectedPayam: string | null
  selectedSchool: string | null
  onSchoolCodeSearch?: (code: string) => void
}

export function NoLearnersYet({
  selectedState,
  selectedCounty,
  selectedPayam,
  selectedSchool,
  onSchoolCodeSearch = () => { },
}: NoLearnersYetProps) {
  const [activeTab, setActiveTab] = useState<"selection" | "code">("selection")
  const [schoolCode, setSchoolCode] = useState<string>("")
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    setAnimateIn(true)
  }, [])

  const steps = [
    { name: "State", selected: !!selectedState, icon: <MapPin className="w-5 h-5" /> },
    { name: "County", selected: !!selectedCounty, icon: <MapPin className="w-5 h-5" /> },
    { name: "Payam", selected: !!selectedPayam, icon: <MapPin className="w-5 h-5" /> },
    { name: "School", selected: !!selectedSchool, icon: <School className="w-5 h-5" /> },
  ]

  const completedSteps = steps.filter(step => step.selected).length
  const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0

  const handleSchoolCodeSearch = () => {
    if (schoolCode.trim()) {
      setIsSearching(true)
      onSchoolCodeSearch(schoolCode)
      setTimeout(() => setIsSearching(false), 1000)
    }
  }

  return (
    <div className={cn(
      "w-full transition-all duration-700 transform",
      animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="w-full ">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0 bg-grid-slate-700 dark:bg-grid-slate-300 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
          </div>


        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("selection")}
            className={cn(
              "flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 relative",
              activeTab === "selection"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Selection Path</span>
            </div>
            {activeTab === "selection" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 relative",
              activeTab === "code"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <div className="flex items-center justify-center space-x-2">
              <Search className="w-4 h-4" />
              <span>School Code</span>
            </div>
            {activeTab === "code" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          {/* Selection Path Tab */}
          {activeTab === "selection" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {steps.map((step, index) => {
                  const isActive = step.selected;
                  const isPrevious = index < completedSteps;

                  return (
                    <div key={step.name} className="relative">
                      {/* Connector Line */}
                      {index > 0 && (
                        <div className="absolute top-8 -left-4 w-8 h-0.5 hidden md:block">
                          <div className={cn(
                            "h-full transition-colors duration-300",
                            isPrevious ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
                          )}></div>
                        </div>
                      )}

                      <div className={cn(
                        "flex flex-col items-center p-4 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                          : "bg-slate-100 dark:bg-slate-800/50 border border-transparent"
                      )}>
                        <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300",
                          isActive
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
                            : "bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600"
                        )}>
                          {isActive ? <CheckCircle className="w-8 h-8" /> : step.icon}
                        </div>

                        <span className={cn(
                          "font-medium text-center transition-colors duration-300",
                          isActive
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400"
                        )}>
                          {step.name}
                        </span>

                        {isActive && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-slate-600 dark:text-slate-400 text-sm">
                {completedSteps === 0 ? (
                  <p>Start by selecting a State to view learner data</p>
                ) : completedSteps === steps.length ? (
                  <p className="text-green-600 dark:text-green-400 font-medium">All selections complete!</p>
                ) : (
                  <p>Continue making selections to view learner data</p>
                )}
              </div>
            </div>
          )}

          {/* School Code Tab */}
          {activeTab === "code" && (
            <div className="max-w-lg mx-auto space-y-6 animate-fadeIn">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
                  Search by School Code
                </h3>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter 3-letter school code"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    className="pr-12 h-12 text-base bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <School className="h-5 w-5 text-slate-400" />
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={handleSchoolCodeSearch}
                    disabled={!schoolCode.trim() || isSearching}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium"
                  >
                    {isSearching ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start">
                <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">School Code Information</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    School codes are unique 3-letter identifiers provided by your administrator.
                    Contact your system administrator if you need assistance finding your school code.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative px-6 py-2 flex flex-col items-center">
          {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div> */}

          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">No Learners Yet</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-md text-center">
            Select a location path or search by school code to view learner data.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -z-10 top-1/3 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute -z-10 top-1/3 left-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>


    </div>
  )
}
