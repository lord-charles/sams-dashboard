"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<any>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const item = row.original;
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAppointLearner = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Switch to BOG tab
    params.set("tab", "bog");

    // Add learner information to URL
    params.set("learner-id", item._id);
    params.set("learner-firstname", item.firstName || "");
    params.set("learner-lastname", item.lastName || "");
    params.set("learner-reference", item.reference || "");
    params.set("learner-class", item.class || "");

    router.push(`?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleAppointLearner}>
          Appoint
          <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/learners/${row.original._id}`}
            className="cursor-pointer flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            View|Update
            <DropdownMenuShortcut className="ml-auto">⌘U</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 focus:text-red-500">
          <Trash className="mr-2 h-4 w-4" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
