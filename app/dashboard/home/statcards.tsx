import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { School, Users, BookOpen, TrendingUp } from "lucide-react";

interface StateData {
  name: string;
  schools: {
    total: number;
    primary: number;
    secondary: number;
    alp: number;
    asp: number;
  };
  learners: {
    total: number;
    male: number;
    female: number;
    withDisability: number;
  };
  classrooms: {
    total: number;
    permanent: number;
    semiPermanent: number;
    outdoor: number;
  };
  attendance: {
    average: number;
    male: number;
    female: number;
  };
}

export const southSudanStates: StateData[] = [
  {
    name: "AAA",
    schools: { total: 450, primary: 350, secondary: 70, alp: 20, asp: 10 },
    learners: {
      total: 320000,
      male: 160000,
      female: 160000,
      withDisability: 4500,
    },
    classrooms: {
      total: 1800,
      permanent: 1100,
      semiPermanent: 500,
      outdoor: 200,
    },
    attendance: { average: 81, male: 83, female: 79 },
  },
  {
    name: "CES",
    schools: { total: 523, primary: 400, secondary: 80, alp: 30, asp: 13 },
    learners: {
      total: 350000,
      male: 180000,
      female: 170000,
      withDisability: 5000,
    },
    classrooms: {
      total: 2000,
      permanent: 1200,
      semiPermanent: 600,
      outdoor: 200,
    },
    attendance: { average: 85, male: 87, female: 83 },
  },
  {
    name: "EES",
    schools: { total: 490, primary: 380, secondary: 75, alp: 25, asp: 10 },
    learners: {
      total: 340000,
      male: 170000,
      female: 170000,
      withDisability: 4000,
    },
    classrooms: {
      total: 1900,
      permanent: 1000,
      semiPermanent: 700,
      outdoor: 200,
    },
    attendance: { average: 83, male: 85, female: 81 },
  },
  {
    name: "JGL",
    schools: { total: 620, primary: 450, secondary: 100, alp: 50, asp: 20 },
    learners: {
      total: 400000,
      male: 210000,
      female: 190000,
      withDisability: 7000,
    },
    classrooms: {
      total: 2200,
      permanent: 1300,
      semiPermanent: 700,
      outdoor: 200,
    },
    attendance: { average: 78, male: 80, female: 76 },
  },
  {
    name: "LKS",
    schools: { total: 510, primary: 400, secondary: 70, alp: 30, asp: 10 },
    learners: {
      total: 330000,
      male: 170000,
      female: 160000,
      withDisability: 4500,
    },
    classrooms: {
      total: 1800,
      permanent: 1100,
      semiPermanent: 500,
      outdoor: 200,
    },
    attendance: { average: 82, male: 84, female: 80 },
  },
  {
    name: "NBG",
    schools: { total: 480, primary: 370, secondary: 70, alp: 30, asp: 10 },
    learners: {
      total: 310000,
      male: 150000,
      female: 160000,
      withDisability: 3500,
    },
    classrooms: {
      total: 1700,
      permanent: 1000,
      semiPermanent: 500,
      outdoor: 200,
    },
    attendance: { average: 80, male: 82, female: 78 },
  },
  {
    name: "PAA",
    schools: { total: 540, primary: 420, secondary: 90, alp: 20, asp: 10 },
    learners: {
      total: 370000,
      male: 190000,
      female: 180000,
      withDisability: 5500,
    },
    classrooms: {
      total: 2000,
      permanent: 1200,
      semiPermanent: 600,
      outdoor: 200,
    },
    attendance: { average: 84, male: 86, female: 82 },
  },
  {
    name: "RAA",
    schools: { total: 500, primary: 400, secondary: 80, alp: 15, asp: 5 },
    learners: {
      total: 340000,
      male: 170000,
      female: 170000,
      withDisability: 5000,
    },
    classrooms: {
      total: 1900,
      permanent: 1100,
      semiPermanent: 600,
      outdoor: 200,
    },
    attendance: { average: 82, male: 84, female: 80 },
  },
  {
    name: "UNS",
    schools: { total: 460, primary: 350, secondary: 70, alp: 25, asp: 15 },
    learners: {
      total: 320000,
      male: 160000,
      female: 160000,
      withDisability: 4000,
    },
    classrooms: {
      total: 1800,
      permanent: 1100,
      semiPermanent: 500,
      outdoor: 200,
    },
    attendance: { average: 80, male: 82, female: 78 },
  },
  {
    name: "UTY",
    schools: { total: 490, primary: 380, secondary: 75, alp: 20, asp: 15 },
    learners: {
      total: 330000,
      male: 170000,
      female: 160000,
      withDisability: 4500,
    },
    classrooms: {
      total: 1800,
      permanent: 1100,
      semiPermanent: 500,
      outdoor: 200,
    },
    attendance: { average: 82, male: 84, female: 80 },
  },
  {
    name: "WBG",
    schools: { total: 470, primary: 370, secondary: 65, alp: 25, asp: 10 },
    learners: {
      total: 300000,
      male: 150000,
      female: 150000,
      withDisability: 4000,
    },
    classrooms: {
      total: 1700,
      permanent: 1000,
      semiPermanent: 500,
      outdoor: 200,
    },
    attendance: { average: 79, male: 81, female: 77 },
  },
  {
    name: "WES",
    schools: { total: 520, primary: 410, secondary: 85, alp: 20, asp: 5 },
    learners: {
      total: 350000,
      male: 180000,
      female: 170000,
      withDisability: 5000,
    },
    classrooms: {
      total: 2000,
      permanent: 1200,
      semiPermanent: 600,
      outdoor: 200,
    },
    attendance: { average: 83, male: 85, female: 81 },
  },
  {
    name: "WRP",
    schools: { total: 500, primary: 390, secondary: 80, alp: 20, asp: 10 },
    learners: {
      total: 340000,
      male: 170000,
      female: 170000,
      withDisability: 4500,
    },
    classrooms: {
      total: 1900,
      permanent: 1100,
      semiPermanent: 600,
      outdoor: 200,
    },
    attendance: { average: 82, male: 84, female: 80 },
  },
];

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  data: StateData[];
}

