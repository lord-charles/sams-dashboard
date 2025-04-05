"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  AreaChart,
  Area,
} from "recharts"
import {
  ArrowUpDown,
  Users,
  UserRound,
  ChevronDown,
  ChevronUp,
  ArrowDownZA,
  ArrowUpAZ,
  BarChart3,
  FileText,
  ArrowLeftRight,
  Filter,
  Download,
  TrendingUp,
  MapPin,
  Search,
  Percent,
  Info,
  Calendar,
  BarChart2,
  PieChartIcon,
  Share2,
  Printer,
  RefreshCw,
  HelpCircle,
  SlidersHorizontal,
  Maximize2,
  Scale,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


export default function EnrollmentDashboard({enrollmentData}: {enrollmentData: any}) {
  const [sortConfig, setSortConfig] = useState({ key: "totalPupils", direction: "desc" })
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedState, setExpandedState] = useState(null)
  const [filterValue, setFilterValue] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [comparisonSubTab, setComparisonSubTab] = useState("stateComparison")
  const [showTrends, setShowTrends] = useState(false)
  const [isLoading, setIsLoading] = useState(false)



// Calculate totals
const calculateTotals = () => {
  let totalPupils = 0
  let totalFemale = 0
  let totalMale = 0

  enrollmentData.forEach((state: any) => {
    totalPupils += state.totalPupils
    totalFemale += state.totalFemale
    totalMale += state.totalMale
  })

  return {
    totalPupils,
    totalFemale,
    totalMale,
    femalePercentage: (totalFemale / totalPupils) * 100,
    malePercentage: (totalMale / totalPupils) * 100,
  }
}

const totals = calculateTotals()

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-primary">Male: {payload[0].value.toLocaleString()}</p>
        <p className="text-rose-500">Female: {payload[1].value.toLocaleString()}</p>
        <p className="font-medium mt-1">Total: {(payload[0].value + payload[1].value).toLocaleString()}</p>
      </div>
    )
  }

  return null
}

