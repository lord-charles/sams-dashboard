'use client'

import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    User,
    Pagination,
    Tooltip,
} from "@nextui-org/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// import { capitalize } from "./utils";
import { ChevronDownIcon, DeleteIcon, Edit, EyeIcon, PlusIcon, SearchIcon } from "lucide-react";
import { capitalize } from "@/app/lib/utils";
import Link from "next/link";



const INITIAL_VISIBLE_COLUMNS = ["firstname", "lastname", "trainingLevel",
    "workStatus",
    "gender",
    "year",
    "state10",
    "county28",
    "payam28",
    "school",
    "code",
    "actions"
];

export default function LearnersTable({ students }) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState(new Set());

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const pages = Math.ceil(students.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredstudents = [...students];

        // Apply name, reference, grade, and unique ID filtering
        if (hasSearchFilter) {
            const searchLower = filterValue.toLowerCase();

            filteredstudents = filteredstudents.filter((user) => {
                const nameMatch =
                    user?.firstName?.toLowerCase().includes(searchLower) ||
                    user?.middleName?.toLowerCase().includes(searchLower) ||
                    user?.lastName?.toLowerCase().includes(searchLower);
                const trainingLevelMatch = user?.trainingLevel?.toLowerCase().includes(searchLower);
                const workStatusMatch = user?.workStatus?.toLowerCase().includes(searchLower);


                return nameMatch || trainingLevelMatch || workStatusMatch;
            });
        }

        // Apply status filter for isPromoted, isDroppedOut, and isDisbursed
        if (statusFilter.size > 0) {
            filteredstudents = filteredstudents.filter((user) => {
                // Check for matching status
                return (
                    (statusFilter.has("isPromoted") && user.isPromoted) ||
                    (statusFilter.has("isDroppedOut") && user.isDroppedOut) ||
                    (statusFilter.has("isDisbursed") && user.isDisbursed)
                );
            });
        }

        return filteredstudents;
    }, [students, filterValue, statusFilter, hasSearchFilter]);


    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {

            case "isDroppedOut":
                return (
                    <div className="flex flex-col">
                        <p className={`font-bold  capitalize ${user?.isDroppedOut ? 'text-red-500' : 'text-default-500'}`}>{user?.isDroppedOut ? 'Yes' : "No"}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center space-x-3">
                        <Link href={`/dashboard/learners/${user._id}`}>
                            <Tooltip content={`Update ${user.firstname}`} size="lg">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <Edit className="w-5 h-5" />
                                </span>
                            </Tooltip>
                        </Link>


                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="flat" color="danger"
                                >
                                    <Tooltip content={`Delete ${user.firstname}`} size="sm">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                            <DeleteIcon className="w-5 h-5" />
                                        </span>
                                    </Tooltip>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete {user?.firstname} {user?.lastname} and remove data from SAMS servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);


    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Search by name | training level | work status ...  "
                        size="sm"
                        startContent={<SearchIcon className="text-default-300" />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">

                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={(selectedKeys) => setStatusFilter(new Set(selectedKeys))}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>

                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Link
                            href={{
                                pathname: '/dashboard/teachers/new-teacher',
                                query: {
                                    state: students[0].state10,
                                    payam: students[0].payam28,
                                    county: students[0].county28,
                                    code: students[0].code,
                                    school: students[0].school,
                                    education: students[0].education
                                }
                            }}
                        >
                            <Button
                                className="bg-foreground text-background"
                                endContent={<PlusIcon />}
                                size="sm"
                            >
                                Add New
                            </Button></Link>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {students.length} students</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>

                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        students.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${items.length} selected`}
                </span>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = React.useMemo(
        () => ({
            wrapper: ["max-h-[382px]", "max-w-3xl"],
            th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
            td: [
                // changing the rows border radius
                // first
                "group-data-[first=true]:first:before:rounded-none",
                "group-data-[first=true]:last:before:rounded-none",
                // middle
                "group-data-[middle=true]:before:rounded-none",
                // last
                "group-data-[last=true]:first:before:rounded-none",
                "group-data-[last=true]:last:before:rounded-none",
            ],
        }),
        [],
    );

    return (
        <Table
            isCompact
            removeWrapper
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            checkboxesProps={{
                classNames: {
                    wrapper: "after:bg-foreground after:text-background text-background",
                },
            }}
            classNames={classNames}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No students found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item._id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}


const columns = [
    { name: "FIRST NAME", uid: "firstname", sortable: true },
    { name: "LAST NAME", uid: "lastname", sortable: true },
    { name: "DOB", uid: "dob", sortable: true },
    { name: "TRAINING LEVEL", uid: "trainingLevel", sortable: true },
    { name: "WORK STATUS", uid: "workStatus", sortable: true },
    { name: "GENDER", uid: "gender", sortable: true },
    { name: "YEAR", uid: "year", sortable: true },
    { name: "STATE10", uid: "state10", sortable: true },
    { name: "COUNTY28", uid: "county28", sortable: true },
    { name: "PAYAM28", uid: "payam28", sortable: true },
    { name: "SCHOOL", uid: "school", sortable: true },
    { name: "CLASS", uid: "class", sortable: true },
    { name: "CODE", uid: "code", sortable: true },
    { name: "EDUCATION", uid: "education", sortable: true },
    { name: "PROMOTED", uid: "isPromoted", sortable: true },
    { name: "DROPPED OUT", uid: "isDroppedOut", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];


const statusOptions = [
    { name: "Promoted", uid: "isPromoted" },
    { name: "Dropped Out", uid: "isDroppedOut" },
];



