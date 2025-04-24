
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp } from "lucide-react";

interface TotalEnrollmentCardProps {
  totalEnrollment: number;
  currentYearTotal: number;
  yearOverYearGrowth: number;
}

export const TotalEnrollmentCard = ({ 
  totalEnrollment,
  currentYearTotal,
  yearOverYearGrowth
}: TotalEnrollmentCardProps) => (
  <Card className="p-6 space-y-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground font-medium">Total Enrollment</span>
      <span className="text-primary p-2 bg-primary/10 rounded-full">
        <Users className="w-5 h-5" />
      </span>
    </div>
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold tracking-tight">{totalEnrollment?.toLocaleString()}</h2>
        <span className={`flex items-center text-sm ${yearOverYearGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {yearOverYearGrowth >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />}
          {Math.abs(yearOverYearGrowth).toFixed(2)}%
        </span>
      </div>
      <p className="text-muted-foreground text-sm">Overall Learners Enrollment</p>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Current Year</p>
          <p className="text-sm font-medium">{currentYearTotal?.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Promoted</p>
          <p className="text-sm font-medium">{(totalEnrollment - currentYearTotal)?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </Card>
);
