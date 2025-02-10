"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useSearchParams } from "next/navigation";

interface BudgetData {
  totalBudget: number;
  totalRevenue: number;
  currency: string;
}

export function SubmitBudgetDialog({
  budgetData,
  allSectionsReviewed,
  onSubmit,
  isLoading,
}: {
  budgetData: BudgetData;
  allSectionsReviewed: boolean;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const difference = budgetData.totalRevenue - budgetData.totalBudget;
  const isOverBudget = difference < 0;
  const utilizationPercentage =
    (budgetData.totalBudget / budgetData.totalRevenue) * 100;
  const formattedUtilization = utilizationPercentage.toFixed(1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!allSectionsReviewed}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            allSectionsReviewed
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {allSectionsReviewed ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {searchParams?.get("edit") === null
                ? "Submit Budget"
                : "Update Budget"}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Review All Sections
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#7C3AED]" />
            Budget Submission Review
          </DialogTitle>
          <DialogDescription>
            Please carefully review the budget analysis before final submission
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Budget Status Card */}
          <Card
            className={`border-l-4 ${
              isOverBudget ? "border-l-red-500" : "border-l-green-500"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Budget Status</h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    isOverBudget
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isOverBudget ? "Over Budget" : "Under Budget"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    {budgetData.currency}{" "}
                    {budgetData.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    {budgetData.currency}{" "}
                    {budgetData.totalBudget.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utilization Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Budget Utilization</h3>
              <span
                className={`flex items-center gap-1 ${
                  utilizationPercentage > 100
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {utilizationPercentage > 100 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {formattedUtilization}%
              </span>
            </div>
            <Progress
              value={utilizationPercentage}
              className={`h-2 ${
                utilizationPercentage > 100 ? "[&>div]:bg-red-500" : ""
              }`}
            />
            <p className="text-sm text-muted-foreground">
              {utilizationPercentage > 100
                ? "Budget exceeds available revenue"
                : "Budget is within available revenue"}
            </p>
          </div>

          {/* Difference Summary */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg ${
              isOverBudget ? "bg-red-50" : "bg-green-50"
            }`}
          >
            <div className="flex items-center gap-2">
              {isOverBudget ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
              <span className="font-medium">Difference:</span>
            </div>
            <span
              className={`font-semibold ${
                isOverBudget ? "text-red-600" : "text-green-600"
              }`}
            >
              {budgetData.currency} {Math.abs(difference).toLocaleString()}
            </span>
          </div>

          {/* Warning Alert */}
          {isOverBudget && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Budget submission is disabled because expenses exceed available
                revenue. Please adjust your budget to proceed.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#7C3AED] hover:bg-[#6D28D9]"
            onClick={() => {
              onSubmit();
              setTimeout(() => {
                setOpen(false);
              }, 3000);
            }}
            disabled={isOverBudget || isLoading}
          >
            {isLoading ? "Submitting.." : "Confirm Submission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
