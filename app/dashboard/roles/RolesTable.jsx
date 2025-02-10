"use client";
import NextUITable from "@/app/components/tables/NextUITable";
import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import { columns, rolesRender } from "./rolesColumns";
import useSWR from "swr";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/app/components/ui/icons/PlusIcon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const RolesTable = () => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");

  const { data, isLoading } = useSWR(
    `/api/v1/users/roles?page=${page}&query=${filterValue}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
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
            <h4 className="mb-5">Roles</h4>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onPress={() => router.push("/dashboard/roles/add")}
            >
              Add Role
            </Button>
          </div>

          <NextUITable
            columns={columns}
            renderCell={rolesRender}
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

export default RolesTable;
