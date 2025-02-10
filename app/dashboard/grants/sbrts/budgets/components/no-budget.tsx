import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, HelpCircle, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewBudgetBreadcrumb } from "./breadcrumb";
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

interface EmptyStateProps {
  code: string;
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export function NoBudget({
  code,
  selectedYear,
  onYearChange,
}: EmptyStateProps) {
  const router = useRouter();
  const currentYear = new Date().getFullYear() + 1;
  const years = Array.from({ length: currentYear - 2014 + 1 }, (_, i) =>
    String(currentYear - i)
  );
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

  const handleYearChange = (year: string) => {
    onYearChange(year);
    router.push(`/dashboard/grants/sbrts/budgets/${code}/${year}`);
  };

  return (
    <div className="px-4 py-6 bg-gradient-to-b from-primary/20 to-background min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <ViewBudgetBreadcrumb code={code} name="" />
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
          <CalendarIcon className="w-16 h-16 text-primary" />
        </motion.div>
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold tracking-tight mb-4"
        >
          No Budget Data Available for {selectedYear}
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-muted-foreground mb-8 text-lg"
        >
          We couldn&apos;t find any budget information for the selected year.
          This could be because:
        </motion.p>
        <motion.ul
          variants={itemVariants}
          className="list-disc text-left mb-8 space-y-2"
        >
          <li>The budget for this year hasn&apos;t been submitted yet</li>
          <li>There was an error in data processing</li>
          <li>The selected year is outside the range of available data</li>
        </motion.ul>
        <motion.div variants={itemVariants} className="flex gap-4 mb-8">
          <Button
            variant="default"
            onClick={() => handleYearChange(String(currentYear))}
          >
            View Current Year
          </Button>
          <Button
            variant="outline"
            onClick={() => handleYearChange(String(currentYear - 1))}
          >
            View Previous Year
          </Button>
        </motion.div>

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
              <CardDescription>
                Here are some steps you can take:
              </CardDescription>
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
                    <li>Check if you&lsquo;ve selected the correct year</li>
                    <li>Verify if the budget submission deadline has passed</li>
                    <li>Contact the finance department for more information</li>
                    <li>
                      Check for any system-wide notifications about data
                      availability
                    </li>
                  </ol>
                  <Separator className="my-4" />
                </motion.div>
              )}
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-sm">
                  Tip
                </Badge>
                <span className="text-sm text-muted-foreground">
                  You can always check other years using the dropdown above
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
            Last updated: {new Date().toLocaleDateString()} |
            <Button variant="link" className="p-0 h-auto text-sm">
              <FileText className="h-4 w-4 mr-1 inline" />
              View Change Log
            </Button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
