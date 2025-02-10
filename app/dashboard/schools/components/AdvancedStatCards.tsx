import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { School, UserPlus, Lock, Unlock, TrendingUp } from "lucide-react";

export default function AdvancedStatCards() {
  const stats = [
    {
      title: "Total Schools",
      value: 8871,
      description: "Across all regions",
      icon: <School className="h-4 w-4 text-blue-600" />,
      change: 5.2,
      progress: 100,
    },
    {
      title: "New Admissions",
      value: 863935,
      description: "Last 30 days",
      icon: <UserPlus className="h-4 w-4 text-green-600" />,
      change: 12.5,
      progress: 70,
    },
    {
      title: "Closed Schools",
      value: 145,
      description: "This academic year",
      icon: <Lock className="h-4 w-4 text-red-600" />,
      change: -2.3,
      progress: 10,
    },
    {
      title: "Newly Opened Schools",
      value: 41,
      description: "This academic year",
      icon: <Unlock className="h-4 w-4 text-purple-600" />,
      change: 8.1,
      progress: 20,
    },
    {
      title: "Enrollment Growth",
      value: "7.2%",
      description: "Year-over-year increase",
      icon: <TrendingUp className="h-4 w-4 text-yellow-600" />,
      change: 1.5,
      progress: 60,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <div className="mt-4">
              <Progress value={stat.progress} className="h-2 " />
              <p className="mt-2 text-xs text-muted-foreground flex items-center">
                <span
                  className={
                    stat.change > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change > 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                </span>
                <span className="ml-1">from last period</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
