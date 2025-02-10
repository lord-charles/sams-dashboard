"use client";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { BudgetInterface } from "../budgets";
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
): ColumnDef<BudgetInterface>[] => [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School Code" />
    ),
  },
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
    accessorKey: "school",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School" />
    ),
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
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    accessorKey: "budget.submittedAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Budget" />
    ),
    cell: ({ row }) => {
      const amount = row?.original?.budget?.submittedAmount;
      return <div>{`SSP ${amount?.toLocaleString()}`}</div>;
    },
  },
  {
    accessorKey: "schoolType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School Type" />
    ),
    cell: ({ row }) => <div>{row.getValue("schoolType")}</div>,
  },
  {
    accessorKey: "ownership",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School OwnerShip" />
    ),
    cell: ({ row }) => <div>{row.getValue("ownership")}</div>,
  },
  {
    accessorKey: "budget.meta.preparation.preparedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prepared By" />
    ),
    cell: ({ row }) => {
      const amount = row?.original;
      console.log(amount);
      return <div>{`Test User`}</div>;
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} selectedYear={selectedYear} />
    ),
  },
];
