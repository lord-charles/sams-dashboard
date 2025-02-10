import { Chip } from "@nextui-org/chip";
import StudentActions from "./studentActions";

const columns = [
  //
  { name: "First Name", uid: "firstName" },
  { name: "Middle Name", uid: "middleName" },
  { name: "Last Name", uid: "lastName" },
  { name: "School", uid: "school" },
  { name: "Age", uid: "age" },
  { name: "Gender", uid: "gender" },
  { name: "Form", uid: "form" },
  { name: "Attendance", uid: "attendance" },
  { name: "Class", uid: "class" },
  { name: "Code", uid: "code" },

  { name: "Reference", uid: "reference" },
  { name: "Dropped Out", uid: "isDroppedOut" },
  { name: "Promoted", uid: "isPromoted" },

  { name: "Actions", uid: "actions" },
];

export const studentRender = ({ row, columnKey }) => {
  const cellValue = row[columnKey];
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  switch (columnKey) {
    case "stDOB":
      return (
        <p className="capitalize">
          {new Date(cellValue)?.toLocaleString("en-us", options)}
        </p>
      );
    case "isDroppedOut":
    case "isPromoted":
      return (
        <Chip
          className="capitalize text-xs p-3"
          color={cellValue ? "success" : "danger"}
          size="sm"
          variant="flat"
        >
          {cellValue ? "Yes" : "No"}
        </Chip>
      );
    case "actions":
      return <StudentActions row={row} />;
    default:
      return cellValue;
  }
};

export { columns };
