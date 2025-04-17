"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, ExternalLink, Github, Twitter, Linkedin, ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UnderConstruction() {
  const { toast } = useToast()
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [progress, setProgress] = useState(0)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate total seconds for 3 days
  const totalSeconds = 3 * 24 * 60 * 60

  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 3)

    const interval = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(interval)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setProgress(100)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })

      // Calculate progress (inverted - starts at 0, ends at 100)
      const elapsedSeconds = totalSeconds - (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds)
      const currentProgress = (elapsedSeconds / totalSeconds) * 100
      setProgress(currentProgress)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      setEmail("")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80 z-0" />

      {/* Animated background patterns */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern" />
      </div>

      {/* Animated circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/5"
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div className="container max-w-6xl px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Left column - Illustration */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative aspect-square h-full max-w-md mx-auto">
              {/* <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Under Construction Illustration"
                width={500}
                height={500}
                className="object-contain" 
              /> */}
                 <Image
                        src="/img/banners/banner4.jpg"
                        alt="Juba Model Primary School"
                        fill
                        priority
                        className="object-cover h-full w-full"
                        
                      />

              {/* Floating badges */}
              <motion.div
                className="absolute top-10 right-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm shadow-sm">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    In Progress
                  </span>
                </Badge>
              </motion.div>

              <motion.div
                className="absolute bottom-10 left-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm shadow-sm">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    Coming Soon
                  </span>
                </Badge>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Content */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Badge variant="secondary" className="mb-2">
                    Coming Soon
                  </Badge>
                </motion.div>
                <motion.h1
                  className="text-4xl md:text-5xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  We&apos;re building something <span className="text-primary">exceptional</span>
                </motion.h1>
                <motion.p
                  className="text-muted-foreground text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  This module is under construction. We&apos;re working hard to bring you an amazing experience.
                </motion.p>
              </div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Launch Progress</span>
                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-4 gap-4">
                      <CountdownItem value={timeLeft.days} label="Days" />
                      <CountdownItem value={timeLeft.hours} label="Hours" />
                      <CountdownItem value={timeLeft.minutes} label="Minutes" />
                      <CountdownItem value={timeLeft.seconds} label="Seconds" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="updates">Get Updates</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">What to expect</h3>
                      <ul className="space-y-2">
                        {[
                          "A completely redesigned user interface",
                          "Powerful new features and integrations",
                          "Enhanced performance and reliability",
                          "Comprehensive documentation and support",
                        ].map((item, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 + i * 0.1 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="#" className="flex items-center gap-1">
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="#" className="flex items-center gap-1">
                          <Twitter className="h-4 w-4" />
                          <span>Twitter</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="#" className="flex items-center gap-1">
                          <Linkedin className="h-4 w-4" />
                          <span>LinkedIn</span>
                        </Link>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="updates" className="space-y-4 mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Be the first to know when we launch</h3>
                        <p className="text-sm text-muted-foreground">
                          We&apos;ll notify you as soon as we're ready. No spam, just important updates.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <ArrowRight className="h-4 w-4 mr-2" />
                          )}
                          Notify Me
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        By subscribing, you agree to our{" "}
                        <Link href="#" className="underline underline-offset-2 hover:text-primary">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Separator className="mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-semibold text-primary">C</span>
              </div>
              <span className="font-medium">SAMS Inc.</span>
            </div>

            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SAMS Inc. All rights reserved.
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Website</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </motion.div>
              <span>Thank you for subscribing!</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              We&apos;ve added your email to our notification list. We&apos;ll let you know as soon as we launch. In the meantime,
              follow us on social media for more updates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it, thanks!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function CountdownItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full">
        <div className="flex h-20 items-center justify-center rounded-lg bg-primary/5 backdrop-blur-sm border border-primary/10 font-mono text-3xl font-semibold">
          {value.toString().padStart(2, "0")}
        </div>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute inset-0 rounded-lg border border-primary/20 opacity-0"
        />
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  )
}
