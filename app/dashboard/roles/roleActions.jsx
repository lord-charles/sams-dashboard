"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import React from "react";
import { toast } from "react-toastify";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
const RoleActions = ({ row }) => {
  const [loading, setLoading] = React.useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await fetch(`/api/v1/users/roles/${row?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const message = await result.json();
      console.log("before", message);
      if (result.ok) {
        console.log("after", message);
        toast.success(message?.message);
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
            <DropdownItem key="edit">View users</DropdownItem>

            <DropdownItem
              key="deactivate"
              className="text-danger"
              color="danger"
              onPress={onOpen}
            >
              Delete Role
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1">
                  Confirm Action
                </ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to delete this Role</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    isLoading={loading}
                    color="primary"
                    type="submit"
                    onPress={onClose}
                  >
                    Confirm
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

export default RoleActions;
