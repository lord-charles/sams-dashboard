"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { SchoolData } from "../types";

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
): ColumnDef<SchoolData>[] => [
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) =>
      `${row.school.name || ""} ${row.school.code || ""} 
      }`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,
    enableSorting: false,
    size: 0,
    cell: () => null,
  },
  {
    accessorKey: "school.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School Name" />
    ),
    cell: ({ row }) => <div>{row.original.school.name}</div>,
    filterFn: customIncludesStringFilter,
  },
  {
    accessorKey: "school.code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <div>{row.original.school.code}</div>,
  },
  {
    id: "schoolType",
    accessorFn: (row) => row.school.type,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{row.original.school.type}</div>,
  },
  {
    accessorKey: "state10",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
  },
  {
    accessorKey: "county10",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="County" />
    ),
  },
  {
    accessorKey: "payam10",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payam" />
    ),
  },
  {
    id: "ownership",
    accessorFn: (row) => row.school.ownership,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ownership" />
    ),
    cell: ({ row }) => <div>{row.original.school.ownership}</div>,
  },
  {
    accessorKey: "learnerCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Learners" />
    ),
    cell: ({ row }) => <div>{row.original.learnerCount}</div>,
  },
  {
    accessorKey: "amounts.approved.amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approved Amount" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.amounts.approved.amount}{" "}
        {row.original.amounts.approved.currency}
      </div>
    ),
  },
  {
    accessorKey: "amounts.paid.amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid Amount" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.amounts.paid.amount} {row.original.amounts.paid.currency}
      </div>
    ),
  },
  {
    accessorKey: "accountability.amountAccounted",
    header: "Amount Accounted",
    cell: ({ row }) => {
      const amount = row.original.accountability?.amountAccounted || 0;
      return `${amount} ${row.original.amounts?.approved?.currency || "SSP"}`;
    },
  },
  {
    accessorKey: "accountability.dateAccounted",
    header: "Date Accounted",
    cell: ({ row }) => {
      return row.original.accountability?.dateAccounted || "Not Accounted";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
