"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { ChevronDownIcon } from "../ui/icons/ChevronDownIcon";
import { SearchIcon } from "../ui/icons/searchicon";

export default function NextUIClientTable({
  columns,
  selectionType = "single",
  renderCell,
  isLoading = false,
  rowCount,
  filteredItems,
  hasSearchFilter,
  filterValue,
  setFilterValue,
}) {
  const INITIAL_VISIBLE_COLUMNS = columns?.map((item) => item?.uid);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: columns[0],
    direction: "ascending",
  });
  const loadingState = isLoading ? "loading" : "idle";

  const [page, setPage] = React.useState(1);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, columns]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

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

  // const renderCell = React.useCallback((row, columnKey) => {
  //   const cellValue = row[columnKey];

  //   switch (columnKey) {
  //     case "county":
  //       return (
  //         <div className="flex flex-col">
  //           <p className="text-bold text-small capitalize">{cellValue}</p>
  //           <p className="text-bold text-tiny capitalize text-default-400">
  //             {row.team}
  //           </p>
  //         </div>
  //       );
  //     case "actions":
  //       return (
  //         <div className="relative flex justify-end items-center gap-2">
  //           <Dropdown>
  //             <DropdownTrigger>
  //               <Button color="primary" variant="solid">
  //                 Action
  //               </Button>
  //             </DropdownTrigger>
  //             <DropdownMenu aria-label="Static Actions">
  //               <DropdownItem key="view">View </DropdownItem>
  //               <DropdownItem
  //                 key="download"
  //                 className="text-primary"
  //                 color="primary"
  //               >
  //                 Download tsv
  //               </DropdownItem>
  //             </DropdownMenu>
  //           </Dropdown>
  //         </div>
  //       );
  //     default:
  //       return cellValue;
  //   }
  // }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages, setPage]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

  const onRowsPerPageChange = React.useCallback(
    (e) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [setPage]
  );

  const onSearchChange = React.useCallback(
    (value) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    },
    [setFilterValue, setPage]
  );

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, [setPage, setFilterValue]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
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
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total{" "}
            {rowCount?.toLocaleString("en-us") ||
              filteredItems?.length?.toLocaleString("en-us")}{" "}
            rows
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              defaultValue={10}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    columns,
    onClear,
    rowCount,
    // onRowsPerPageChange,
    filteredItems?.length,
    onSearchChange,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    page,
    pages,
    filteredItems?.length,
    onNextPage,
    onPreviousPage,
    setPage,
  ]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      // classNames={{
      //   wrapper: "max-h-[382px]",
      // }}
      selectedKeys={selectedKeys}
      selectionMode={selectionType}
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
      <TableBody
        emptyContent={"No rows found"}
        items={sortedItems}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>
                {renderCell({ row: item, columnKey: columnKey })}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
