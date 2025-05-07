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

interface DataTableRowActionsProps<TData> {
  row: Row<any>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const item = row.original;
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAppointTeacher = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Switch to BOG tab
    params.set("tab", "bog");
    
    // Add teacher information to URL
    params.set("teacher-id", item._id);
    params.set("teacher-firstname", item.firstname || "");
    params.set("teacher-lastname", item.lastname || "");
    params.set("teacher-gender", item.gender || "");
    params.set("teacher-phone", item.phoneNumber || "");
    params.set("teacher-email", item.email || "");
    params.set("teacher-qualification", item.professionalQual || "");
    
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
        <DropdownMenuItem onClick={handleAppointTeacher}>
          Appoint
          <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={`/dashboard/teachers/${item._id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Update
          </Link>
          <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
