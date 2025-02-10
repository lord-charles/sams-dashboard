import { Checkbox } from "@nextui-org/checkbox";

const columns = [
  { name: "Name", uid: "name" },
  { name: "Create", uid: "create" },
  { name: "Read", uid: "read" },
  { name: "Update", uid: "update" },
  { name: "Delete", uid: "delete" },
];

export const permissionsRender = ({ row, columnKey }) => {
  const cellValue = row[columnKey];
  switch (columnKey) {
    case "create":
    case "read":
    case "update":
    case "delete":
      return (
        <Checkbox
          isSelected={cellValue}
          classNames={{
            label: "text-small",
          }}
        />
      );
    default:
      return cellValue;
  }
};

export { columns };
