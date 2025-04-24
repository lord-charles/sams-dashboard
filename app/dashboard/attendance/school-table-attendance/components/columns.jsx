"use client";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import {  UserX, UserCheck, Accessibility, CalendarDays, MapPin, School2 } from "lucide-react";


const customIncludesStringFilter = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId);
  return cellValue.toLowerCase().includes(filterValue.toLowerCase());
};



export const columns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) => `${row.school || ''} ${row.code || ''}`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,  // Allow this column to be hidden
    enableSorting: false, // Prevent sorting if not needed
    size: 0, // Set minimal size
    cell: () => null, // This ensures nothing renders in the cell
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date");
      const formatted = date ? new Date(date).toLocaleDateString() : "";
      return (
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "state10",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        {row.getValue("state10")}
      </div>
    ),
  },
  {
    accessorKey: "county28",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="County" />
    ),
    cell: ({ row }) => <div>{row.getValue("county28")}</div>,
  },
  {
    accessorKey: "payam28",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payam" />
    ),
    cell: ({ row }) => <div>{row.getValue("payam28")}</div>,
  },
  {
    accessorKey: "school",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <School2 className="w-4 h-4 text-muted-foreground" />
        {row.getValue("school")}
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "education",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{row.getValue("education")}</div>,
  },
  {
    accessorKey: "numWithDisability",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LWD" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Accessibility className="w-4 h-4 text-blue-500" />
        {row.getValue("numWithDisability")}
      </div>
    ),
  },
  {
    accessorKey: "absent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Absent" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <UserX className="w-4 h-4 text-red-500" />
        {row.getValue("absent")}
      </div>
    ),
  },
  {
    accessorKey: "present",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Present" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <UserCheck className="w-4 h-4 text-green-500" />
        {row.getValue("present")}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    cell: ({ row, table }) => {
      // Try to get setShowLearners from table.options.meta
      const setShowLearners = table?.options?.meta?.setShowLearners;
      const setCode = table?.options?.meta?.setCode;
      return <DataTableRowActions row={row} setShowLearners={setShowLearners} setCode={setCode} />;
    },
  },
];
