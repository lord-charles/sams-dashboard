"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ApprovalInterface } from "../approvals";

const customIncludesStringFilter = (
  row: any,
  columnId: any,
  filterValue: any
) => {
  const cellValue = row.getValue(columnId);
  return cellValue.toLowerCase().includes(filterValue.toLowerCase());
};

export const createColumns = (
  selectedYear: string
): ColumnDef<ApprovalInterface>[] => [
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) =>
      `${row.schoolName || ""} ${row.code || ""} 
      }`,
    filterFn: customIncludesStringFilter,
    enableHiding: true, // Allow this column to be hidden
    enableSorting: false, // Prevent sorting if not needed
    size: 0, // Set minimal size
    cell: () => null, // This ensures nothing renders in the cell
  },

  {
    accessorKey: "state10",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
  },
  {
    accessorKey: "county28",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="County" />
    ),
  },
  {
    accessorKey: "payam28",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payam" />
    ),
  },
  {
    accessorKey: "schoolName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School" />
    ),
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
  },
  {
    accessorKey: "schoolType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School Type" />
    ),
  },
  {
    accessorKey: "ownership",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ownership" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tranche" />
    ),
  },
  {
    accessorKey: "amountDisbursed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Disbursed" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amountDisbursed") as number;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "SSP",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "amountApproved",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Approved" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amountApproved") as number;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "SSP",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "approvalStatus",
    accessorKey: "approval.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.approval.status;
      return (
        <Badge
          variant={
            (status === "Approved"
              ? "default"
              : status === "Rejected"
              ? "destructive"
              : "secondary") as "default"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} selectedYear={selectedYear} />
    ),
  },
];
