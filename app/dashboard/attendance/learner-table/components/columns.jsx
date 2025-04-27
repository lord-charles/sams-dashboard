"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

const customIncludesStringFilter = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId);
  return cellValue.toLowerCase().includes(filterValue.toLowerCase());
};

// Helper function for absent cell class
const absentCellClass = (row) => row.original?.attendance?.absent ? "bg-red-100" : "";

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
      <div className={absentCellClass(row)}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "combinedName",
    header: "Name",
    accessorFn: (row) => `${row.firstName || ''} ${row.lastName || ''} ${row.reference || ''} ${row.class || ''} ${row.learnerUniqueID || ''}`,
    filterFn: customIncludesStringFilter,
    enableHiding: true,  // Allow this column to be hidden
    enableSorting: false, // Prevent sorting if not needed
    size: 0, // Set minimal size
    cell: () => null, // This ensures nothing renders in the cell
  },
  // {
  //   accessorKey: "state10",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="State10" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex space-x-2">
  //       <span className="max-w-[500px] truncate font-medium">
  //         {row.getValue("state10")}
  //       </span>
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "county28",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="County10" />
  //   ),
  //   cell: ({ row }) => <div>{row.getValue("county28")}</div>,
  // },
  // {
  //   accessorKey: "payam28",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="payam10" />
  //   ),
  //   cell: ({ row }) => <div>{row.getValue("payam28")}</div>,
  // },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "middleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Middle Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("middleName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  },

  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },

  {
    accessorKey: "learnerUniqueID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unique Id" />
    ),
    cell: ({ row }) => <div>{row.getValue("learnerUniqueID")}</div>,
  },
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference" />
    ),
    cell: ({ row }) => <div>{row.getValue("reference")}</div>,
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DOB" />
    ),
    cell: ({ row }) => <div>{row.getValue("dob")}</div>,
  },
  {
    accessorKey: "school",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School" />
    ),
    cell: ({ row }) => <div>{row.getValue("school")}</div>,
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
      <DataTableColumnHeader column={column} title="School Type" />
    ),
    cell: ({ row }) => <div>{row.getValue("education")}</div>,
  },
  {
    accessorKey: "class",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => <div>{row.getValue("class")}</div>,
  },

  // {
  //   accessorKey: "hasDisability",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="LWD" />
  //   ),
  //   cell: ({ row }) => {
  //     const disabilityValue = row.original.hasDisability;
  //     return (
  //       <Badge variant={disabilityValue === "Yes" ? "destructive" : "default"}>
  //         {disabilityValue}
  //       </Badge>
  //     );
  //   },
  // },
  {
    accessorKey: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
