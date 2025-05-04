import { useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gender } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { Cross2Icon } from "@radix-ui/react-icons";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  selectedIds?: string[];
  markStudentsAbsent?: (reason: string) => void;
  handlePresent: () => void;
  date: Date;
}

export function DataTableToolbar<TData>({
  table,
  selectedIds = [],
  markStudentsAbsent,
  handlePresent,
  date,
}: DataTableToolbarProps<TData>) {
  const [openAbsent, setOpenAbsent] = useState(false);
  const [openPresent, setOpenPresent] = useState(false);
  const [reason, setReason] = useState("");
  const [presentReason, setPresentReason] = useState("");
  const [confirmDate, setConfirmDate] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  // Format the date for display (e.g., Sunday, 4 May 2025)
  const formattedDate = date
    ? date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "-";

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
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2 rounded-md">
              <span className="font-semibold text-gray-700">Marking attendance for:</span>
              <span className="px-2 py-1 rounded bg-primary/10 text-primary-700 font-medium text-sm border border-primary/20">
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirm-date-absent"
                checked={confirmDate}
                onChange={(e) => setConfirmDate(e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              <Label htmlFor="confirm-date-absent" className="text-sm text-gray-700">
                I confirm I want to mark attendance for <span className="font-semibold">{formattedDate}</span>
              </Label>
            </div>
            <Textarea
              className="border rounded p-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for absence..."
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={() => { setOpenAbsent(false); setConfirmDate(false); }} variant="secondary">Cancel</Button>
              <Button
                onClick={() => {
                  if (markStudentsAbsent) markStudentsAbsent(reason);
                  setOpenAbsent(false);
                  setReason("");
                  setConfirmDate(false);
                }}
                disabled={!reason.trim() || !confirmDate}
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
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2 rounded-md">
              <span className="font-semibold text-gray-700">Marking attendance for:</span>
              <span className="px-2 py-1 rounded bg-primary/10 text-primary-700 font-medium text-sm border border-primary/20">
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirm-date-present"
                checked={confirmDate}
                onChange={(e) => setConfirmDate(e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              <Label htmlFor="confirm-date-present" className="text-sm text-gray-700">
                I confirm I want to mark attendance for <span className="font-semibold">{formattedDate}</span>
              </Label>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded text-sm">
              <strong>Disclaimer:</strong> This feature is intended <span className="font-semibold">only</span> for correcting mistakes where a learner was marked absent by error. The standard procedure is to mark only absent learners. However, this feature can be useful when you want to mark all learners as present.
            </div>
            <Textarea
              className="border rounded p-2"
              value={presentReason}
              onChange={(e) => setPresentReason(e.target.value)}
              placeholder="Enter reason for correcting or marking all learners as present..."
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={() => { setOpenPresent(false); setConfirmDate(false); }} variant="secondary">Cancel</Button>
              <Button
                onClick={() => {
                  handlePresent();
                  setOpenPresent(false);
                  setPresentReason("");
                  setConfirmDate(false);
                }}
                disabled={!presentReason.trim() || !confirmDate}
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
