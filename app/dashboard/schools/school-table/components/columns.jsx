"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

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
    accessorFn: (row) => `${row.schoolName || ''} ${row.code || ''} ${row.emisId || ''}`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,  // Allow this column to be hidden
    enableSorting: false, // Prevent sorting if not needed
    size: 0, // Set minimal size
    cell: () => null, // This ensures nothing renders in the cell
  },
  {
    accessorKey: "state10",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
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
      <DataTableColumnHeader column={column} title="County" />
    ),
    cell: ({ row }) => <div>{row.getValue("county28")}</div>,
  },
  {
    accessorKey: "payam28",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payam" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("payam28")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "schoolName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School Name" />
    ),
    cell: ({ row }) => <div className="w-[160px]">{row.getValue("schoolName")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "schoolType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{row.getValue("schoolType")}</div>,
  },
  {
    accessorKey: "schoolOwnerShip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="OwnerShip" />
    ),
    cell: ({ row }) => <div>{row.getValue("schoolOwnerShip")}</div>,
  },
  {
    id: "schoolStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    accessorFn: row => row.schoolStatus?.isOpen,
    filterFn: (row, columnId, filterValue) => {
      const value = row.original?.schoolStatus?.isOpen;
      return filterValue.includes(value);
    },
    cell: ({ row }) => {
      const status = row.original?.schoolStatus?.isOpen;
      const isOpen = status && status.toLowerCase() === "open";
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
        </span>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "emisId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EMIS ID" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue("emisId")}</div>
    ),
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
