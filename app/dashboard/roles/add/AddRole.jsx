"use client";
import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import useSWR from "swr";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Chip } from "@nextui-org/chip";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const AddRole = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState(new Set([]));
  const { data, isLoading } = useSWR(`/api/v1/users/permissions`, fetcher, {
    keepPreviousData: true,
  });
  const filteredItems = React.useMemo(() => {
    let filteredRows = [...(data?.rows || [])];
    return filteredRows;
  }, [data?.rows]);
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const role = Object.fromEntries(formData.entries());
    role.permissionIds = Array.from(values);
    try {
      const result = await fetch(`/api/v1/users/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(role),
      });
      const message = await result.json();
      if (result.ok) {
        setTimeout(() => {
          toast.success(message?.message);
        }, 1000);
        router.back();
      } else {
        toast.error(message?.error);
      }
    } catch (error) {
      toast.error("Unknown error! Please contact System Administrator.");
    } finally {
      setLoading(false);
    }
  };
  const handleSelectionChange = (e) => {
    setValues(new Set(e.target.value.split(",")));
  };
  return (
    <>
      <Card className="mb-5 mx-5">
        <CardBody>
          <div className="flex justify-between gap-6 items-center mt-3 mb-2">
            <h4 className="mb-5">Create New Role</h4>
          </div>
          <form onSubmit={onSubmit}>
            <Input
              label="Role name"
              placeholder="Enter name of role"
              type="text"
              name="name"
              isRequired
              className="w-1/2 mb-5"
            />
            {isLoading ? (
              <Spinner className="flex justify-start items-center" />
            ) : (
              <Select
                items={filteredItems}
                label="Select Permissions"
                isRequired
                isMultiline={true}
                selectionMode="multiple"
                onChange={handleSelectionChange}
                placeholder="Select a permission"
                className="w-1/2"
                name="roles"
                renderValue={(items) => {
                  return (
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <Chip
                          key={item.key}
                          className="capitalize"
                          color="primary"
                        >
                          {item.data.name}
                        </Chip>
                      ))}
                    </div>
                  );
                }}
              >
                {(perm) => (
                  <SelectItem key={perm.id} textValue={perm.name}>
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col">
                        <span className="text-small capitalize">
                          {perm.name}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
            )}
            <div className="flex justify-end gap-6 items-center mt-3 mb-5">
              <Button color="primary" type="submit" isLoading={loading}>
                Save
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default AddRole;
