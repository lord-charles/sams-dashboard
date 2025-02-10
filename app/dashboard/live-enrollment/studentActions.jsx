"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { toast } from "react-toastify";

const StudentActions = ({ row }) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_MOBILE_API_URL}/data-set/student/delete/${row?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const message = await result.json();
      if (result.ok) {
        toast.success(message?.message);
        router.refresh();
      } else {
        toast.error(message?.error);
      }
    } catch (error) {
      toast.error("Unknown error! Please contact System Administrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex justify-start items-center gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button color="primary" variant="solid">
              Action
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="view"
              as={NextLink}
              href={`/dashboard/live-enrollment/view/${row?._id}`}
            >
              View
            </DropdownItem>
            <DropdownItem
              key="edit"
              as={NextLink}
              href={`/dashboard/live-enrollment/edit/${row?._id}`}
            >
              Edit
            </DropdownItem>
            <DropdownItem
              key="delete"
              color="danger"
              onPress={onOpen}
              className="text-danger"
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto">
        <ModalContent>
          {(onClose) => (
            <>
              <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1">
                  Delete student {`${row?.firstName} ${row?.lastName}`}
                </ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to delete{" "}
                    {`${row?.firstName} ${row?.lastName}`}?{" "}
                    <span className="font-bold">
                      This action cannot be reverted!
                    </span>
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    isLoading={loading}
                    color="danger"
                    type="submit"
                    onPress={onClose}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default StudentActions;