// Custom active shape for pie chart
const renderActiveShape = (props:any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

  return (
    <g>
      <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#888">
        {payload.name}
      </text>
      <text x={cx} y={cy} textAnchor="middle" fill="#333" className="text-xl font-bold">
        {value.toLocaleString()}
      </text>
      <text x={cx} y={cy} dy={25} textAnchor="middle" fill="#888">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
      />
    </g>
  )
}


  // Sort data based on current sort configuration
  const sortedData = useMemo(() => {
    const sortableData = [...enrollmentData]
    sortableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
    return sortableData
  }, [sortConfig])

  const filteredData = useMemo(() => {
    if (!filterValue) return sortedData

    return sortedData.filter((state) => state.state.toLowerCase().includes(filterValue.toLowerCase()))
  }, [sortedData, filterValue])

  // Request sort function
  const requestSort = useCallback(
    (key: string) => {
      let direction = "desc"
      if (sortConfig.key === key && sortConfig.direction === "desc") {
        direction = "asc"
      }
      setSortConfig({ key, direction })
    },
    [sortConfig],
  )

  // Get sort icon based on current sort configuration
  const getSortIcon = useCallback(
    (key: string) => {
      if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 ml-1" />
      return sortConfig.direction === "asc" ? (
        <ArrowUpAZ className="h-4 w-4 ml-1" />
      ) : (
        <ArrowDownZA className="h-4 w-4 ml-1" />
      )
    },
    [sortConfig],
  )

  // Prepare data for pie chart
  const pieData = [
    { name: "Male", value: totals.totalMale, fill: "#2563eb" },
    { name: "Female", value: totals.totalFemale, fill: "#ec4899" },
  ]

  // Prepare data for top 5 states chart
  const top5States = sortedData.slice(0, 5).map((state) => ({
    name: state.state,
    male: state.totalMale,
    female: state.totalFemale,
    total: state.totalPupils,
  }))

  // Toggle expanded state
  const toggleExpand = useCallback(
    (stateId: any) => {
      if (expandedState === stateId) {
        setExpandedState(null)
      } else {
        setExpandedState(stateId)
      }
    },
    [expandedState],
  )

  const handleTabChange = useCallback((value: string) => {
    setIsLoading(true)
    setActiveTab(value)

    // Reset some state when changing tabs
    setExpandedState(null)
    setFilterValue("")

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)

    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }, [])

  // Calculate gender gap data for visualization
  const genderGapData = useMemo(() => {
    return sortedData
      .map((state) => {
        const malePercent = (state.totalMale / state.totalPupils) * 100
        const femalePercent = (state.totalFemale / state.totalPupils) * 100
        const genderGap = malePercent - femalePercent

        return {
          state: state.state,
          genderGap,
          totalPupils: state.totalPupils,
          malePercent,
          femalePercent,
        }
      })
      .sort((a, b) => Math.abs(b.genderGap) - Math.abs(a.genderGap))
  }, [sortedData])


  return (
      <div>
    

        <Tabs defaultValue="overview" className="w-full" onValueChange={handleTabChange}>
          <TabsList  className="h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
            <TabsTrigger value="overview"  className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Summary</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="comparison"  className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent">
              <span className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                <span>Comparison</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="details"  className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Details</span>
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <Skeleton className="h-[180px] w-full rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Card className="md:col-span-3 bg-gradient-to-br from-background to-muted overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold">Total Enrollment</h2>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="text-4xl font-bold mt-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                        >
                          {totals.totalPupils.toLocaleString()}
                        </motion.p>
                        <p className="text-muted-foreground">Students across South Sudan</p>
                      </div>
                      <div className="mt-6 md:mt-0 flex items-center gap-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="text-center"
                        >
                          <div className="flex items-center gap-2 justify-center">
                            <UserRound className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">{Math.round(totals.malePercentage)}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Male</p>
                          <p className="text-lg font-medium">{totals.totalMale.toLocaleString()}</p>
                        </motion.div>
                        <div className="h-16 w-px bg-border"></div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="text-center"
                        >
                          <div className="flex items-center gap-2 justify-center">
                            <UserRound className="h-5 w-5 text-rose-500" />
                            <span className="text-lg font-semibold">{Math.round(totals.femalePercentage)}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Female</p>
                          <p className="text-lg font-medium">{totals.totalFemale.toLocaleString()}</p>
                        </motion.div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-2 bg-muted rounded-full overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${totals.malePercentage}%` }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="h-full bg-primary"
                        style={{ float: "left" }}
                      ></motion.div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${totals.femalePercentage}%` }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="h-full bg-rose-500"
                        style={{ float: "left" }}
                      ></motion.div>
                    </motion.div>

                  </CardContent>
                </Card>

                <Card className="md:col-span-2 overflow-hidden">
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <CardTitle>Top 5 States by Enrollment</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1"
                          onClick={() => setShowTrends(!showTrends)}
                        >
                          {showTrends ? <BarChart2 className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                          {showTrends ? "Bar Chart" : "Trend View"}
                        </Button>
                        <TooltipProvider>
                          <TooltipUI>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Maximize2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Expand chart</TooltipContent>
                          </TooltipUI>
                        </TooltipProvider>
                      </div>
                    </div>
                    <CardDescription>Distribution of students across the largest states</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        {!showTrends ? (
                          <BarChart
                            data={top5States}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            barGap={0}
                            barCategoryGap="20%"
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                              dataKey="male"
                              name="Male"
                              stackId="a"
                              fill="#2563eb"
                              radius={[4, 4, 0, 0]}
                              animationDuration={1500}
                            />
                            <Bar
                              dataKey="female"
                              name="Female"
                              stackId="a"
                              fill="#ec4899"
                              radius={[4, 4, 0, 0]}
                              animationDuration={1500}
                            />
                          </BarChart>
                        ) : (
                          <AreaChart data={top5States} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="male"
                              name="Male"
                              stroke="#2563eb"
                              fill="#2563eb"
                              fillOpacity={0.6}
                              animationDuration={1500}
                            />
                            <Area
                              type="monotone"
                              dataKey="female"
                              name="Female"
                              stroke="#ec4899"
                              fill="#ec4899"
                              fillOpacity={0.6}
                              animationDuration={1500}
                            />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle>Gender Distribution</CardTitle>
                    <CardDescription>Overall male/female enrollment ratio</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            dataKey="value"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            animationDuration={1500}
                            animationBegin={300}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span>Male: {Math.round(totals.malePercentage)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span>Female: {Math.round(totals.femalePercentage)}%</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-8">
            {isLoading ? (
              <Skeleton className="h-[600px] w-full rounded-lg" />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>State Comparison Analysis</CardTitle>
                  <CardDescription>Compare enrollment data across different dimensions</CardDescription>
                  <Tabs value={comparisonSubTab} onValueChange={setComparisonSubTab} className="mt-4">
                    <TabsList>
                      <TabsTrigger value="stateComparison">
                        <span className="flex items-center gap-2">
                          <BarChart2 className="h-4 w-4" />
                          <span>State Ranking</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="genderAnalysis">
                        <span className="flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          <span>Gender Balance</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="distribution">
                        <span className="flex items-center gap-2">
                          <PieChartIcon className="h-4 w-4" />
                          <span>Distribution</span>
                        </span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {comparisonSubTab === "stateComparison" && (
                      <motion.div
                        key="stateComparison"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Enrollment by State</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              <span>All States</span>
                            </Badge>
                          </div>
                        </div>
                        <div className="h-[500px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={sortedData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              layout="vertical"
                              barGap={0}
                              barCategoryGap="20%"
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                              <XAxis type="number" />
                              <YAxis type="category" dataKey="state" width={50} />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Bar
                                dataKey="totalMale"
                                name="Male"
                                stackId="a"
                                fill="#2563eb"
                                animationDuration={1500}
                                animationBegin={300}
                              />
                              <Bar
                                dataKey="totalFemale"
                                name="Female"
                                stackId="a"
                                fill="#ec4899"
                                animationDuration={1500}
                                animationBegin={600}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    )}

                    {comparisonSubTab === "genderAnalysis" && (
                      <motion.div
                        key="genderAnalysis"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Gender Balance Analysis</h3>
                          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                            <SlidersHorizontal className="h-3 w-3" />
                            Filter
                          </Button>
                        </div>

                        <div className="space-y-6">
                          {genderGapData.map((state, index) => {
                            return (
                              <motion.div
                                key={state.state}
                                className="space-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-medium">
                                      {state.state}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {state.totalPupils.toLocaleString()} students
                                    </span>
                                  </div>
                                  <span
                                    className={`text-sm font-medium ${state.genderGap > 0 ? "text-primary" : "text-rose-500"}`}
                                  >
                                    {state.genderGap > 0 ? "Male" : "Female"} dominant:{" "}
                                    {Math.abs(state.genderGap).toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex h-3 rounded-full overflow-hidden">
                                  <motion.div
                                    className="bg-primary"
                                    style={{ width: `${state.malePercent}%` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${state.malePercent}%` }}
                                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                  ></motion.div>
                                  <motion.div
                                    className="bg-rose-500"
                                    style={{ width: `${state.femalePercent}%` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${state.femalePercent}%` }}
                                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                  ></motion.div>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span>
                                    Male: {Math.round(state.malePercent)}% (
                                    {((state.totalPupils * state.malePercent) / 100).toLocaleString()})
                                  </span>
                                  <span>
                                    Female: {Math.round(state.femalePercent)}% (
                                    {((state.totalPupils * state.femalePercent) / 100).toLocaleString()})
                                  </span>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>

                        <div className="mt-6 pt-6 border-t">
                          <h4 className="text-sm font-medium mb-4">Gender Gap Analysis</h4>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={genderGapData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="state" />
                                <YAxis label={{ value: "Gender Gap (%)", angle: -90, position: "insideLeft" }} />
                                <Tooltip />
                                <Bar
                                  dataKey="genderGap"
                                  name="Gender Gap (%)"
                                  fill="#2563eb"
                                >
                                  {genderGapData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.genderGap > 0 ? "#2563eb" : "#ec4899"} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {comparisonSubTab === "distribution" && (
                      <motion.div
                        key="distribution"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div>
                          <h3 className="text-lg font-medium mb-4">Enrollment Distribution</h3>
                          <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={sortedData.slice(0, 6)}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="totalPupils"
                                  nameKey="state"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  animationDuration={1500}
                                  animationBegin={300}
                                >
                                  {sortedData.slice(0, 6).map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        ["#2563eb", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"][index % 6]
                                      }
                                    />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => value.toLocaleString()} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {sortedData.slice(0, 6).map((state, index) => (
                              <div key={state.id} className="flex items-center gap-1">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: ["#2563eb", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"][
                                      index % 6
                                    ],
                                  }}
                                ></div>
                                <span className="text-xs">{state.state}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Relative State Sizes</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {sortedData.slice(0, 6).map((state) => {
                              const percentage = (state.totalPupils / totals.totalPupils) * 100
                              return (
                                <div key={state.id} className="bg-muted/30 p-4 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <Badge>{state.state}</Badge>
                                    <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full bg-primary"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      transition={{ duration: 1 }}
                                    ></motion.div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {state.totalPupils.toLocaleString()} students
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                          <div className="mt-6 pt-4 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Total Students</span>
                              <span className="text-sm font-bold">{totals.totalPupils.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            {isLoading ? (
              <Skeleton className="h-[600px] w-full rounded-lg" />
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <CardTitle>Detailed Enrollment Data</CardTitle>
                      <CardDescription>
                        Comprehensive data for all states with filtering and sorting options
                      </CardDescription>
                    </div>
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search states..."
                          className="pl-8 h-9 w-full md:w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          aria-label="Search states"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestSort("state")}
                      className="flex items-center"
                    >
                      State {getSortIcon("state")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestSort("totalPupils")}
                      className="flex items-center"
                    >
                      Total {getSortIcon("totalPupils")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestSort("totalMale")}
                      className="flex items-center"
                    >
                      Male {getSortIcon("totalMale")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestSort("totalFemale")}
                      className="flex items-center"
                    >
                      Female {getSortIcon("totalFemale")}
                    </Button>
                  </div>

                  {filteredData.length === 0 ? (
                    <div className="text-center py-12">
                      <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-medium">No states match your search</h4>
                      <p className="text-muted-foreground">Try a different search term</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredData.map((state) => {
                        const malePercent = (state.totalMale / state.totalPupils) * 100
                        const femalePercent = (state.totalFemale / state.totalPupils) * 100
                        const isExpanded = expandedState === state.id

                        return (
                          <motion.div
                            key={state.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`border rounded-lg p-4 ${isExpanded ? "bg-muted/50" : "hover:bg-muted/30"} transition-colors`}
                          >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className="h-8 w-8 rounded-full p-0 flex items-center justify-center font-bold"
                                >
                                  {state.state}
                                </Badge>
                                <div>
                                  <h4 className="font-semibold">{state.state} State</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {((state.totalPupils / totals.totalPupils) * 100).toFixed(1)}% of total enrollment
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 mt-4 md:mt-0">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Total</p>
                                  <p className="font-semibold">{state.totalPupils.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Male</p>
                                  <p className="font-semibold">{state.totalMale.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Female</p>
                                  <p className="font-semibold">{state.totalFemale.toLocaleString()}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2"
                                  onClick={() => toggleExpand(state.id)}
                                  aria-expanded={isExpanded}
                                  aria-label={isExpanded ? "Collapse details" : "Expand details"}
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-4 overflow-hidden"
                                >
                                  <div className="pt-4 border-t">
                                    <div className="space-y-4">
                                      <div>
                                        <div className="flex justify-between mb-1">
                                          <span className="text-sm">Gender Distribution</span>
                                          <span className="text-sm">
                                            Male: {Math.round(malePercent)}% | Female: {Math.round(femalePercent)}%
                                          </span>
                                        </div>
                                        <div className="flex h-3 rounded-full overflow-hidden">
                                          <motion.div
                                            className="bg-primary"
                                            style={{ width: `${malePercent}%` }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${malePercent}%` }}
                                            transition={{ duration: 0.8 }}
                                          ></motion.div>
                                          <motion.div
                                            className="bg-rose-500"
                                            style={{ width: `${femalePercent}%` }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${femalePercent}%` }}
                                            transition={{ duration: 0.8 }}
                                          ></motion.div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-background p-4 rounded-lg border">
                                          <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-muted-foreground" />
                                            <h5 className="font-medium">Total Enrollment</h5>
                                          </div>
                                          <p className="text-2xl font-bold mt-2">
                                            {state.totalPupils.toLocaleString()}
                                          </p>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            Represents {((state.totalPupils / totals.totalPupils) * 100).toFixed(1)}% of
                                            South Sudan
                                          </p>
                                        </div>

                                        <div className="bg-background p-4 rounded-lg border">
                                          <div className="flex items-center gap-2">
                                            <UserRound className="h-5 w-5 text-primary" />
                                            <h5 className="font-medium">Male Students</h5>
                                          </div>
                                          <p className="text-2xl font-bold mt-2">{state.totalMale.toLocaleString()}</p>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {Math.round(malePercent)}% of state enrollment
                                          </p>
                                        </div>

                                        <div className="bg-background p-4 rounded-lg border">
                                          <div className="flex items-center gap-2">
                                            <UserRound className="h-5 w-5 text-rose-500" />
                                            <h5 className="font-medium">Female Students</h5>
                                          </div>
                                          <p className="text-2xl font-bold mt-2">
                                            {state.totalFemale.toLocaleString()}
                                          </p>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {Math.round(femalePercent)}% of state enrollment
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm text-muted-foreground">State ID: {state.id}</span>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs flex items-center gap-1"
                                          >
                                            <Info className="h-3 w-3" />
                                            View Full Report
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs flex items-center gap-1"
                                          >
                                            <Download className="h-3 w-3" />
                                            Export Data
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>
                      Showing {filteredData.length} of {sortedData.length} states
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Export All Data
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
  )
}
