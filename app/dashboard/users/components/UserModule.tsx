"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { MoreHorizontal, Calendar as CalendarIcon } from "lucide-react";
import ActivityComponent from "./Activity";
import SettingsComponent from "./settings";
import ComplianceComponent from "./compliance";
import RolesComponent from "./roles";

// Enhanced mock data for demonstration
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-05-01T10:00:00Z",
    department: "IT",
    location: "Juba",
    hireDate: "2022-01-15",
    performanceRating: 4.5,
    trainingCompleted: ["Security Basics", "Data Management"],
    groups: ["IT Team", "Management"],
    tags: ["tech-savvy", "team-lead"],
    lastTrainingDate: "2023-04-15",
    complianceStatus: "Up to date",
    twoFactorEnabled: true,
    loginAttempts: 0,
    lastPasswordChange: "2023-03-01",
    notes:
      "Key member of the IT department, responsible for system architecture.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Teacher",
    status: "Active",
    lastLogin: "2023-05-02T09:30:00Z",
    department: "Education",
    location: "Wau",
    hireDate: "2021-08-22",
    performanceRating: 4.2,
    trainingCompleted: ["Classroom Management", "Digital Learning Tools"],
    groups: ["Education Team", "Curriculum Development"],
    tags: ["experienced", "mentor"],
    lastTrainingDate: "2023-03-20",
    complianceStatus: "Review needed",
    twoFactorEnabled: false,
    loginAttempts: 1,
    lastPasswordChange: "2023-02-15",
    notes:
      "Experienced teacher with a focus on integrating technology in the classroom.",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Student",
    status: "Inactive",
    lastLogin: "2023-04-28T14:15:00Z",
    department: "Science",
    location: "Malakal",
    hireDate: "2023-02-01",
    performanceRating: 3.8,
    trainingCompleted: ["Lab Safety", "Research Methods"],
    groups: ["Science Club", "Debate Team"],
    tags: ["researcher", "award-winner"],
    lastTrainingDate: "2023-05-01",
    complianceStatus: "Pending review",
    twoFactorEnabled: true,
    loginAttempts: 0,
    lastPasswordChange: "2023-04-01",
    notes:
      "Promising student researcher, won the national science fair last year.",
  },
  // Add more detailed mock users as needed
];

const roles = ["Admin", "Teacher", "Student", "Parent", "Staff"];
const departments = ["IT", "Education", "Science", "Administration", "Finance"];
const locations = ["Juba", "Wau", "Malakal", "Yambio", "Torit"];
const groups = [
  "IT Team",
  "Management",
  "Education Team",
  "Curriculum Development",
  "Science Club",
  "Debate Team",
];
const tags = [
  "tech-savvy",
  "team-lead",
  "experienced",
  "mentor",
  "researcher",
  "award-winner",
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  department: z.string().min(1, { message: "Please select a department." }),
  location: z.string().min(1, { message: "Please select a location." }),
  hireDate: z.date({ required_error: "Please select a hire date." }),
  performanceRating: z.number().min(0).max(5),
  twoFactorEnabled: z.boolean(),
  bio: z
    .string()
    .max(500, { message: "Bio must not exceed 500 characters." })
    .optional(),
  groups: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export default function AdvancedUserModule(users: any) {
  console.log(users);

  return (
    <Card className="w-full  bg-gradient-to-b from-primary/20 to-background m-auto">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage users, roles, and permissions in SAMS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="w-full ">
          <TabsList className="grid grid-cols-3 bg-muted rounded-full h-18 gap-2">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
            >
              Users
            </TabsTrigger>

            <TabsTrigger
              value="roles"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
            >
              Roles & Permissions
            </TabsTrigger>
            {/* <TabsTrigger
              value="compliance"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
            >
              Compliance & Security
            </TabsTrigger> */}
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-background"
            >
              System Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="roles">
            <RolesComponent />
          </TabsContent>
          <TabsContent value="users">
            <ActivityComponent users={users.users} />
          </TabsContent>

          {/* <TabsContent value="compliance">
            <ComplianceComponent />
          </TabsContent> */}
          <TabsContent value="settings">
            {/* <SettingsComponent /> */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
