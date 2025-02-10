// ** React Imports
import { useState, Fragment } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Collapse from "@mui/material/Collapse";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

// ** Icons Imports
import ChevronUp from "mdi-material-ui/ChevronUp";
import ChevronDown from "mdi-material-ui/ChevronDown";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "@/app/components/ui/icons/searchicon";

const Row = (props) => {
  // ** Props
  const { row } = props;

  // ** State
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>

        <TableCell>{row._id}</TableCell>
        <TableCell>
          {row?.enumerators.reduce(
            (total, enumerator) => total + enumerator.totalStudentsByEnumerator,
            0
          ) || 0}
        </TableCell>
        <TableCell>
          {row?.enumerators.reduce(
            (total, enumerator) =>
              total + enumerator.totalStudentsDroppedByEnumerator,
            0
          ) || 0}
        </TableCell>
        <TableCell>{row.state10}</TableCell>
        <TableCell>{row.county28}</TableCell>
        <TableCell>{row.payam28}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: "0 !important" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Enumerators
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Enumerator</TableCell>
                    <TableCell>Total Enrolled</TableCell>
                    <TableCell>Total Dropped Out</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.enumerators.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {item.enumerator}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {item.totalStudentsByEnumerator}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {item.totalStudentsDroppedByEnumerator}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

const EnrollmentTodayCollapsibleTable = ({
  schoolsEnrollmentToday,
  formattedDate,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filteredData, setFilteredData] = useState(schoolsEnrollmentToday);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredData(schoolsEnrollmentToday);
      return;
    }
    const filtered = schoolsEnrollmentToday.filter((school) => {
      // Search within _id, payam28, state10, and county28 fields
      const matches = Object.values(school).some((value) =>
        typeof value === "string"
          ? value.toLowerCase().includes(query.toLowerCase())
          : false
      );
      // Search within enumerators array
      const enumeratorMatches = school.enumerators.some((enumerator) =>
        enumerator.enumerator?.toLowerCase().includes(query.toLowerCase())
      );
      return matches || enumeratorMatches;
    });
    setFilteredData(filtered);
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilteredData(schoolsEnrollmentToday);
  };

  return (
    <>
      <div className="flex items-center justify-between py-4 xxxs:flex-col lg:flex-row gap-2">
        <h2 className="p-4 font-bold font-serif text-[20px] text-center underline">
          Today&apos;s Enrollments ({formattedDate})
        </h2>
        <Input
          startContent={<SearchIcon />}
          isClearable
          className="w-full min-w-[20%] xxxs:max-w-[95%]  lg:max-w-[30%]"
          placeholder="Search by school,state,payam,enumerator..."
          value={searchQuery}
          onClear={handleClear}
          onValueChange={handleSearchChange}
        />
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1 items-center">
            <h2 className="text-[20px] font-semibold underline">
              Total Enrolled:
            </h2>
            <h2 className="underline font-bold font-serif text-[20px]">
              {schoolsEnrollmentToday
                .reduce(
                  (total, item) =>
                    total +
                    (item.enumerators[0]?.totalStudentsByEnumerator || 0),
                  0
                )
                .toLocaleString()}
            </h2>
          </div>
          <div className="flex space-x-1 items-center">
            <h2 className="text-[20px] font-semibold underline">
              Total Dropped Out:
            </h2>
            <h2 className="underline font-bold font-serif text-[20px]">
              {schoolsEnrollmentToday
                .reduce(
                  (total, item) =>
                    total +
                    (item.enumerators[0].totalStudentsDroppedByEnumerator || 0),
                  0
                )
                .toLocaleString()}
            </h2>
          </div>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Schools</TableCell>
              <TableCell>Total Enrolled</TableCell>
              <TableCell>Total Dropped Out</TableCell>
              <TableCell>State</TableCell>
              <TableCell>County</TableCell>
              <TableCell>Payam</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <Row key={index} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {schoolsEnrollmentToday.length > 0 ? (
        <TablePagination
          rowsPerPageOptions={[10, 15, 25, 50, 75, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}
    </>
  );
};

export default EnrollmentTodayCollapsibleTable;
