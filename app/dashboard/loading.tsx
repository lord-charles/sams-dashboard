"use client"

import { useEffect, useState } from "react"
import { Loader2, BookOpen, BarChart3, Users, School, FileText, LayoutDashboard, Settings, Bell, Search, HelpCircle, Calendar, FileBarChart, GraduationCap, Building, ChevronDown, Menu, LogOut, User, Database, PieChart, TrendingUp } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default function Loading() {
  // State to track loading progress
  const [progress, setProgress] = useState(0)
  
  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval)
          return 99
        }
        // Slow down progress as it gets closer to 100%
        const increment = Math.max(0.5, 5 - Math.floor(prev / 20))
        return Math.min(99, prev + increment)
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* EMIS Branded Loading Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative overflow-hidden">
          {/* South Sudan flag colors stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 flex w-full">
            <div className="flex-1 bg-ss-black w-full"></div>
            <div className="flex-1 bg-ss-red w-full"></div>
            <div className="flex-1 bg-ss-green w-full"></div>
            <div className="flex-1 bg-ss-blue w-full"></div>
            <div className="flex-1 bg-ss-white w-full"></div>
            <div className="flex-1 bg-ss-black w-full"></div>

          </div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="flex items-center mb-6 pt-2">
            <div className="relative mr-3">
              <div className="w-12 h-12 rounded-full bg-ss-blue/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-ss-blue" />
              </div>
              <div className="absolute -inset-1 rounded-full border border-ss-blue/30 animate-ping opacity-30" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">EMIS South Sudan</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ministry of General Education and Instruction</p>
            </div>
          </div>
          
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center mb-3">
              <div className="relative w-20 h-20">
                {/* Circular progress */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    className="text-gray-200 dark:text-gray-700" 
                    strokeWidth="6" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="44" 
                    cx="50" 
                    cy="50" 
                  />
                  <circle 
                    className="text-ss-blue" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="44" 
                    cx="50" 
                    cy="50" 
                    strokeDasharray={276}
                    strokeDashoffset={276 - (progress / 100) * 276}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-medium">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Loading SAMS Data
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Preparing your school management system
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-5">
            <div 
              className="h-full bg-gradient-to-r from-ss-black via-ss-blue to-ss-green bg-size-200 animate-gradient-x"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Loading indicators */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs mb-5">
            <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div className="w-2 h-2 rounded-full bg-green-500 mb-1 animate-pulse" />
              <span className="text-gray-600 dark:text-gray-400">Database</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div className="w-2 h-2 rounded-full bg-green-500 mb-1 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="text-gray-600 dark:text-gray-400">API</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div className="w-2 h-2 rounded-full bg-green-500 mb-1 animate-pulse" style={{ animationDelay: "0.4s" }} />
              <span className="text-gray-600 dark:text-gray-400">Server</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div className="w-2 h-2 rounded-full bg-green-500 mb-1 animate-pulse" style={{ animationDelay: "0.6s" }} />
              <span className="text-gray-600 dark:text-gray-400">Auth</span>
            </div>
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center items-center space-x-1 mb-3">
            <div className="w-2 h-2 rounded-full bg-ss-black animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-ss-red animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-ss-green animate-bounce" style={{ animationDelay: "0.4s" }} />
            <div className="w-2 h-2 rounded-full bg-ss-blue animate-bounce" style={{ animationDelay: "0.6s" }} />
          </div>
          
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Ministry of Education, Republic of South Sudan
          </div>
        </div>
      </div>

      {/* Main skeleton content - Clean Modern UI */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Skeleton className="h-8 w-32 animate-pulse-subtle" />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Desktop navigation */}
                  <Skeleton className="h-4 w-24 my-auto animate-pulse-subtle" />
                  <Skeleton className="h-4 w-20 my-auto animate-pulse-subtle" style={{ animationDelay: "0.1s" }} />
                  <Skeleton className="h-4 w-28 my-auto animate-pulse-subtle" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                {/* Desktop header right */}
                <Skeleton className="h-8 w-8 rounded-full animate-pulse-subtle" />
                <Skeleton className="h-8 w-8 rounded-full animate-pulse-subtle" style={{ animationDelay: "0.1s" }} />
                <Skeleton className="h-8 w-8 rounded-full animate-pulse-subtle" style={{ animationDelay: "0.2s" }} />
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end">
                      <Skeleton className="h-4 w-24 animate-pulse-subtle" />
                      <Skeleton className="h-3 w-16 mt-1 animate-pulse-subtle" style={{ animationDelay: "0.1s" }} />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full animate-pulse-subtle" />
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Skeleton className="h-8 w-8 rounded-md animate-pulse-subtle" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex-1 px-3 space-y-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    >
                      <Skeleton className="h-5 w-5 mr-3 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                      <Skeleton 
                        className="h-4 w-full max-w-[100px] animate-pulse-subtle" 
                        style={{ animationDelay: `${i * 0.05}s` }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Skeleton className="h-9 w-9 rounded-full animate-pulse-subtle" />
                  <div className="ml-3">
                    <Skeleton className="h-4 w-24 animate-pulse-subtle" />
                    <Skeleton className="h-3 w-16 mt-1 animate-pulse-subtle" style={{ animationDelay: "0.1s" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Skeleton className="h-4 w-16 animate-pulse-subtle" />
                  <span>/</span>
                  <Skeleton className="h-4 w-16 animate-pulse-subtle" style={{ animationDelay: "0.05s" }} />
                  <span>/</span>
                  <Skeleton className="h-4 w-32 animate-pulse-subtle" style={{ animationDelay: "0.1s" }} />
                </div>

                {/* Page header */}
                <div className="md:flex md:items-center md:justify-between mb-6">
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-8 w-48 animate-pulse-subtle" />
                    <Skeleton className="h-4 w-96 mt-2 animate-pulse-subtle" style={{ animationDelay: "0.1s" }} />
                  </div>
                  <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    <Skeleton className="h-10 w-24 rounded-md animate-pulse-subtle" />
                    <Skeleton className="h-10 w-32 rounded-md animate-pulse-subtle" style={{ animationDelay: "0.1s" }} />
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden relative">
                      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" 
                        style={{ animationDelay: `${i * 0.2}s` }} />
                      <CardContent className="p-5">
                        <div className="flex items-center">
                          <Skeleton className="h-12 w-12 rounded-md animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                <Skeleton className="h-4 w-24 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                              </dt>
                              <dd>
                                <Skeleton className="h-7 w-20 mt-1 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05 + 0.05}s` }} />
                              </dd>
                            </dl>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm">
                            <Skeleton className="h-4 w-16 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05 + 0.1}s` }} />
                            <Skeleton className="h-4 w-12 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05 + 0.15}s` }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Tabs */}
                <div className="mb-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full justify-start border-b border-gray-200 dark:border-gray-700 px-0 mb-4">
                      {["Overview", "Enrollment", "Performance", "Resources"].map((_, i) => (
                        <TabsTrigger key={i} value={i === 0 ? "overview" : `tab-${i}`} className="relative">
                          <Skeleton 
                            className="h-4 w-24 animate-pulse-subtle" 
                            style={{ animationDelay: `${i * 0.05}s` }} 
                          />
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-6 overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <Skeleton className="h-6 w-48 mb-4 animate-pulse-subtle" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>
                          <Skeleton className="h-4 w-20 mb-1 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                          <Skeleton className="h-10 w-full rounded-md animate-pulse-subtle" style={{ animationDelay: `${i * 0.05 + 0.05}s` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Data visualization section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Main chart */}
                  <Card className="lg:col-span-2 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <CardHeader className="pb-0">
                      <Skeleton className="h-5 w-48 animate-pulse-subtle" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 mt-4">
                        <div className="h-full w-full flex flex-col">
                          <div className="flex-1 flex">
                            {/* Y-axis labels */}
                            <div className="w-10 flex flex-col justify-between text-xs text-gray-500 pr-2">
                              {[5, 4, 3, 2, 1, 0].map((_, i) => (
                                <Skeleton key={i} className="h-3 w-8 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                              ))}
                            </div>
                            
                            {/* Chart bars */}
                            <div className="flex-1 flex items-end justify-between gap-2 border-l border-b border-gray-200 dark:border-gray-700 pt-6 pb-0">
                              {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                  <Skeleton 
                                    className="w-full rounded-t-sm animate-pulse-subtle" 
                                    style={{ 
                                      height: `${Math.random() * 70 + 20}%`,
                                      animationDelay: `${i * 0.05}s`,
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* X-axis labels */}
                          <div className="h-6 flex justify-between px-10 mt-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <Skeleton key={i} className="h-3 w-12 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Pie chart */}
                  <Card className="overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" 
                      style={{ animationDelay: "0.3s" }} />
                    <CardHeader className="pb-0">
                      <Skeleton className="h-5 w-40 animate-pulse-subtle" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 relative flex items-center justify-center mt-4">
                        <div className="w-48 h-48 rounded-full border-8 border-gray-100 dark:border-gray-800 relative">
                          {[0, 1, 2, 3].map((i) => (
                            <div 
                              key={i}
                              className="absolute inset-0"
                              style={{ 
                                clipPath: `polygon(50% 50%, 100% 0%, ${100 - i * 25}% 0%)`,
                                transform: `rotate(${i * 90}deg)`,
                              }}
                            >
                              <Skeleton 
                                className="w-full h-full animate-pulse-subtle" 
                                style={{ animationDelay: `${i * 0.1}s` }} 
                              />
                            </div>
                          ))}
                          <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                            <Skeleton className="h-6 w-16 rounded-full animate-pulse-subtle" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center">
                            <Skeleton className="w-3 h-3 rounded-sm mr-2 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                            <Skeleton className="h-3 w-16 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Table */}
                <Card className="overflow-hidden relative mb-6">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-48 animate-pulse-subtle" />
                      <Skeleton className="h-9 w-32 rounded-md animate-pulse-subtle" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-t mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Array.from({ length: 6 }).map((_, i) => (
                              <TableHead key={i}>
                                <Skeleton className="h-4 w-24 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i} className={cn(i % 2 === 0 ? "bg-muted/30" : "")}>
                              {Array.from({ length: 6 }).map((_, j) => (
                                <TableCell key={j}>
                                  {j === 0 ? (
                                    <div className="flex items-center">
                                      <Skeleton className="h-8 w-8 rounded-md mr-3 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05 + j * 0.01}s` }} />
                                      <Skeleton className="h-4 w-32 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05 + j * 0.01}s` }} />
                                    </div>
                                  ) : j === 4 ? (
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                      <Skeleton 
                                        className="h-full rounded-full animate-pulse-subtle" 
                                        style={{ 
                                          width: `${Math.random() * 50 + 50}%`,
                                          animationDelay: `${i * 0.05 + j * 0.01}s`
                                        }} 
                                      />
                                    </div>
                                  ) : j === 5 ? (
                                    <div className="flex justify-end">
                                      <Skeleton className="h-8 w-8 rounded-full animate-pulse-subtle" style={{ animationDelay: `${i * 0.05 + j * 0.01}s` }} />
                                    </div>
                                  ) : (
                                    <Skeleton 
                                      className="h-4 animate-pulse-subtle" 
                                      style={{ 
                                        width: j === 1 ? "80%" : j === 2 ? "60%" : "40%",
                                        animationDelay: `${i * 0.05 + j * 0.01}s`
                                      }} 
                                    />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <Skeleton className="h-5 w-64 mb-4 md:mb-0 animate-pulse-subtle" />
                    <div className="flex space-x-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-16 animate-pulse-subtle" style={{ animationDelay: `${i * 0.05}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
