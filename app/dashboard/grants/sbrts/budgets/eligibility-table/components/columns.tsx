"use client";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { EligibilityInterface } from "../eligibility";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

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
): ColumnDef<EligibilityInterface>[] => [
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) =>
      `${row.school || ""} ${row.code || ""} 
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
    accessorKey: "school",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School Name" />
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
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    accessorKey: "ownership",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ownership" />
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    accessorKey: "submittedAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Budget" />
    ),
    cell: ({ row }) => {
      const amount = row.original.submittedAmount;
      return amount ? <div>SSP {amount.toLocaleString()}</div> : <div>-</div>;
    },
  },
  {
    accessorKey: "enrolment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrolment" />
    ),
  },
  {
    id: "governance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="governance" />
    ),
    cell: ({ row }) => {
      const governance = row.original.governance;
      const items: {
        key: keyof NonNullable<EligibilityInterface["governance"]>;
        label: string;
      }[] = [
        { key: "SGB", label: "SGB" },
        { key: "SDP", label: "SDP" },
        { key: "budgetSubmitted", label: "Budget" },
        { key: "bankAccount", label: "Bank" },
      ];
      return (
        <div className="flex gap-2">
          {items.map(({ key, label }) => (
            <span
              key={key}
              className={`px-2 py-1 rounded text-xs ${
                governance?.[key] ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {label}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "eligibility",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("eligibility") as string;
      return (
        <div
          className={`px-2 py-1 rounded text-white text-xs inline-block ${
            status === "Eligible" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {status}
        </div>
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
