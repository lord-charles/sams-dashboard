import React from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const stateData = [
  { state: "EES", learners: 1258 },
  { state: "CES", learners: 1523 },
  { state: "LKS", learners: 987 },
  { state: "RAA", learners: 876 },
  { state: "PAA", learners: 1123 },
  { state: "WES", learners: 1345 },
  { state: "WBG", learners: 1098 },
  { state: "UNS", learners: 987 },
  { state: "AAA", learners: 1456 },
  { state: "JGL", learners: 1678 },
  { state: "WRP", learners: 876 },
  { state: "UTY", learners: 1123 },
  { state: "NBG", learners: 1345 },
];

const chartConfig = {
  learners: {
    label: "Learners",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function OverviewTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learners Receiving Cash Transfers</CardTitle>
        <CardDescription>Distribution across states - 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="10%" height="10%">
            <BarChart accessibilityLayer data={stateData} maxBarSize={80}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="state"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={11}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="learners" fill="#2563eb" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Learners: 156,825 <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing number of learners receiving cash transfers per state
        </div>
      </CardFooter>
    </Card>
  );
}

export default OverviewTab;
