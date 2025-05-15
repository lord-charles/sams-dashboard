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
        <DataTableColumnHeader column={column} title="Code" />
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
      id: "state10",
      accessorKey: "state10",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State" />
      ),
    },
    {
      id: "county28",
      accessorKey: "county28",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="County" />
      ),
    },
    {
      id: "payam28",
      accessorKey: "payam28",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payam" />
      ),
    },
    {
      id: "year",
      accessorKey: "year",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Year" />
      ),
    },
    {
      accessorKey: "schoolType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => <div>{row.getValue("schoolType")}</div>,
    },
    {
      accessorKey: "ownership",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ownership" />
      ),
      cell: ({ row }) => <div>{row.getValue("ownership")}</div>,
    },
    {
      accessorKey: "submittedAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Budget (SSP)" />
      ),
      cell: ({ row }) => {
        const amount = row?.original?.submittedAmount;
        return <div>{`${amount?.toLocaleString()}`}</div>;
      },
    },
    {
      accessorKey: "preparedBy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prepared By" />
      ),
      cell: ({ row }) => {
        const preparedBy = row?.original?.preparedBy;
        return <div>{preparedBy || "N/A"}</div>;
      },
    },
    {
      accessorKey: "actions",
      cell: ({ row }) => (
        <DataTableRowActions row={row} selectedYear={selectedYear} />
      ),
    },
  ];
