import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-primary/20 to-background">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Skeleton className="h-4 w-20" />
        <span className="text-white">/</span>
        <Skeleton className="h-4 w-16" />
        <span className="text-white">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Title and Year Selector Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultValue="budget" className="w-full">
        <TabsList>
          <TabsTrigger value="budget" className="relative">
            <Skeleton className="h-4 w-16" />
          </TabsTrigger>
          <TabsTrigger value="approvals">
            <Skeleton className="h-4 w-20" />
          </TabsTrigger>
          <TabsTrigger value="accountability">
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Budget Overview Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
