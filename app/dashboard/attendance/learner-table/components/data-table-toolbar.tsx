import { useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gender } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { statesCountyPayams } from "../data/states-county-payams";
import { Cross2Icon } from "@radix-ui/react-icons";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  selectedIds?: string[];
  markStudentsAbsent?: (absenceReason: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  selectedIds = [],
  markStudentsAbsent,
}: DataTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
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
      <Button
        variant="destructive"
        disabled={selectedIds.length === 0}
        onClick={() => setOpen(true)}
        className="h-7 mr-2"
      >
        Mark Absent
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="flex flex-col gap-4">
            <Label className="font-semibold">Absence Reason</Label>
            <Textarea
              className="border rounded p-2"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter reason for absence..."
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setOpen(false)} variant="secondary">Cancel</Button>
              <Button
                onClick={() => {
                  if (markStudentsAbsent) markStudentsAbsent(reason);
                  setOpen(false);
                  setReason("");
                }}
                disabled={!reason.trim()}
                variant="destructive"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <DataTableViewOptions table={table} />
    </div>
  );
}


