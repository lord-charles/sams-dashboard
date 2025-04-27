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
  handlePresent?: (reason: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  selectedIds = [],
  markStudentsAbsent,
  handlePresent
}: DataTableToolbarProps<TData>) {
  const [openAbsent, setOpenAbsent] = useState(false);
  const [openPresent, setOpenPresent] = useState(false);
  const [reason, setReason] = useState("");
  const [presentReason, setPresentReason] = useState("");
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
        onClick={() => setOpenAbsent(true)}
        className="h-7 mr-2"
      >
        Mark Absent
      </Button>
      <Button
        variant="default"
        disabled={selectedIds.length === 0}
        onClick={() => setOpenPresent(true)}
        className="h-7 mr-2"
      >
        Mark Present
      </Button>

      {/* Mark Absent Dialog */}
      <Dialog open={openAbsent} onOpenChange={setOpenAbsent}>
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
              <Button onClick={() => setOpenAbsent(false)} variant="secondary">Cancel</Button>
              <Button
                onClick={() => {
                  if (markStudentsAbsent) markStudentsAbsent(reason);
                  setOpenAbsent(false);
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

      {/* Mark Present Dialog */}
      <Dialog open={openPresent} onOpenChange={setOpenPresent}>
        <DialogContent>
          <div className="flex flex-col gap-4">
            <Label className="font-semibold">Present Correction Reason</Label>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded text-sm">
              <strong>Disclaimer:</strong> This feature is intended <span className="font-semibold">only</span> for correcting mistakes where a learner was marked absent by error. The standard procedure is to mark only absent learners. However, this feature can be useful when you want to mark all learners as present.
            </div>
            <Textarea
              className="border rounded p-2"
              value={presentReason}
              onChange={e => setPresentReason(e.target.value)}
              placeholder="Enter reason for correcting or marking all learners as present..."
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setOpenPresent(false)} variant="secondary">Cancel</Button>
              <Button
                onClick={() => {
                  if (handlePresent) handlePresent(presentReason);
                  setOpenPresent(false);
                  setPresentReason("");
                }}
                disabled={!presentReason.trim()}
                variant="default"
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