export function StatCard({
  icon,
  title,
  value,
  description,
  data,
}: StatCardProps) {
  const renderTooltipContent = () => {
    switch (title) {
      case "Schools":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead>Secondary</TableHead>
                <TableHead>ALP</TableHead>
                <TableHead>ASP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((state) => (
                <TableRow key={state.name}>
                  <TableCell>{state.name}</TableCell>
                  <TableCell>{state.schools.total}</TableCell>
                  <TableCell>{state.schools.primary}</TableCell>
                  <TableCell>{state.schools.secondary}</TableCell>
                  <TableCell>{state.schools.alp}</TableCell>
                  <TableCell>{state.schools.asp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "Learners":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Male</TableHead>
                <TableHead>Female</TableHead>
                <TableHead>LWD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((state) => (
                <TableRow key={state.name}>
                  <TableCell>{state.name}</TableCell>
                  <TableCell>{state.learners.total.toLocaleString()}</TableCell>
                  <TableCell>{state.learners.male.toLocaleString()}</TableCell>
                  <TableCell>
                    {state.learners.female.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {state.learners.withDisability.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "Classrooms":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Permanent</TableHead>
                <TableHead>Temporary</TableHead>
                <TableHead>Outdoor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((state) => (
                <TableRow key={state.name}>
                  <TableCell>{state.name}</TableCell>
                  <TableCell>{state.classrooms.total}</TableCell>
                  <TableCell>{state.classrooms.permanent}</TableCell>
                  <TableCell>{state.classrooms.semiPermanent}</TableCell>
                  <TableCell>{state.classrooms.outdoor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "Average Attendance":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Average</TableHead>
                <TableHead>Male</TableHead>
                <TableHead>Female</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((state) => (
                <TableRow key={state.name}>
                  <TableCell>{state.name}</TableCell>
                  <TableCell>{state.attendance.average}%</TableCell>
                  <TableCell>{state.attendance.male}%</TableCell>
                  <TableCell>{state.attendance.female}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardContent className="flex items-center p-6">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="start"
            className="w-[400px] max-h-[300px] overflow-auto"
          >
            {renderTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function EducationStats() {
  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">
          South Sudan Education Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<School className="h-6 w-6 text-primary" />}
            title="Schools"
            value="3,245"
            description="Across South Sudan"
            data={southSudanStates}
          />
          <StatCard
            icon={<Users className="h-6 w-6 text-primary" />}
            title="Learners"
            value="2,210,554"
            description="Enrolled"
            data={southSudanStates}
          />
          <StatCard
            icon={<BookOpen className="h-6 w-6 text-primary" />}
            title="Classrooms"
            value="15,678"
            description="Total across all states"
            data={southSudanStates}
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            title="Average Attendance"
            value="85%"
            description="Nationwide average"
            data={southSudanStates}
          />
        </div>
      </div>
    </div>
  );
}
