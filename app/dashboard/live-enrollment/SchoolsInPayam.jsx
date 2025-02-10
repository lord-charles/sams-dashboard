// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// ** React Imports

import React, { useEffect, useState } from "react";
import { Input, Spinner } from "@nextui-org/react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from "@mui/material/LinearProgress";
import { SearchIcon } from "@/app/components/ui/icons/searchicon";
import { ChevronDown } from "mdi-material-ui";
import { base_url } from "@/app/utils/baseUrl";
import axios from "axios";
import { Backdrop } from "@mui/material";

const currentYear = new Date().getFullYear();

const columns = [
  { id: "School", label: "School", minWidth: 10 },
  { id: "Code", label: "Code", minWidth: 10 },
  { id: "State", label: "State", minWidth: 10 },
  { id: "County", label: "County", minWidth: 10 },
  { id: "Payam", label: "Payam", minWidth: 10 },
  { id: "Total Enrolled", label: "Total Enrolled", minWidth: 10 },

  {
    id: `Learners(${currentYear - 1})`,
    label: `Learners(${currentYear - 1})`,
    minWidth: 10,
  },
  {
    id: `Learners(${currentYear})`,
    label: `Learners(${currentYear})`,
    minWidth: 10,
  },
];

const SchoolsInPayam = ({
  schools,
  isLoadingSchoolsInPayam,
  currentSelectedEnumerator,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState(schools);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredData(schools);
  }, [schools]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Function to handle search query change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Filter the schools based on the search query
    const filteredSchools = schools.filter((school) =>
      school.school.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filteredSchools);
  };

  // Function to handle clearing the search query
  const handleClear = () => {
    setSearchQuery("");
    setFilteredData(schools); // Reset filtered data to original schools data
  };

  return (
    <>
      <Grid container spacing={6}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoadingSchoolsInPayam}
        >
          <Spinner size="lg" />
        </Backdrop>
        <Grid item xs={12}>
          <div>
            <div className="flex md:flex-row xxxs:flex-col  items-center justify-between mx-0 space-x-3">
              <h2 className="p-4 font-bold font-serif text-[20px] text-center underline ">
                Schools allocated to {currentSelectedEnumerator}
              </h2>
              <Input
                startContent={<SearchIcon />}
                isClearable
                className="w-full min-w-[20%] xxxs:max-w-[80%] md:max-w-[30%]"
                placeholder="Search school..."
                value={searchQuery}
                onClear={handleClear}
                onValueChange={handleSearchChange}
              />
            </div>
          </div>

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
                  {schools?.length > 0 ? (
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
                              <TableCell align="left" className="capitalize">
                                {index + 1}. {item?.school}
                              </TableCell>
                              <TableCell align="left" className="capitalize">
                                {item?.code}
                              </TableCell>
                              <TableCell align="left" className="capitalize">
                                {item?.state10}
                              </TableCell>

                              <TableCell align="left" className="capitalize">
                                {item?.county28}
                              </TableCell>
                              <TableCell align="left" className="capitalize">
                                {item?.payam28}
                              </TableCell>
                              <TableCell align="left" className="capitalize">
                                {item?.totalStudents?.toLocaleString()}
                              </TableCell>

                              {item?.yearDetails
                                ?.filter(
                                  (detail) => detail.year === currentYear - 1
                                )
                                .map((item, index) => (
                                  <TableCell className="capitalize" key={index}>
                                    <p>Total: {item?.totalStudents}</p>
                                    <p>Dropped: {item?.totalDroppedOut}</p>
                                  </TableCell>
                                ))}

                              {item?.yearDetails
                                ?.filter(
                                  (detail) => detail.year === currentYear
                                )
                                .map((detail, index) => (
                                  <TableCell className="capitalize" key={index}>
                                    <p>Total: {detail?.totalStudents || 0}</p>
                                    <p>
                                      Dropped: {detail?.totalDroppedOut || 0}
                                    </p>
                                  </TableCell>
                                ))}
                              {(!item?.yearDetails ||
                                !item.yearDetails.some(
                                  (detail) => detail.year === currentYear
                                ) ||
                                item?.yearDetails?.length < 2) && (
                                <TableCell className="capitalize">
                                  <p>Total: 0</p>
                                  <p>Dropped: 0</p>
                                </TableCell>
                              )}
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
              {schools?.length > 0 ? (
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={schools.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  className="py-4"
                />
              ) : null}
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default SchoolsInPayam;
