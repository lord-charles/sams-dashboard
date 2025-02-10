"use client";

import { ColumnDef } from "@tanstack/react-table";
import { learnerInterface } from "../leaners";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<learnerInterface>[] = [
  {
    accessorKey: "combinedName",
    header: "Name",
    cell: ({ row }) => {
      const learner = row.original.learner || {
        name: { firstName: "", middleName: "", lastName: "" },
      };
      return (
        `${learner.name.firstName} ${learner.name.middleName || ""} ${
          learner.name.lastName
        }`.trim() || "N/A"
      );
    },
    filterFn: (row, id, value) => {
      const learner = row.original.learner || {
        name: { firstName: "", middleName: "", lastName: "" },
        reference: "",
        classInfo: { class: "" },
        learnerUniqueID: "",
      };
      const searchStr = `${learner.name.firstName} ${
        learner.name.middleName || ""
      } ${learner.name.lastName} ${learner.reference} ${
        learner.classInfo.class
      } ${learner.learnerUniqueID}`.toLowerCase();
      return searchStr.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "learner.learnerUniqueID",
    header: "Learner ID",
    cell: ({ row }) => row.original.learner?.learnerUniqueID || "N/A",
  },
  {
    accessorKey: "learner.reference",
    header: "Reference",
    cell: ({ row }) => row.original.learner?.reference || "N/A",
  },
  {
    accessorKey: "learner.classInfo",
    header: "Class",
    cell: ({ row }) => {
      const classInfo = row.original.learner?.classInfo || {
        class: "",
        classStream: "",
      };
      return (
        `${classInfo.class}${
          classInfo.classStream ? ` (${classInfo.classStream})` : ""
        }` || "N/A"
      );
    },
  },
  {
    accessorKey: "learner.gender",
    id: "gender",
    header: "Gender",
    cell: ({ row }) => row.original.learner?.gender || "N/A",
    filterFn: (row, id, value) => {
      return value.includes(row.original.learner?.gender || "");
    },
  },
  {
    accessorKey: "learner.attendance",
    header: "Attendance",
    cell: ({ row }) => `${row.original.learner?.attendance || 0}%`,
  },
  {
    accessorKey: "amounts.approved",
    header: "Approved Amount",
    cell: ({ row }) => {
      const amounts = row.original.amounts || {
        approved: { amount: 0, currency: "SSP" },
      };
      return `${(amounts.approved?.amount || 0).toLocaleString()} ${
        amounts.approved?.currency || "SSP"
      }`;
    },
  },
  {
    accessorKey: "amounts.paid",
    header: "Paid Amount",
    cell: ({ row }) => {
      const amounts = row.original.amounts || {
        paid: { amount: 0, currency: "SSP" },
      };
      return amounts.paid
        ? `${(amounts.paid.amount || 0).toLocaleString()} ${
            amounts.paid.currency || "SSP"
          }`
        : "Not Paid";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const amounts = row.original.amounts || {
        approved: { amount: 0, currency: "SSP" },
        paid: { amount: 0, currency: "SSP" },
      };
      let status = "Pending";
      let variant: "default" | "success" | "secondary" | "destructive" =
        "secondary";

      const paidAmount = amounts.paid?.amount ?? 0;
      const approvedAmount = amounts.approved?.amount ?? 0;

      if (paidAmount === approvedAmount && approvedAmount > 0) {
        status = "Paid";
        variant = "success";
      } else if (paidAmount > 0) {
        status = "Partially Paid";
        variant = "default";
      } else if (approvedAmount > 0) {
        status = "Pending";
        variant = "secondary";
      } else {
        status = "Not Paid";
        variant = "destructive";
      }

      return <Badge variant={variant as "default"}>{status}</Badge>;
    },
  },
  {
    accessorKey: "hasDisability",
    header: "LWD",
    cell: ({ row }) => row.getValue("hasDisability"),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "accountability.amountAccounted",
    header: "Amount Accounted",
    cell: ({ row }) => {
      const amount = row.original.accountability?.amountAccounted || 0;
      return `${amount} ${row.original.amounts?.approved?.currency || "SSP"}`;
    },
  },
  {
    accessorKey: "accountability.dateAccounted",
    header: "Date Accounted",
    cell: ({ row }) => {
      const date = row.original.accountability?.dateAccounted;
      if (!date) return "Not Accounted";
      return new Date(date).toLocaleDateString();
    },
  },
];
