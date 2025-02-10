"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, FileSpreadsheet, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No data available",
  description = "Start by selecting OPEX or CAPEX group type above to begin adding your data.",
  actionLabel = "Add First Entry",
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="w-full mt-8 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-muted-foreground">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <BarChart3 className="w-12 h-12 opacity-20" />
              <FileSpreadsheet className="w-8 h-8 absolute -bottom-2 -right-2" />
            </div>
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <Button onClick={onAction} className="group relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
          <motion.div
            className="absolute inset-0 bg-primary/10"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
