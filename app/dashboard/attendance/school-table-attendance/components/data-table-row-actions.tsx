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
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DataTableRowActionsProps<TData> {
  row: Row<any>;
  setShowLearners: (show: boolean) => void;
  setCode: (code: string) => void;
}

export function DataTableRowActions<TData>({
  row,
  setShowLearners,
  setCode,
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

        <DropdownMenuItem onClick={() => {
          setCode(item?.code),
            setTimeout(() => setShowLearners(true), 200)
        }}
        >

          View Learners
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
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
      
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
