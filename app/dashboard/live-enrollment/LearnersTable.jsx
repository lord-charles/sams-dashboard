import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from "@mui/material/LinearProgress";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "@/app/components/ui/icons/searchicon";

const columns = [
  { id: "First Name", label: "First Name", minWidth: 10 },
  {
    id: "Last Name",
    label: "Last Name",
    minWidth: 20,
  },

  {
    id: "Reference Id",
    label: "Reference Id",
    minWidth: 10,
  },
  {
    id: "Class",
    label: "Class",
    minWidth: 10,
  },
  {
    id: "Education",
    label: "Education",
    minWidth: 10,
  },
  {
    id: "Gender",
    label: "Gender",
    minWidth: 20,
  },

  {
    id: "School",
    label: "School",
    minWidth: 40,
  },
  {
    id: "Promoted",
    label: "Promoted",
    minWidth: 20,
  },
  {
    id: "Dropped Out",
    label: "Dropped Out",
    minWidth: 20,
  },
];

const LearnersTable = ({ students, state, county, payam }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState(students);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClear = () => {
    setSearchQuery("");
    setFilteredData(students);
  };

  const handleSearchChange = (newValue) => {
    setSearchQuery(newValue);
    const filteredStudents = students.filter((student) => {
      const searchString = newValue.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(searchString) ||
        student.middleName.toLowerCase().includes(searchString) ||
        student.lastName.toLowerCase().includes(searchString) ||
        student.reference.toLowerCase().includes(searchString) ||
        student.learnerUniqueID.toString().includes(searchString) ||
        student.class.toString().includes(searchString)
      );
    });
    setFilteredData(filteredStudents);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const statusObj = {
    true: { color: "success" },
    false: { color: "error" },
  };

  const statusObj2 = {
    true: { color: "error" },
    false: { color: "success" },
  };

  useEffect(() => {
    setFilteredData(students);
  }, [students]);

  // console.log(students);

  return (
    <>
      <Grid container spacing={6}>
        <div className="flex justify-between w-full  relative top-[50px] p-4 xxxs:flex-col md:flex-col lg:flex-row mx-5 items-center">
          <h2 className="p-4 font-bold font-serif text-[20px] text-center underline w-full relative left-5 ">
            Learners (state:{state}, County:{county}, Payam:{payam})
          </h2>
          <div className="w-full flex justify-center">
            <Input
              startContent={<SearchIcon />}
              isClearable
              className="min-w-[20%] xxxs:max-w-[100%] md:max-w-[80%] relative left-5 "
              placeholder="Search by name, ref, uniqueId, class..."
              value={searchQuery}
              onClear={handleClear}
              onValueChange={handleSearchChange}
            />
          </div>

          <div className="flex space-x-4 w-full justify-center py-2">
            <div className="flex space-x-1 items-center">
              <h2 className="font-semibold xxxs:text-[15px] md:text-[20px] underline">
                Total Male:
              </h2>
              <h2 className="font-bold font-serif xxxs:text-[15px] md:text-[20px] underline">
                {students
                  .filter(
                    (student) =>
                      student.gender.toLowerCase() === "m" ||
                      student.gender.toLowerCase() === "male"
                  )
                  .length?.toLocaleString()}
              </h2>
            </div>
            <div className="flex space-x-1 items-center">
              <h2 className="font-semibold xxxs:text-[15px] md:text-[20px] underline">
                Total Female:
              </h2>
              <h2 className="font-bold font-serif xxxs:text-[15px] md:text-[20px] underline">
                {students
                  .filter(
                    (student) =>
                      student.gender.toLowerCase() === "f" ||
                      student.gender.toLowerCase() === "female"
                  )
                  .length?.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>
        <Grid item xs={12}>
          <Card>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer
                sx={{ maxHeight: 740 }}
                className="z-0"
                style={{ zIndex: 0.5 }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column, index) => (
                        <TableCell
                          key={index}
                          align={column.align}
                          sx={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  {students?.length > 0 ? (
                    <TableBody>
                      {filteredData
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item, index) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                            >
                              <TableCell align="left">
                                {index + 1}. {item?.firstName}
                              </TableCell>
                              <TableCell align="left">
                                {item?.lastName}
                              </TableCell>
                              <TableCell align="left">
                                {item?.reference}
                              </TableCell>
                              <TableCell align="left">{item?.class}</TableCell>
                              <TableCell align="left">
                                {item?.education}
                              </TableCell>
                              <TableCell align="left">{item?.gender}</TableCell>
                              <TableCell align="left">{item?.school}</TableCell>
                              <TableCell key={index * 10 + 100}>
                                <Chip
                                  label={item?.isPromoted ? "true" : "false"}
                                  color={
                                    statusObj[
                                      item?.isPromoted ? "true" : "false"
                                    ].color
                                  }
                                  sx={{
                                    height: 24,
                                    fontSize: "0.75rem",
                                    textTransform: "capitalize",
                                    "& .MuiChip-label": { fontWeight: 500 },
                                  }}
                                />
                              </TableCell>
                              <TableCell key={index * 10 + 100}>
                                <Chip
                                  label={item?.isDroppedOut ? "true" : "false"}
                                  color={
                                    statusObj2[
                                      item?.isDroppedOut ? "true" : "false"
                                    ].color
                                  }
                                  sx={{
                                    height: 24,
                                    fontSize: "0.75rem",
                                    textTransform: "capitalize",
                                    "& .MuiChip-label": { fontWeight: 500 },
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCell className="w-[97vw] absolute">
                          <LinearProgress />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
              {students?.length > 0 ? (
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={students.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              ) : null}
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default LearnersTable;
