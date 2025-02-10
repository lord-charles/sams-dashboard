"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  School,
  Users,
  BookOpen,
  BarChart,
  Radio,
  Coins,
  GraduationCap,
  MapPin,
  Calendar,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

const CountUp = ({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        setCount(Math.floor(start));
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [end, duration, inView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const VideoBackground = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative h-[60vh] overflow-hidden">
      <Image
        src="/img/banners/banner4.jpg"
        alt="Ana Fii Inni"
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Ana Fii Inni</h1>
          <p className="text-xl md:text-2xl mb-8">
            &ldquo;I am here!&quot; - Transforming Education in South Sudan
          </p>
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  const events = [
    {
      year: 2013,
      title: "Ana Fii Inni Launched",
      description: "Initial focus on collecting enrolment and attendance data",
    },
    {
      year: 2015,
      title: "90% Data Coverage",
      description: "Over 90% of enrolment data uploaded and available",
    },
    {
      year: 2016,
      title: "Expansion",
      description: "System coverage expanded to more than 3,000 schools",
    },
    {
      year: 2018,
      title: "Real-time Reporting",
      description: "Implementation of SMS-based real-time attendance reporting",
    },
    {
      year: 2020,
      title: "Comprehensive Management",
      description: "Evolution into a full-fledged education management system",
    },
    {
      year: 2023,
      title: "Future Vision",
      description: "Plans for mobile app development and advanced analytics",
    },
  ];

  return (
    <div className="relative container mx-auto px-6 flex flex-col space-y-8">
      <div className="absolute z-0 w-2 h-full bg-white shadow-md inset-0 left-17 md:mx-auto md:right-0 md:left-0"></div>
      {events.map((event, index) => (
        <div key={index} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col md:flex-row items-center ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-1">
              <div className="p-4 bg-white rounded shadow">
                <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                <p className="text-sm">{event.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-primary-50 rounded-full -ml-4 md:ml-0 md:mr-0">
              <span className="text-white font-bold">{event.year}</span>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

const InteractiveMap = () => {
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const states = [
    { id: 1, name: "Central Equatoria", schools: 450, students: 120000 },
    { id: 2, name: "Eastern Equatoria", schools: 380, students: 95000 },
    { id: 3, name: "Western Equatoria", schools: 320, students: 80000 },
    { id: 4, name: "Jonglei", schools: 410, students: 110000 },
    { id: 5, name: "Unity", schools: 290, students: 75000 },
    { id: 6, name: "Upper Nile", schools: 350, students: 90000 },
    { id: 7, name: "Lakes", schools: 300, students: 78000 },
    { id: 8, name: "Warrap", schools: 270, students: 70000 },
    { id: 9, name: "Northern Bahr el Ghazal", schools: 310, students: 82000 },
    { id: 10, name: "Western Bahr el Ghazal", schools: 220, students: 58000 },
  ];

  return (
    <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/placeholder.svg?height=600&width=800"
          alt="Map of South Sudan"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="absolute inset-0 flex">
        <div className="w-1/3 bg-white bg-opacity-90 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">States of South Sudan</h3>
          {states.map((state) => (
            <div
              key={state.id}
              className={`p-2 mb-2 rounded cursor-pointer ${
                selectedState === state.id
                  ? "bg-primary-10"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedState(state.id)}
            >
              <h4 className="font-medium">{state.name}</h4>
              <p className="text-sm text-gray-600">Schools: {state.schools}</p>
              <p className="text-sm text-gray-600">
                Students: {state.students.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center">
          {selectedState && (
            <>
              <h3 className="text-xl font-semibold mb-2">
                {states.find((s) => s.id === selectedState)?.name ||
                  "Unknown State"}
              </h3>
              <p>
                Schools:{" "}
                {states.find((s) => s.id === selectedState)?.schools || 0}
              </p>
              <p>
                Students:{" "}
                {states
                  .find((s) => s.id === selectedState)
                  ?.students.toLocaleString() || "0"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "School Principal",
      quote:
        "Ana Fii Inni has revolutionized how we manage attendance and track student progress. It's an invaluable tool for our school.",
    },
    {
      id: 2,
      name: "Michael Deng",
      role: "Education Officer",
      quote:
        "The real-time reporting feature of Ana Fii Inni has greatly improved our ability to make data-driven decisions at the state level.",
    },
    {
      id: 3,
      name: "Grace Akol",
      role: "Teacher",
      quote:
        "As a teacher, I find Ana Fii Inni user-friendly and efficient. It has significantly reduced the time I spend on administrative tasks.",
    },
    {
      id: 4,
      name: "John Lual",
      role: "Parent",
      quote:
        "The system has improved communication between the school and parents. I can now easily track my child's attendance and performance.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="relative bg-gray-100 p-8 rounded-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-lg italic mb-4">
            &quot;{testimonials[currentIndex].quote}&quot;
          </p>
          <p className="font-semibold">{testimonials[currentIndex].name}</p>
          <p className="text-sm text-gray-600">
            {testimonials[currentIndex].role}
          </p>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={prevTestimonial}
        className="absolute left-4 top-1/2 transform -translate-y-1/2"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute right-4 top-1/2 transform -translate-y-1/2"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const faqs = [
    {
      question: "What is Ana Fii Inni?",
      answer:
        "Ana Fii Inni is a comprehensive education management system developed for South Sudan. It focuses on tracking student attendance, managing school resources, and improving overall educational outcomes.",
    },
    {
      question: "How does Ana Fii Inni work?",
      answer:
        "Ana Fii Inni uses SMS-based reporting to collect real-time data from schools. This data is then processed and presented in an online database, allowing users at school, state, and national levels to access instant reports.",
    },
    {
      question: "Who can use Ana Fii Inni?",
      answer:
        "Ana Fii Inni is designed for use by school administrators, teachers, education officers, and government officials involved in managing and improving the education system in South Sudan.",
    },
    {
      question: "What are the main features of Ana Fii Inni?",
      answer:
        "Key features include real-time attendance tracking, school infrastructure management, budgeting tools, cash transfer management for students, and comprehensive reporting capabilities.",
    },
    {
      question: "How does Ana Fii Inni support girls' education?",
      answer:
        "Ana Fii Inni is part of the Girls' Education South Sudan (GESS) programme. It helps track and manage initiatives aimed at increasing girls' access to education, such as cash transfers and targeted support programs.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <Label htmlFor="faq-search">Search FAQs</Label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="faq-search"
            type="text"
            placeholder="Type your question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {filteredFAQs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="px-4 py-4 bg-gradient-to-b from-primary/20 to-background">
      <VideoBackground />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        }}
        className="text-center my-12"
      >
        <h2 className="text-3xl font-bold mb-4">
          Transforming Education in South Sudan
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Ana Fii Inni is more than just a system - it&rsquo;s a catalyst for
          change in South Sudan&rsquo;s education landscape.
        </p>
      </motion.div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Key Statistics</CardTitle>
          <CardDescription>
            The impact of Ana Fii Inni in numbers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">
                <CountUp end={1000000} />+
              </h3>
              <p className="text-lg">Students Tracked</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">
                <CountUp end={30000} />+
              </h3>
              <p className="text-lg">Teachers in the System</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">
                <CountUp end={3000} />+
              </h3>
              <p className="text-lg">Schools Covered</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 gap-2">
          <TabsTrigger
            value="overview"
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="functionality"
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
          >
            Functionality
          </TabsTrigger>
          <TabsTrigger
            value="impact"
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
          >
            Impact
          </TabsTrigger>
          <TabsTrigger
            value="gess"
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
          >
            GESS Program
          </TabsTrigger>
          <TabsTrigger
            value="future"
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
          >
            Future Vision
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                Ana Fii Inni: A Journey of Educational Transformation
              </CardTitle>
              <CardDescription>
                From a data gathering tool to a comprehensive education
                management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-4">
                    Ana Fii Inni, which means &quot;I am here!&quot; in Arabic,
                    is the name given to the South Sudan Schools&rsquo;
                    Attendance Monitoring System (SSSAMS). Developed as part of
                    the Girls&rsquo; Education South Sudan (GESS) programme, Ana
                    Fii Inni has evolved from a simple data gathering tool into
                    a comprehensive, real-time education management information
                    system for South Sudan.
                  </p>
                  <p className="mb-4">
                    Launched in 2013, Ana Fii Inni initially focused on
                    collecting enrolment and attendance data to support the
                    implementation of the Girls&rsquo; Education South Sudan
                    project. Over the years, it has grown into an indispensable
                    tool for managing and improving education across the
                    country.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("functionality")}
                  >
                    Explore Our Functionality
                  </Button>
                </div>
                <div className="relative h-64 md:h-full">
                  <Image
                    src="/img/sams-erd.png"
                    alt="Ana Fii Inni System Overview"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Timeline /> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <School className="h-8 w-8 mb-2" />
                <CardTitle>Educational Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ana Fii Inni covers all aspects of the education system, from
                  pre-school upwards, ensuring comprehensive data management
                  across all educational levels.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 mb-2" />
                <CardTitle>National Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  With data on over 1 million pupils and 30,000 teachers in more
                  than 3,000 schools, Ana Fii Inni operates on a truly national
                  scale.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 mb-2" />
                <CardTitle>Real-Time Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Utilizing SMS-based reporting, Ana Fii Inni provides real-time
                  updates on attendance and other crucial educational metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="functionality" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Functionality</CardTitle>
              <CardDescription>
                Ana Fii Inni: A multifaceted approach to education management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Enrolment and Attendance Tracking
                  </AccordionTrigger>
                  <AccordionContent>
                    Ana Fii Inni provides rich data on named individual pupils
                    and teachers, ensuring accurate enrolment and attendance
                    tracking. This granular approach allows for precise
                    management and analysis of educational data.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Real-Time Attendance Reporting
                  </AccordionTrigger>
                  <AccordionContent>
                    Schools can report attendance data via SMS, which is
                    automatically parsed and presented in real-time. This
                    immediate feedback loop allows for quick interventions and
                    improved educational management.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    School Infrastructure Management
                  </AccordionTrigger>
                  <AccordionContent>
                    The system maintains a wide range of physical school
                    information, including mapping and infrastructure details.
                    This comprehensive view aids in resource allocation and
                    development planning.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    School Budgeting and Reporting Tool
                  </AccordionTrigger>
                  <AccordionContent>
                    Ana Fii Inni integrates information on governance,
                    development plans, and budgets of individual schools. It
                    also manages the approval and accountability processes for
                    School Capitation Grants.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Cash Transfer Management</AccordionTrigger>
                  <AccordionContent>
                    The system handles the enrolment, validation, approval,
                    payment execution, and accountability for Cash Transfers to
                    individual pupils, currently focusing on girls from Primary
                    5 to Secondary 4.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>Comprehensive Reporting</AccordionTrigger>
                  <AccordionContent>
                    Ana Fii Inni provides Output/Outcome/Impact Reporting,
                    including live updates of progress against logical framework
                    milestones, enabling data-driven decision-making at all
                    levels.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How Ana Fii Inni Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Uses text-based reporting into an online database
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Allows users at school, state, and national levels to see
                      instant reports
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Scalable system designed for nationwide implementation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Covers more than 3,400 primary schools across South Sudan
                    </li>
                  </ul>
                </div>
                <div className="relative  md:h-full"></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                Ana Fii Inni&rsquo;s Impact on Education in South Sudan
              </CardTitle>
              <CardDescription>
                Transforming education management and improving access to
                quality education
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Data Coverage and Timeliness
                  </h3>
                  <Progress value={90} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Over 90% of enrolment data uploaded and available by end of
                    June 2015
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    School Participation
                  </h3>
                  <Progress value={60} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    More than 2,000 schools have made attendance reports by SMS
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <InteractiveMap />

          <Card>
            <CardHeader>
              <CardTitle>Success Stories</CardTitle>
              <CardDescription>
                Real-world examples of Ana Fii Inni&rsquo;s impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col space-y-2">
                      <h4 className="font-semibold">Success Story {i}</h4>
                      <p className="text-sm text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                      </p>
                      <Badge>Impact Area {i}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Testimonials />
        </TabsContent>

        <TabsContent value="gess" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                Girls&rsquo; Education South Sudan (GESS) Programme
              </CardTitle>
              <CardDescription>
                Transforming a generation of South Sudanese girls through
                education
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-4">
                    Girls&rsquo; Education South Sudan (GESS) is a six-year
                    programme that runs from April 2013 to September 2018. Its
                    primary aim is to transform the lives of a generation of
                    South Sudanese girls by increasing their access to quality
                    education.
                  </p>
                  <p className="mb-4">
                    In South Sudan, the world&rsquo;s newest country,
                    educational indicators are among the lowest globally, with
                    girls&rsquo; education being particularly challenged. Only
                    one in ten girls completes primary education, and girls make
                    up just one-third of the secondary school population.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        "https://www.girlseducationsouthsudan.org",
                        "_blank"
                      )
                    }
                  >
                    Learn More About GESS
                  </Button>
                </div>
                <div className="relative h-64 md:h-full">
                  <Image
                    src="/img/banners/banner2.jpg"
                    alt="Ana Fii Inni System Diagram"
                    layout="fill"
                    objectFit=""
                    className="rounded-lg h-[300px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GESS Programme Activities</CardTitle>
              <CardDescription>
                Tackling barriers to girls&rsquo; education in South Sudan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <Radio className="h-8 w-8 mb-2" />
                    <CardTitle>Community Awareness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Enhancing household and community awareness through radio
                      programmes and community outreach to support girls&rsquo;
                      education.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Coins className="h-8 w-8 mb-2" />
                    <CardTitle>Financial Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Providing cash transfers to girls and their families, as
                      well as capitation grants to schools to improve access to
                      education.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <GraduationCap className="h-8 w-8 mb-2" />
                    <CardTitle>Quality Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Offering practical support to schools, teachers, and
                      education managers to enhance the quality of education
                      provided.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="future" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Future Vision for Ana Fii Inni</CardTitle>
              <CardDescription>
                Expanding our impact and reaching new horizons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[250px]">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Our Goals for the Future
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Expand coverage to all schools in South Sudan
                    </li>
                    <li className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-primary" />
                      Enhance data analytics for better decision-making
                    </li>
                    <li className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Increase community engagement and participation
                    </li>
                    <li className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      Integrate with other educational initiatives
                    </li>
                  </ul>
                </div>
                <div className="relative h-64 md:h-full">
                  <Image
                    src="/img/banners/banner3.jpg"
                    alt="Ana Fii Inni System Diagram"
                    layout="fill"
                    objectFit=""
                    className="rounded-lg h-[300px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Features and Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Mobile App Development</h4>
                  <Progress value={60} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Estimated release: Q3 2024
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Advanced Analytics Dashboard
                  </h4>
                  <Progress value={40} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Estimated release: Q4 2024
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Offline Mode for Remote Areas
                  </h4>
                  <Progress value={20} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Estimated release: Q2 2025
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Involved</CardTitle>
              <CardDescription>
                Join us in shaping the future of education in South Sudan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" /> Attend Our Next Webinar
                </Button>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" /> Join Our Community Forum
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find answers to common questions about Ana Fii Inni
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FAQ />
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Stay Updated</CardTitle>
          <CardDescription>
            Subscribe to our newsletter for the latest updates on Ana Fii Inni
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
