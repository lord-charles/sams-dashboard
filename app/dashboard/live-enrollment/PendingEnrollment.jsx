// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// ** React Imports

import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Spinner,
} from "@nextui-org/react";

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

const columns = [
  { id: "School", label: "School", minWidth: 10 },
  { id: "State", label: "State", minWidth: 10 },
  { id: "County", label: "County", minWidth: 10 },
  { id: "Payam", label: "Payam", minWidth: 10 },
];

const SchoolsPendingEnrollment = ({
  Schools,
  selectedState,
  selectedCounty,
  selectedPayam,
  isSchoolsPending,
  setIsSchoolsPending,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState(Schools.notEnrolledSchools);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledSchools, setEnrolledSchools] = useState([]);
  //  const [filteredData, setFilteredData] = useState(
  //    isSchoolsPending ? Schools.notEnrolledSchools : enrolledSchools
  //  );
  const [isLoading, setIsloading] = useState(false);


  useEffect(() => {
    setFilteredData(Schools.notEnrolledSchools);
  }, [Schools]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getSchoolsEnrolled = async () => {
    try {
      setIsloading(true);

      console.log(
        "selectedState",
        selectedState,
        "selectedCounty",
        selectedCounty,
        "selectedPayam",
        selectedPayam
      );
      const response = await axios.post(
        `${base_url}data-set/findEnrolledSchools`,
        {
          state10: selectedState || "",
          county28: selectedCounty || "",
          payam28: selectedPayam || "",
        }
      );
      // console.log("enrolled", response?.data?.enrolledSchools);
      setEnrolledSchools(response?.data?.enrolledSchools);
      setFilteredData(response?.data?.enrolledSchools);
      setIsSchoolsPending(false);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setIsloading(false);
      }, 1000);
    }
  };

  const filterSchools = (schools, query) => {
    return schools.filter((school) =>
      school.school.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterPendingSchools = (schools, query) => {
    return filterSchools(schools, query);
  };

  const filterEnrolledSchools = (schools, query) => {
    return filterSchools(schools, query);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredData(
        isSchoolsPending ? Schools.notEnrolledSchools : enrolledSchools
      );
      return;
    }
    const filtered = isSchoolsPending
      ? filterPendingSchools(Schools.notEnrolledSchools, query)
      : filterEnrolledSchools(enrolledSchools, query);
    setFilteredData(filtered);
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilteredData(
      isSchoolsPending ? Schools.notEnrolledSchools : enrolledSchools
    );
  };

  return (
    <>
      <Grid container spacing={6}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <Spinner size="lg" />
        </Backdrop>
        <Grid item xs={12}>
          <div className="flex items-center justify-evenly xxxs:flex-col md:flex-row">
            <h2 className="p-4 font-bold font-serif text-[20px] text-center underline">
              {!isSchoolsPending
                ? "Enrolled Schools"
                : "Schools Pending Enrollment"}{" "}
              {new Date().getFullYear()}
            </h2>

            <div className="flex flex-row  items-center justify-between md:w-[60%] xxxs:w-[100%] space-x-3">
              <Input
                startContent={<SearchIcon />}
                isClearable
                className="w-full min-w-[60%] xxxs:max-w-[80%] md:max-w-[60%]"
                placeholder="Search by school..."
                value={searchQuery}
                onClear={handleClear}
                onValueChange={handleSearchChange}
              />

              <div className="flex justify-end ">
                <Dropdown className="relative right-10">
                  <DropdownTrigger>
                    <Button variant="bordered">
                      <h2
                        className={`${
                          isSchoolsPending ? "text-red-500" : "text-green-500"
                        } font-bold`}
                      >
                        {!isSchoolsPending ? "Enrolled " : "Pending"}
                      </h2>
                      <ChevronDown />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem
                      onClick={() => {
                        setIsSchoolsPending(true);
                        setFilteredData(Schools.notEnrolledSchools);
                      }}
                      key="new"
                    >
                      Pending Enrollment
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        getSchoolsEnrolled();
                      }}
                      key="copy"
                    >
                      Commenced Enrollment
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
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
                  {Schools?.notEnrolledSchools?.length > 0 ? (
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
                                {item?.state10}
                              </TableCell>
                              <TableCell align="left" className="capitalize">
                                {item?.county28}
                              </TableCell>
                              <TableCell align="left" className="capitalize">
                                {item?.payam28}
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
              {Schools?.notEnrolledSchools?.length > 0 ? (
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={
                    isSchoolsPending
                      ? Schools?.notEnrolledSchools?.length
                      : enrolledSchools?.length
                  }
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

export default SchoolsPendingEnrollment;
