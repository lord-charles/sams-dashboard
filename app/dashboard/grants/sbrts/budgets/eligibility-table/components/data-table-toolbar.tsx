"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { schoolTypes, states } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { statesCountyPayams } from "../data/states-county-payams";
import { schoolOwnership } from "@/app/dashboard/schools/school-table/data/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  // const [selectedState, setSelectedState] = useState(
  //   table.getColumn("state10")?.getFilterValue() || ["CES"]
  // );
  const selectedState = table.getColumn("state10")?.getFilterValue() || null;
  const selectedCounty = table.getColumn("county28")?.getFilterValue() || null;

  const filteredCounties =
    selectedState && Array.isArray(selectedState) && selectedState.length > 0
      ? statesCountyPayams
        .find((state) => state.state10 === selectedState[0])
        ?.counties.map((county) => ({
          value: county.county28,
          label: county.county28,
        })) || []
      : [];

  const filteredPayams =
    selectedCounty && Array.isArray(selectedCounty) && selectedCounty.length > 0
      ? statesCountyPayams
        .find((state) =>
          state.counties.some(
            (county) => county.county28 === selectedCounty[0]
          )
        )
        ?.counties.find((county) => county.county28 === selectedCounty[0])
        ?.payams.map((payam) => ({
          value: payam,
          label: payam,
        })) || []
      : [];

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter school name | code..."
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
          className="h-8 w-[150px] lg:w-[200px]"
        />
        {table.getColumn("schoolType") && (
          <DataTableFacetedFilter
            column={table?.getColumn("schoolType")}
            title="Type"
            options={schoolTypes}
          />
        )}

        {table.getColumn("ownership") && (
          <DataTableFacetedFilter
            column={table?.getColumn("ownership")}
            title="OwnerShip"
            options={schoolOwnership}
          />
        )}
        {table.getColumn("eligibility") && (
          <DataTableFacetedFilter
            column={table?.getColumn("eligibility")}
            title="Status"
            options={[
              { value: "Eligible", label: "Eligible" },
              { value: "Not Eligible", label: "Not Eligible" },
            ]}
          />
        )}
        {table.getColumn("state10") && (
          <DataTableFacetedFilter
            column={table?.getColumn("state10")}
            title="State"
            options={states}
          />
        )}
        {selectedState && table.getColumn("county28") && (
          <DataTableFacetedFilter
            column={table?.getColumn("county28")}
            title="County"
            options={filteredCounties}
          />
        )}
        {selectedCounty && table.getColumn("payam28") && (
          <DataTableFacetedFilter
            column={table?.getColumn("payam28")}
            title="Payam"
            options={filteredPayams}
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
