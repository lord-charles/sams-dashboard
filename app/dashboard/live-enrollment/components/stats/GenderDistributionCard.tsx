
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users2 } from "lucide-react";

interface GenderDistributionCardProps {
  maleCount: number;
  femaleCount: number;
  malePercentage: number;
}

export const GenderDistributionCard = ({ 
  maleCount,
  femaleCount,
  malePercentage
}: GenderDistributionCardProps) => (
  <Card className="p-6 space-y-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground font-medium">Gender Distribution</span>
      <span className="text-primary p-2 bg-primary/10 rounded-full">
        <Users2 className="w-5 h-5" />
      </span>
    </div>
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
      <h2 className="text-3xl font-bold tracking-tight">
  {(() => {
    if (maleCount === 0 || femaleCount === 0) return "N/A";
    // Always show as 1 : N or N : 1
    if (maleCount <= femaleCount) {
      const ratio = (femaleCount / maleCount).toFixed(1);
      return `1 : ${ratio}`;
    } else {
      const ratio = (maleCount / femaleCount).toFixed(1);
      return `${ratio} : 1`;
    }
  })()}
</h2>
      </div>
      <p className="text-muted-foreground text-sm">Male to female ratio</p>
      <Progress value={malePercentage} className="h-2" />
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Male Students</p>
          <p className="text-sm font-medium">{maleCount?.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Female Students</p>
          <p className="text-sm font-medium">{femaleCount?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </Card>
);
