"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Lock,
  Key,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  BarChart,
  PieChart,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart as RechartsPieChart, Pie, Cell, Legend } from "recharts";

const securityMeasures = [
  { name: "Two-Factor Authentication", icon: Shield, value: 80 },
  { name: "Password Strength", icon: Lock, value: 65 },
  { name: "Data Encryption", icon: Key, value: 90 },
  { name: "Regular Security Audits", icon: Search, value: 70 },
  { name: "Access Control", icon: Lock, value: 85 },
  { name: "Network Security", icon: Shield, value: 75 },
];

const initialSecurityEvents = [
  {
    id: 1,
    event: "Failed Login Attempt",
    user: "john@example.com",
    date: "2023-06-01",
    action: "Account Locked",
    severity: "high",
  },
  {
    id: 2,
    event: "Password Changed",
    user: "jane@example.com",
    date: "2023-05-30",
    action: "Logged",
    severity: "low",
  },
  {
    id: 3,
    event: "New Device Login",
    user: "bob@example.com",
    date: "2023-05-29",
    action: "Verified",
    severity: "medium",
  },
  {
    id: 4,
    event: "Unusual Data Access",
    user: "alice@example.com",
    date: "2023-05-28",
    action: "Investigated",
    severity: "high",
  },
  {
    id: 5,
    event: "Security Policy Update",
    user: "admin@example.com",
    date: "2023-05-27",
    action: "Implemented",
    severity: "low",
  },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

const ComplianceComponent = () => {
  const [complianceScore, setComplianceScore] = useState(75);
  const [showSecurityAuditDialog, setShowSecurityAuditDialog] = useState(false);
  const [securityEvents, setSecurityEvents] = useState(initialSecurityEvents);
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulated real-time updates
    const interval = setInterval(() => {
      setSecurityEvents((prev) => [
        {
          id: Date.now(),
          event: "Automated System Check",
          user: "system",
          date: new Date().toISOString().split("T")[0],
          action: "Completed",
          severity: "low",
        },
        ...prev.slice(0, 9),
      ]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleComplianceScoreChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newScore = parseInt(event.target.value, 10);
    if (!isNaN(newScore) && newScore >= 0 && newScore <= 100) {
      setComplianceScore(newScore);
    }
  };

  const triggerSecurityAudit = () => {
    setShowSecurityAuditDialog(true);
    setIsLoading(true);
    // Simulated audit process
    setTimeout(() => {
      setShowSecurityAuditDialog(false);
      setIsLoading(false);
      setComplianceScore((prev) => Math.min(100, prev + 5));
      setSecurityEvents((prev) => [
        {
          id: Date.now(),
          event: "Security Audit Completed",
          user: "system",
          date: new Date().toISOString().split("T")[0],
          action: "Improvements Suggested",
          severity: "medium",
        },
        ...prev,
      ]);
    }, 3000);
  };

  const renderSeverityBadge = (severity: string) => {
    const severityMap = {
      low: { color: "bg-green-500", icon: CheckCircle },
      medium: { color: "bg-yellow-500", icon: AlertTriangle },
      high: { color: "bg-red-500", icon: XCircle },
    };
    const { color, icon: Icon } =
      severityMap[severity as keyof typeof severityMap];
    return (
      <Badge variant="outline" className={`${color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const securityEventsByType = securityEvents.reduce((acc, event) => {
    acc[event.event] = (acc[event.event] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(securityEventsByType).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Compliance and Security Management
        </CardTitle>
        <CardDescription>
          Comprehensive monitoring and management of compliance and security
          measures for SAMS
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security-measures">
              Security Measures
            </TabsTrigger>
            <TabsTrigger value="events">Security Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Progress value={complianceScore} className="w-full" />
                    <span className="text-2xl font-bold">
                      {complianceScore}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {complianceScore}% of system components are fully compliant
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="complianceScore">
                      Update Compliance Score:
                    </Label>
                    <Input
                      id="complianceScore"
                      type="number"
                      min="0"
                      max="100"
                      value={complianceScore}
                      onChange={handleComplianceScoreChange}
                      className="w-20"
                    />
                  </div>
                </CardFooter>
              </Card>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Security Recommendation</AlertTitle>
                <AlertDescription>
                  Implement additional security training for users and enhance
                  data encryption protocols to improve overall compliance.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          <TabsContent value="security-measures">
            <Card>
              <CardHeader>
                <CardTitle>Security Measures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityMeasures.map((measure, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2">
                              <measure.icon className="h-4 w-4" />
                              <span>{measure.name}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click for detailed report on {measure.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Progress
                        value={measure.value}
                        className="w-1/2 ml-auto"
                      />
                      <span className="text-sm font-medium">
                        {measure.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={triggerSecurityAudit}>
                  <Search className="w-4 h-4 mr-2" />
                  Initiate Comprehensive Security Audit
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>
                  Real-time monitoring of security-related activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action Taken</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {securityEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>{event.event}</TableCell>
                          <TableCell>{event.user}</TableCell>
                          <TableCell>{event.date}</TableCell>
                          <TableCell>{event.action}</TableCell>
                          <TableCell>
                            {renderSeverityBadge(event.severity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Info className="w-4 h-4 mr-2" />
                  View Full Event Log
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Events
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Events Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Security Measures Effectiveness</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={securityMeasures}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <Dialog
        open={showSecurityAuditDialog}
        onOpenChange={setShowSecurityAuditDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comprehensive Security Audit in Progress</DialogTitle>
            <DialogDescription>
              Please wait while we perform a thorough security audit of the
              system. This process may take several minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
          <DialogFooter>
            <Button disabled={isLoading}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ComplianceComponent;
