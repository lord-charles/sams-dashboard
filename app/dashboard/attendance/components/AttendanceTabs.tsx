"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "./overview";
import { BarChart3, School } from "lucide-react";
import SchoolsTable from "../school-table/schools";
import LearnersTable from "../learner-table/leaners";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import { Backdrop } from "@mui/material";
import { Spinner } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import SchoolsTableWithAttendance from "../school-table-attendance/schools";

export default function AttendanceTabs({ statsData, schoolsData, schoolsWithAttendance }: { statsData: any, schoolsData: any, schoolsWithAttendance: any }) {
  const [showLearners, setShowLearners] = React.useState(false);
  const [learners, setLearners] = React.useState([]);
  const [code, setCode] = React.useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [absenceReason, setAbsenceReason] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(urlTab);


  function renderSchoolsContent() {
    if (!showLearners) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="schools-table"
            className="bg-white rounded-lg shadow-sm border p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <SchoolsTable
              schools={schoolsData}
              setShowLearners={setShowLearners}
              setCode={setCode}
            />
          </motion.div>
        </AnimatePresence>
      );
    } else if (uniqueClasses.length === 0) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="learners-table-all"
            className="bg-white rounded-lg shadow-sm border p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <LearnersTable
              learners={learners}
              setShowLearners={setShowLearners}
              setLearners={setLearners}
              date={date}
              setDate={setDate}
              handlePresent={handlePresent}
            />
          </motion.div>
        </AnimatePresence>
      );
    } else {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="learners-table-tabs"
            className="bg-white rounded-lg shadow-sm border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Tabs value={activeClass} onValueChange={(val) => { setActiveClass(val); setClassId(val); }} className="w-full">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Classes</h2>
                  <TabsList className="bg-gray-50/50 border rounded-full p-1">
                    {uniqueClasses.map((cls) => (
                      <TabsTrigger
                        key={cls}
                        value={cls}
                        className="capitalize px-4 py-2 rounded-full font-medium text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground hover:text-foreground"
                      >
                        {cls}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
              <div className="p-2">
                {uniqueClasses.map((cls) => (
                  <TabsContent key={cls} value={cls} className="mt-0">
                    <LearnersTable
                      learners={learners.filter((l: any) => l.class === cls)}
                      setShowLearners={setShowLearners}
                      setSelectedIds={setSelectedIds}
                      selectedIds={selectedIds}
                      markStudentsAbsent={(reason) => {
                        setAbsenceReason(reason);
                        markStudentsAbsent(reason);
                      }}
                      handlePresent={handlePresent}
                      setLearners={setLearners}
                      date={date}
                      setDate={setDate}
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      );
    }
  }

  function renderSchoolsWithAttendance() {
    if (!showLearners) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="schools-table"
            className="bg-white rounded-lg shadow-sm border p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <SchoolsTableWithAttendance schools={schoolsWithAttendance || []} setShowLearners={setShowLearners} setCode={setCode}

            />
          </motion.div>
        </AnimatePresence>
      );
    } else if (uniqueClasses.length === 0) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="learners-table-all"
            className="bg-white rounded-lg shadow-sm border p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <LearnersTable
              learners={learners}
              setShowLearners={setShowLearners}
              setLearners={setLearners}
              date={date}
              handlePresent={handlePresent}
              setDate={setDate}
            />
          </motion.div>
        </AnimatePresence>
      );
    } else {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="learners-table-tabs"
            className="bg-white rounded-lg shadow-sm border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Tabs value={activeClass} onValueChange={(val) => { setActiveClass(val); setClassId(val); }} className="w-full">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Classes</h2>
                  <TabsList className="bg-gray-50/50 border rounded-full p-1">
                    {uniqueClasses.map((cls) => (
                      <TabsTrigger
                        key={cls}
                        value={cls}
                        className="capitalize px-4 py-2 rounded-full font-medium text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground hover:text-foreground"
                      >
                        {cls}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
              <div className="p-2">
                {uniqueClasses.map((cls) => (
                  <TabsContent key={cls} value={cls} className="mt-0">
                    <LearnersTable
                      learners={learners.filter((l: any) => l.class === cls)}
                      setShowLearners={setShowLearners}
                      setSelectedIds={setSelectedIds}
                      selectedIds={selectedIds}
                      markStudentsAbsent={markStudentsAbsent}
                      handlePresent={handlePresent}
                      setLearners={setLearners}
                      date={date}
                      setDate={setDate}
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      );
    }
  }



  // Sync state to URL changes (e.g., browser navigation)
  React.useEffect(() => {
    if (urlTab !== activeTab) setActiveTab(urlTab);
  }, [urlTab]);

  // When tab changes, update URL
  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setShowLearners(false);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", val);
    router.replace(`?${params.toString()}`);
  };
  // Extract and sort unique classes from learners (always up-to-date)
  const uniqueClasses = Array.from(
    new Set(
      learners
        .map((l: any) => l.class)
        .filter((cls) => cls !== null && cls !== undefined && cls !== "")
    )
  ).sort((a, b) => a.localeCompare(b));
  const [activeClass, setActiveClass] = React.useState(uniqueClasses[0] || "");
  React.useEffect(() => {
    if (uniqueClasses.length > 0) (setActiveClass(uniqueClasses[0]), setClassId(uniqueClasses[0]))
  }, [learners]);

  const getLearners = async () => {
    try {
      setIsLoading(true);
      const newDate = new Date(date);

      const response = await axios.post(
        `${base_url}attendance/getStudentsAttendance`,
        {
          code, isDroppedOut: false,
          attendanceDate: newDate,
        }
      );
      setLearners(response.data);
    } catch (error) {
      // Optionally handle error
      setLearners([]);
      console.error("Failed to fetch learners", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!code) {
      setLearners([]);
      setShowLearners(false);
      return;
    }

    let isMounted = true;
    setShowLearners(true);

    const fetchLearners = async () => {
      try {
        setIsLoading(true);
        const newDate = new Date(date);

        const response = await axios.post(
          `${base_url}attendance/getStudentsAttendance`,
          {
            code, isDroppedOut: false,
            attendanceDate: newDate,
          }
        );
        if (isMounted) setLearners(response.data);
      } catch (error) {
        // Optionally handle error
        if (isMounted) setLearners([]);
        console.error("Failed to fetch learners", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearners();

    return () => {
      isMounted = false;
    };
  }, [code]);

  const markStudentsAbsent = async (reason: string) => {
    try {
      setIsLoading(true);

      const res = await axios.post(`${base_url}attendance/markAttendanceBulk`, {
        studentIds: selectedIds,
        date,
        absenceReason: reason,
        classId,
        code
      });
      if (res.data?.message === 'Attendance marked successfully') {

        const newDate = new Date(date);

        newDate.setHours(newDate.getHours() + 3);

        const res = await axios.post(
          `${base_url}attendance/getStudentsAttendance`,
          {
            code,
            isDroppedOut: false,
            attendanceDate: newDate,
          },
        );

        setLearners(res.data);
        setDate(newDate);
        setAbsenceReason(null);
        setSelectedIds([]);
        getLearners();

        toast({
          title: "Success",
          description: "Attendance marked successfully",
          variant: "success",
        });


      }
    } catch (error: any) {
      console.log(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresent = async () => {
    try {
      console.log("handlePresent");
      setIsLoading(true);

      const res = await axios.post(
        `${base_url}attendance/markPresentAttendance`,
        {
          studentIds: selectedIds,
          date,
        },
      );

      if (res.data?.success) {

        const newDate = new Date(date);

        newDate.setHours(newDate.getHours() + 3);

        const res = await axios.post(
          `${base_url}attendance/getStudentsAttendance`,
          {
            code,
            isDroppedOut: false,
            attendanceDate: newDate,
          },
        );

        setLearners(res.data);
        setDate(newDate);
        setSelectedIds([]);

        toast({
          title: "Success",
          description: "Attendance marked successfully",
          variant: "success",
        });
      }
    } catch (error: any) {
      console.log(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full">

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
          <TabsTrigger value="overview" className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="schools" className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
            <span className="flex items-center gap-2">
              <School className="h-4 w-4" />
              <span>Schools</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="schools-with-attendance" className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary">
            <span className="flex items-center gap-2">
              <School className="h-4 w-4" />
              <span>Schools With Attendance</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview statsData={statsData} />
        </TabsContent>

        <TabsContent value="schools">
          <div className="flex-1">
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
            >
              <Spinner color="primary" size="lg" />
            </Backdrop>
            {renderSchoolsContent()}

          </div>
        </TabsContent>
        <TabsContent value="schools-with-attendance">
          <div className="flex-1">
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
            >
              <Spinner color="primary" size="lg" />
            </Backdrop>
            {renderSchoolsWithAttendance()}

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
