"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Smartphone, Monitor, BookOpen, DollarSign, Users, ClipboardList, Calendar, HelpCircle, Download, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Play, BarChart, UserPlus, UserMinus, ArrowUpRight, Wifi, WifiOff, CheckCircle, XCircle, Menu, X } from 'lucide-react'

const modules = [
  { id: 'enrollment', name: 'Enrollment', icon: Users, description: 'Manage learner and teacher registration, updates, and promotions' },
  { id: 'cash-transfer', name: 'Cash Transfer', icon: DollarSign, description: 'Validate and disburse funds to eligible learners' },
  { id: 'learners-with-disabilities', name: 'Learners with Disabilities', icon: Users, description: 'Validate and manage learners with disabilities' },
  { id: 'attendance', name: 'Attendance', icon: Calendar, description: 'Record and track learner attendance' },
]

const TutorialSidebar = ({ activeModule, setActiveModule, isMobile, setIsSidebarOpen }) => (
  <ScrollArea className={`h-[calc(100vh-4rem)] ${isMobile ? 'w-full' : 'w-64'} border-r`}>
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Modules</h2>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {modules.map((module) => (
        <TooltipProvider key={module.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeModule === module.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveModule(module.id)
                  if (isMobile) setIsSidebarOpen(false)
                }}
              >
                <module.icon className="mr-2 h-4 w-4" />
                {module.name}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{module.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  </ScrollArea>
)

const TutorialContent = ({ activeModule }) => {
  const [activeStep, setActiveStep] = useState(0)
  const moduleContent = {
    'enrollment': {
      title: 'Enrollment Module Tutorial',
      description: 'Learn how to manage learner and teacher enrollment using both the mobile app and web dashboard.',
      steps: [
        {
          title: 'Accessing the Enrollment Module',
          content: 'Open the Ana Fii Inni app on your mobile device or log in to the web dashboard. Navigate to the Enrollment module by tapping/clicking on the "Enrollment" icon.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Registering New Learners/Teachers',
          content: 'Click on the "+" button and select "New Learner" or "New Teacher". Fill in the required fields such as name, date of birth, gender, and contact information. For teachers, include additional details like qualifications and subjects taught.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Updating Existing Records',
          content: 'Search for the learner or teacher using the search bar. Click on the record to open it, then tap/click the "Edit" button to make changes. You can update personal details, contact information, or academic status.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Dropping Learners/Teachers',
          content: 'To remove a learner or teacher from the system, locate their record and click the "Drop" button. You\'ll be prompted to provide a reason for dropping, which will be recorded for administrative purposes.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Promoting Learners',
          content: 'At the end of each academic year, use the "Promote Learners" feature. Select the current grade/level and choose the learners to be promoted. The system will automatically update their grade/level for the new academic year.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Offline Capabilities (Mobile App)',
          content: 'The mobile app supports offline mode for regions with limited internet connectivity. Any changes made offline will be queued and automatically synced when an internet connection is available. Look for the sync icon to ensure your data is up-to-date.',
          image: '/placeholder.svg?height=200&width=300',
        },
      ],
    },
    'cash-transfer': {
      title: 'Cash Transfer Module Tutorial',
      description: 'Learn how to validate eligible learners and disburse funds through the Cash Transfer module.',
      steps: [
        {
          title: 'Accessing the Cash Transfer Module',
          content: 'Open the Ana Fii Inni app or web dashboard and navigate to the Cash Transfer module.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Validating Eligible Learners',
          content: 'Use the "Validate Eligibility" feature to review and confirm which boys and girls meet the criteria for cash transfers. The system will display a list of potentially eligible learners based on predefined criteria.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Reviewing Eligibility Criteria',
          content: 'Click on each learner to review their details against the eligibility criteria. Confirm or reject their eligibility based on the information provided and any additional verification you\'ve performed.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Initiating Fund Disbursement',
          content: 'Once eligibility is confirmed, use the "Disburse Funds" feature to initiate the transfer process. Select the eligible learners and enter the amount to be disbursed.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Confirming Disbursement',
          content: 'Review the disbursement details, including total amount and number of recipients. Confirm the transaction and the system will process the payments to the selected learners.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Generating Disbursement Reports',
          content: 'After disbursement, generate reports to track the funds distributed. These reports can be filtered by date range, school, or individual learners for comprehensive financial oversight.',
          image: '/placeholder.svg?height=200&width=300',
        },
      ],
    },
    'learners-with-disabilities': {
      title: 'Learners with Disabilities (LWD) Module Tutorial',
      description: 'Learn how to validate and manage information about learners with disabilities to ensure inclusive education.',
      steps: [
        {
          title: 'Accessing the LWD Module',
          content: 'Navigate to the Learners with Disabilities module in the Ana Fii Inni app or web dashboard.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Identifying Learners with Disabilities',
          content: 'Use the "Identify LWD" feature to flag learners who may have disabilities. This can be done during the enrollment process or updated later as information becomes available.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Validating Disability Status',
          content: 'For each identified learner, go through the validation process. This involves reviewing any supporting documentation, conducting assessments, or consulting with specialists to confirm the nature and extent of the disability.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Recording Disability Details',
          content: 'Once validated, record the specific details of the learner\'s disability. This includes the type of disability, severity, and any specific accommodations or support required.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Updating Support Plans',
          content: 'Based on the recorded information, create or update the learner\'s support plan. This should outline the accommodations, resources, and strategies to be implemented to support the learner\'s education.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Generating LWD Reports',
          content: 'Use the reporting feature to generate summaries of learners with disabilities. These reports can help in resource allocation, training planning, and ensuring adequate support is provided across the education system.',
          image: '/placeholder.svg?height=200&width=300',
        },
      ],
    },
    'attendance': {
      title: 'Attendance Module Tutorial',
      description: 'Learn how to efficiently record and manage daily attendance for learners.',
      steps: [
        {
          title: 'Accessing the Attendance Module',
          content: 'Open the Attendance module in the Ana Fii Inni app or web dashboard.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Selecting Class and Date',
          content: 'Choose the class and date for which you want to record attendance. The system will display a list of all learners in the selected class.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Marking Attendance',
          content: 'For each learner, mark their attendance status: Present, Absent, or Late. You can use quick actions to mark all as present and then adjust individual records as needed.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Recording Reasons for Absence',
          content: 'For absent learners, you have the option to record the reason for their absence. This information can be useful for identifying patterns or addressing specific issues.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Bulk Attendance Entry',
          content: 'For quicker entry, especially useful for large classes, use the "Bulk Entry" feature. This allows you to update multiple learners\' attendance statuses simultaneously.',
          image: '/placeholder.svg?height=200&width=300',
        },
        {
          title: 'Generating Attendance Reports',
          content: 'Use the reporting feature to generate attendance summaries. You can create daily, weekly, or monthly reports, as well as individual learner attendance profiles to track patterns over time.',
          image: '/placeholder.svg?height=200&width=300',
        },
      ],
    },
  }

  const content = moduleContent[activeModule]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{content.title}</h2>
        <p className="text-muted-foreground">{content.description}</p>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {activeStep + 1} of {content.steps.length}
          </span>
          <Button
            variant="outline"
            onClick={() => setActiveStep(Math.min(content.steps.length - 1, activeStep + 1))}
            disabled={activeStep === content.steps.length - 1}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <Progress value={(activeStep + 1) / content.steps.length * 100} className="w-full" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{content.steps[activeStep].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{content.steps[activeStep].content}</p>
              <div className="relative h-[200px] w-full">
                <Image
                  src={content.steps[activeStep].image}
                  alt={content.steps[activeStep].title}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const VideoTutorial = ({ videoId, title }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="relative h-0  pb-[56.25%]">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  </div>
)

const ResourceCard = ({ title, description, downloadUrl }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button variant="outline" onClick={() => window.open(downloadUrl, '_blank')}>
        <Download className="mr-2 h-4 w-4" /> Download
      </Button>
    </CardFooter>
  </Card>
)

export default function TutorialsPage() {
  const [activeTab, setActiveTab] = useState("mobile-app")
  const [activeModule, setActiveModule] = useState("enrollment")
  const [searchQuery, setSearchQuery] = useState("")
  const [isOnline, setIsOnline] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="px-4 py-8 bg-gradient-to-b from-primary/20 to-background">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Ana Fii Inni Tutorials</h1>
        {isMobile && (
          <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Badge variant={isOnline ? "success" : "destructive"}>
            {isOnline ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
            {isOnline ? "Online" : "Offline"}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Offline mode is available for the mobile app. Data will sync when online.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="mobile-app"
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
          >
            <Smartphone className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Mobile App</span>
          </TabsTrigger>
          <TabsTrigger value="web-dashboard"
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
          >
            <Monitor className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Web Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="modules"
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Modules</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mobile-app" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Features</CardTitle>
              <CardDescription>Explore the powerful capabilities of the Ana Fii Inni mobile app.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <WifiOff className="mr-2 h-4 w-4" /> Offline Mode: Work without internet and sync later
                </li>
                <li className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" /> Quick Enrollment: Register learners and teachers on-the-go
                </li>
                <li className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> Attendance Tracking: Mark attendance with a few taps
                </li>
                <li className="flex items-center">
                  <ArrowUpRight className="mr-2 h-4 w-4" /> Learner Promotion: Easily promote learners to the next level
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" /> Eligibility Validation: Quickly verify cash transfer eligibility
                </li>
              </ul>
            </CardContent>
          </Card>
          <VideoTutorial videoId="Fi3_BjVzpqk" title="Mobile App Walkthrough" />
        </TabsContent>
        <TabsContent value="web-dashboard" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Web Dashboard Analytics</CardTitle>
              <CardDescription>Harness the power of data with analytics tools.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4" /> Enrollment Trends: Visualize registration patterns
                </li>
                <li className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" /> Cash Transfer Insights: Track disbursement efficiency
                </li>
                <li className="flex items-center">
                  <Users className="mr-2 h-4 w-4" /> LWD Statistics: Monitor support for learners with disabilities
                </li>
                <li className="flex items-center">
                  <ClipboardList className="mr-2 h-4 w-4" /> Attendance Reports: Analyze attendance patterns
                </li>
              </ul>
            </CardContent>
          </Card>
          <VideoTutorial videoId="Fi3_BjVzpqk" title="Web Dashboard Walkthrough" />
        </TabsContent>
        <TabsContent value="modules" className="space-y-8">
          <div className="flex flex-col md:flex-row">
            {isMobile ? (
              <Dialog open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Module Selection</DialogTitle>
                    <DialogDescription>Choose a module to explore</DialogDescription>
                  </DialogHeader>
                  <TutorialSidebar
                    activeModule={activeModule}
                    setActiveModule={setActiveModule}
                    isMobile={isMobile}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                </DialogContent>
              </Dialog>
            ) : (
              <TutorialSidebar
                activeModule={activeModule}
                setActiveModule={setActiveModule}
                isMobile={isMobile}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            )}
            <div className="flex-1">
              <TutorialContent activeModule={activeModule} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Separator className="my-8" />
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResourceCard
            title="Data Synchronization Guide"
            description="Learn how to effectively manage data sync between mobile and web"
            downloadUrl="#"
          />
          <ResourceCard
            title="Offline Mode Best Practices"
            description="Maximize efficiency when working in areas with limited connectivity"
            downloadUrl="#"
          />
          <ResourceCard
            title="Reporting Techniques"
            description="Create custom reports to gain deeper insights into your data"
            downloadUrl="#"
          />
        </div>
      </section>
      <Separator className="my-8" />
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Feedback</h2>
        <p>Help us improve our tutorials. Your input is valuable!</p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Button variant="outline">
            <ThumbsUp className="mr-2 h-4 w-4" /> This was helpful
          </Button>
          <Button variant="outline">
            <ThumbsDown className="mr-2 h-4 w-4" /> I need more information
          </Button>
        </div>
      </section>
    </div>
  )
}