import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  title: string;
  description: string;
  columns: number;
  rows: number;
}

export function TableSkeleton({
  title,
  description,
  columns,
  rows,
}: TableSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-[300px]" />
              <Skeleton className="h-9 w-[100px]" />
            </div>
            <Skeleton className="h-9 w-[180px]" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: columns }).map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-center items-center space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
