"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<any>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const item = row.original;

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
        <DropdownMenuItem className="text-red-500 focus:text-red-500">
          <Trash className="mr-2 h-4 w-4" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
