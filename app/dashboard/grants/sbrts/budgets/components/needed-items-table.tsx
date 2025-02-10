"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NeededItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  currency: "USD" | "SSP";
}

interface NeededItemsDataTableProps {
  data: NeededItem[];
  onDelete: (itemId: string) => void;
}

const columns = ({
  onDelete,
}: {
  onDelete: (id: string) => void;
}): ColumnDef<NeededItem>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center"
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "unitCost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-end"
        >
          Unit Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("unitCost"));
      const currency = row.original.currency;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
      return (
        <div className="text-right tabular-nums font-medium">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-end"
        >
          Total Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalCost"));
      const currency = row.original.currency;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
      return (
        <div className="text-right tabular-nums font-medium">{formatted}</div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const neededItem = row.original;

      return (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 group"
            onClick={() => onDelete(neededItem.id)}
          >
            <span className="sr-only">Delete item</span>
            <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-600" />
          </Button>
        </div>
      );
    },
  },
];

export function NeededItemsDataTable({
  data,
  onDelete,
}: NeededItemsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: columns({ onDelete }),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter items..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-10 px-2 text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No items added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {table.getRowModel().rows?.length > 0 && (
            <tfoot className="border-t bg-muted/50">
              <tr>
                <td className="px-2 py-2 font-medium">Totals</td>
                <td className="px-2 py-2 text-center font-medium">
                  {data.reduce((sum, item) => sum + item.quantity, 0)}
                </td>
                <td className="px-2 py-2 text-right font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: data[0]?.currency || "SSP",
                  }).format(
                    data.reduce((sum, item) => sum + item.unitCost, 0) /
                      data.length || 0
                  )}
                  <span className="text-xs text-muted-foreground ml-1">
                    (avg)
                  </span>
                </td>
                <td className="px-2 py-2 text-right font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: data[0]?.currency || "SSP",
                  }).format(
                    data.reduce((sum, item) => sum + item.totalCost, 0)
                  )}
                </td>
                <td className="px-2 py-2"></td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
