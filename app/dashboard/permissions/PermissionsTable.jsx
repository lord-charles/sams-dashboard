"use client";
import NextUITable from "@/app/components/tables/NextUITable";
import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import { columns, permissionsRender } from "./permissionColumns";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const PermissionsTable = () => {
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");

  const uniqueActions = ["read", "create", "update", "delete"];

  const data = {
    rows: [
      {
        id: 1,
        name: "User",
        read: true,
        create: false,
        update: true,
        delete: false,
      },
      {
        id: 2,
        name: "SBRT",
        read: true,
        create: true,
        update: true,
        delete: true,
      },
      {
        id: 3,
        name: "Cash Transfers",
        read: true,
        create: false,
        update: false,
        delete: false,
      },
    ],
  };
  const isLoading = false;
  // const { data, isLoading } = useSWR(
  //   `/api/v1/users?page=${page}&query=${filterValue}`,
  //   fetcher,
  //   {
  //     keepPreviousData: true,
  //   }
  // );
  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = React.useMemo(() => {
    let filteredRows = [...(data?.rows || [])];

    return filteredRows;
  }, [data?.rows]);

  const pages = React.useMemo(() => {
    return data?.count ? Math.ceil(data.count / 10) : 0;
  }, [data?.count]);

  const rowCount = React.useMemo(() => {
    return data?.count ? data?.count : 0;
  }, [data?.count]);

  return (
    <>
      <Card className="mb-5 mx-5">
        <CardBody>
          <div className="flex justify-between gap-6 items-center mt-3 mb-5">
            <h4 className="mb-5">Permissions</h4>
          </div>

          <NextUITable
            columns={columns}
            renderCell={permissionsRender}
            isLoading={isLoading}
            page={page}
            pages={pages}
            rowCount={rowCount}
            setPage={setPage}
            filteredItems={filteredItems}
            hasSearchFilter={hasSearchFilter}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default PermissionsTable;
