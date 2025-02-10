"use client";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { AccountabilityInterface } from "../accountability";
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
): ColumnDef<AccountabilityInterface>[] => [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
  },
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) => `${row.schoolName || ""} ${row.code || ""}`,
    filterFn: customIncludesStringFilter,
    enableHiding: true, // Allow this column to be hidden
    enableSorting: false, // Prevent sorting if not needed
    size: 0, // Set minimal size
    cell: () => null, // This ensures nothing renders in the cell
  },

  {
    accessorKey: "schoolName",
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
    id: "amountDisbursed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Disbursed" />
    ),
    cell: ({ row }) => {
      const amount = row.original.tranches[0]?.amountDisbursed || 0;
      return <div>{`SSP ${amount.toLocaleString()}`}</div>;
    },
  },
  {
    id: "amountApproved",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Approved" />
    ),
    cell: ({ row }) => {
      const amount = row.original.tranches[0]?.amountApproved || 0;
      return <div>{`SSP ${amount.toLocaleString()}`}</div>;
    },
  },
  {
    accessorKey: "totalRevenue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Revenue" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("totalRevenue") as number;
      return <div>{`SSP ${amount.toLocaleString()}`}</div>;
    },
  },
  {
    accessorKey: "totalExpenditure",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Expenditure" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("totalExpenditure") as number;
      return <div>{`SSP ${amount.toLocaleString()}`}</div>;
    },
  },
  {
    accessorKey: "unaccounted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unaccounted" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("totalRevenue") as number;
      const totalExpenditure = row.getValue("totalExpenditure") as number;

      const unaccounted = Math.max(0, amount - totalExpenditure);
      return <div>{`SSP ${unaccounted.toLocaleString()}`}</div>;
    },
  },
  {
    id: "paidBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid By" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.tranches[0]?.paidBy || "N/A"}</div>;
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} selectedYear={selectedYear} />
    ),
  },
];
