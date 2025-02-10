"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";

const customIncludesStringFilter = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId);
  return cellValue.toLowerCase().includes(filterValue.toLowerCase());
};

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) => `${row.firstname || ''} ${row.lastname || ''} `,
    filterFn: customIncludesStringFilter,
    enableHiding: true,  // Allow this column to be hidden
    enableSorting: false, // Prevent sorting if not needed
    size: 0, // Set minimal size
    cell: () => null, // This ensures nothing renders in the cell
  },
  {
    accessorKey: "state10",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State10" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("state10")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "county28",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="County28" />
    ),
    cell: ({ row }) => <div>{row.getValue("county28")}</div>,
  },
  {
    accessorKey: "payam28",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payam28" />
    ),
    cell: ({ row }) => <div>{row.getValue("payam28")}</div>,
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="FirstName" />
    ),
    cell: ({ row }) => <div>{row.getValue("firstname")}</div>,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LastName" />
    ),
    cell: ({ row }) => <div>{row.getValue("lastname")}</div>,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },

  {
    accessorKey: "school",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School" />
    ),
    cell: ({ row }) => <div className="max-w-[180px] truncate">{row.getValue("school")}</div>,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "professionalQual",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qualification" />
    ),
    cell: ({ row }) => <div>{row.getValue("professionalQual")}</div>,
  },
  {
    accessorKey: "workStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Work Status" />
    ),
    cell: ({ row }) => <div>{row.getValue("workStatus")}</div>,
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
