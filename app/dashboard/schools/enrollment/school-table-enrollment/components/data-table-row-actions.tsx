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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<any>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const item = row.original;
  const router = useRouter();
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
        <DropdownMenuItem
          onClick={() => {
            router.push(`/dashboard/schools/${item?._id}`);
          }}
        >
          View School
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={{
              pathname: "/dashboard/learners",
              query: {
                state: item?.state10,
                payam: item?.payam28,
                county: item?.county28,
                code: item?.code,
                school: item?.schoolName,
                education: item?.schoolType,
              },
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Learners
          </Link>
          <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={{
              pathname: "/dashboard/learners/new-learner",
              query: {
                state: item?.state10,
                payam: item?.payam28,
                county: item?.county28,
                code: item?.code,
                school: item?.schoolName,
                education: item?.schoolType,
              },
            }}
          >
            <Button
              className="bg-foreground text-background"
              size="sm"
            >
              New Learner
            </Button>
          </Link>
          <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={{
              pathname: "/dashboard/teachers",
              query: {
                state: item?.state10,
                payam: item?.payam28,
                county: item?.county28,
                code: item?.code,
                school: item?.schoolName,
                education: item?.schoolType,
              },
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Teachers
          </Link>
          <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="stext-red-500">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
