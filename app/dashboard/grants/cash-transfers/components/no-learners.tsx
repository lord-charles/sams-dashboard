"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  HelpCircle,
  ArrowRight,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

interface NoLearnersProps {
  selectedYear: string;
  selectedTranche: number;
  schoolCode: string;
}

export function NoLearners({
  selectedYear,
  selectedTranche,
  schoolCode,
}: NoLearnersProps) {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleTrancheChange = (tranche: number) => {
    router.push(
      `/dashboard/grants/cash-transfers/learners/${schoolCode}/${tranche}/${selectedYear}`
    );
  };

  return (
    <div className="px-4 py-6 bg-gradient-to-b from-primary/5 to-background ">
      <motion.div
        className="flex flex-col items-center justify-center max-w-3xl mx-auto mt-12 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-8"
        >
          <Users className="w-16 h-16 text-primary" />
        </motion.div>
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold tracking-tight mb-4"
        >
          No Learners Data Available
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-muted-foreground mb-8 text-lg"
        >
          We couldn&apos;t find any learners for Tranche {selectedTranche} in{" "}
          {selectedYear}
        </motion.p>
        <motion.ul
          variants={itemVariants}
          className="list-disc text-left mb-8 space-y-2"
        >
          <li>
            The cash transfer for this tranche hasn&apos;t been processed yet
          </li>
          <li>No learners were enrolled for this period</li>
          <li>There might be a delay in data synchronization</li>
        </motion.ul>

        <motion.div variants={itemVariants}>
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Need Help?
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowHelp(!showHelp)}
                      >
                        <HelpCircle className="h-5 w-5" />
                        <span className="sr-only">Toggle help information</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click for more information</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription>Here&apos;s what you can do:</CardDescription>
            </CardHeader>
            <CardContent>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ol className="list-decimal list-inside space-y-2 mb-4">
                    <li>Verify the selected tranche and year</li>
                    <li>Check if learner enrollment is complete</li>
                    <li>Contact the school administration</li>
                    <li>Verify cash transfer processing status</li>
                  </ol>
                  <Separator className="my-4" />
                </motion.div>
              )}
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-sm">
                  Tip
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Try selecting a different tranche or year
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" className="text-primary">
                Contact Support
              </Button>
              <Button variant="ghost" className="text-primary">
                View Documentation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <p className="text-sm text-muted-foreground">
            Last checked: {new Date().toLocaleDateString()} |{" "}
            <Button variant="link" className="p-0 h-auto text-sm">
              <FileText className="h-4 w-4 mr-1 inline" />
              View System Status
            </Button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
