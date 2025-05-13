"use client";

import { useEffect } from "react"; // Import useEffect from React
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";
import json2csv from "json2csv";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  useEffect(() => {
    const columnsToHide = [
      "combinedName",
      "education",
      "isPromoted",
      "school",
      "code",
      "dob",
      "isDroppedOut",
      "hasDisability",
    ];
    columnsToHide.forEach((columnId) => {
      const column = table.getColumn(columnId);
      if (column && column.getIsVisible()) {
        column.toggleVisibility(false); // Hide the column
      }
    });

    // Log the filtered data to the console
  }, [table]);

  const handleExport = () => {
    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    const csvData = json2csv.parse(filteredData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "learners.csv");
  };

  return (
    <div className="flex space-x-2 items-center">
      <div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
          onClick={handleExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
