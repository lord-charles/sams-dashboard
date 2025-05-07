import { useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gender } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { statesCountyPayams } from "../data/states-county-payams";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names | reference | class | uniqueID..."
          value={
            (table.getColumn("combinedName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            const value = event.target.value;
            const combinedColumn = table.getColumn("combinedName");
            if (combinedColumn) {
              combinedColumn.setFilterValue(value);
            }
          }}
          className="h-8 w-[150px] lg:w-[350px]"
        />
        {table.getColumn("gender") && (
          <DataTableFacetedFilter
            column={table?.getColumn("gender")}
            title="Gender"
            options={gender}
          />
        )}
        {table.getColumn("isPromoted") && (
          <DataTableFacetedFilter
            column={table?.getColumn("isPromoted")}
            title="Promoted"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
          />
        )}
        {table.getColumn("isDroppedOut") && (
          <DataTableFacetedFilter
            column={table?.getColumn("isDroppedOut")}
            title="Dropped Out"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
          />
        )}
        {table.getColumn("hasDisability") && (
          <DataTableFacetedFilter
            column={table?.getColumn("hasDisability")}
            title="LWD"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
