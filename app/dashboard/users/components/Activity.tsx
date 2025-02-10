import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Users, UserCheck, UserMinus, Smile, ShieldCheck, MapPin } from "lucide-react";
import { format, subDays } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LineChart,
  Line,
} from "recharts";
import UsersTable from "../user-table/user";
import { teacherInterface } from "../../teachers/teacher-table/teachers";

const ActivityComponent = ({ users }: { users: teacherInterface[] }) => {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Super Admins
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.userType === "SuperAdmin").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Super administrator accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned States
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.from(new Set(users.flatMap(user => user.statesAsigned))).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique states covered
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <UsersTable users={users} />
      </div>
    </div>
  );
};



export default ActivityComponent;
