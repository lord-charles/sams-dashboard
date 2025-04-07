"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const customIncludesStringFilter = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId);
  return cellValue.toLowerCase().includes(filterValue.toLowerCase());
};

const enrollmentStatusColor = (percentage) => {
  if (percentage === 100) return "success";
  if (percentage >= 75) return "default";
  if (percentage >= 50) return "warning";
  return "destructive";
};

export const columns = [
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) => `${row.schoolName || ''} ${row.code || ''} ${row.emisId || ''}`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,
    enableSorting: false,
    size: 0,
    cell: () => null,
  },
  {
    accessorKey: "schoolName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.getValue("schoolName")}</span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("code")}</Badge>,
  },
  {
    accessorKey: "emisId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EMIS ID" />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.getValue("emisId")}</Badge>,
  },
  {
    accessorKey: "schoolType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <Badge>{row.getValue("schoolType")}</Badge>,
  },
  {
    accessorKey: "schoolOwnerShip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ownership" />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.getValue("schoolOwnerShip")}</Badge>,
  },
  {
    accessorKey: "payam28",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payam" />
    ),
    cell: ({ row }) => <div>{row.getValue("payam28")}</div>,
  },
  {
    accessorKey: "county28",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="County" />
    ),
    cell: ({ row }) => <div>{row.getValue("county28")}</div>,
  },
  {
    accessorKey: "state10",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => <div>{row.getValue("state10")}</div>,
  },
  {
    accessorKey: "isEnrollmentComplete",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrollment Status" />
    ),
    cell: ({ row }) => {
      const latestEnrollment = row.original.isEnrollmentComplete?.[0];
      if (!latestEnrollment) return null;
      
      return (
        <div className="space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={latestEnrollment.isComplete ? "success" : "destructive"}
                  >
                    {latestEnrollment.isComplete ? "Complete" : "Incomplete"}
                  </Badge>
                  {latestEnrollment.percentageComplete && (
                    <Progress
                      value={latestEnrollment.percentageComplete}
                      className={cn(
                        "h-2 w-24 rounded-full",
                        enrollmentStatusColor(latestEnrollment.percentageComplete)
                      )}
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="space-y-1">
                  <p className="font-medium">Enrollment Details</p>
                  <p>Year: {latestEnrollment.year}</p>
                  <p>Completed by: {latestEnrollment.completedBy}</p>
                  {latestEnrollment.comments && (
                    <p className="text-sm text-muted-foreground">
                      Comments: {latestEnrollment.comments}
                    </p>
                  )}
                  {latestEnrollment.percentageComplete && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {latestEnrollment.percentageComplete}% Complete
                      </span>
                      <Progress
                        value={latestEnrollment.percentageComplete}
                        className={cn(
                          "h-2 w-24 rounded-full",
                          enrollmentStatusColor(latestEnrollment.percentageComplete)
                        )}
                      />
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
