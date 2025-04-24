
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserPlus } from "lucide-react";

interface CurrentYearCardProps {
  totalCurrentYear: number;
  currentYearMale: number;
  currentYearFemale: number;
  percentageOfTotal: number;
}

export const CurrentYearCard = ({ 
  totalCurrentYear,
  currentYearMale,
  currentYearFemale,
  percentageOfTotal
}: CurrentYearCardProps) => {
  const currentYear = new Date().getFullYear();
  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground font-medium">New Learners ({currentYear})</span>
        <span className="text-primary p-2 bg-primary/10 rounded-full">
          <UserPlus className="w-5 h-5" />
      </span>
    </div>
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold tracking-tight">{totalCurrentYear?.toLocaleString()}</h2>
      </div>
      <p className="text-muted-foreground text-sm">New enrollments this year</p>
      <Progress value={percentageOfTotal} className="h-2" />
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">New Males</p>
          <p className="text-sm font-medium">{currentYearMale?.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">New Females</p>
          <p className="text-sm font-medium">{currentYearFemale?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </Card>
  );
};
