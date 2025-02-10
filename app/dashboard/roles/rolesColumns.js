import RoleActions from "./roleActions";

const columns = [
  { name: "Name", uid: "name" },
  { name: "Created At", uid: "createdAt" },
  { name: "Action", uid: "actions" },
];

export const rolesRender = ({ row, columnKey }) => {
  const cellValue = row[columnKey];
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  switch (columnKey) {
    case "name":
      return <p className="capitalize">{cellValue}</p>;
    case "createdAt":
      return (
        <p className="capitalize">
          {new Date(cellValue)?.toLocaleString("en-us", options)}
        </p>
      );
    case "actions":
      return <RoleActions row={row} />;
    default:
      return cellValue;
  }
};

export { columns };
