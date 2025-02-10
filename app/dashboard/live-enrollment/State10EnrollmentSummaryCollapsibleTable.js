// ** React Imports
import { useState, Fragment, forwardRef } from "react";

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
import Lottie from "react-lottie";

// ** Icons Imports
import ChevronUp from "mdi-material-ui/ChevronUp";
import ChevronDown from "mdi-material-ui/ChevronDown";
import { Chip, Input } from "@nextui-org/react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Backdrop } from "@mui/material";
import animationData from "../../../public/lottie/loading.json";

const currentYear = new Date().getFullYear();
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Row = (props) => {
  // ** Props
  const {
    row,
    handleClickOpen,
    setModalDataPayams,
    setModalDataCounties,
    setSelectedEnumerator,
    setOpen2,
  } = props;

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
          {
            row?.state10Details.filter((detail) => "modifiedBy" in detail)
              .length
          }
        </TableCell>

        <TableCell>
          {row?.stats[`${currentYear - 1}`]?.toLocaleString()}
        </TableCell>
        <TableCell>
          {row?.stats[`${currentYear}`]?.toLocaleString() || 0}
        </TableCell>

        <TableCell>
          <Chip>
            {row?.stats[`${currentYear}`] > row?.stats[`${currentYear - 1}`] ? (
              <div className="flex  items-center ">
                <ChevronUp color="success" />
                <h2 className="text-green-500 text-[13px] font-semibold">
                  +
                  {Math.abs(
                    ((row?.stats[`${currentYear - 1}`] -
                      row?.stats[`${currentYear}`] || 0) /
                      row?.stats[`${currentYear - 1}`]) *
                      100
                  ).toFixed(2)}
                  %
                </h2>
              </div>
            ) : (
              <div className="flex  items-center ">
                <ChevronDown color="error" />
                <h2 className="text-red-500 text-[13px] font-semibold">
                  -
                  {(
                    ((row?.stats[`${currentYear - 1}`] -
                      row?.stats[`${currentYear}`] ||
                      row?.stats[`${currentYear - 1}`]) /
                      row?.stats[`${currentYear - 1}`]) *
                    100
                  ).toFixed(2)}
                  %
                </h2>
              </div>
            )}
          </Chip>
        </TableCell>
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
                    <TableCell>Total Schools Attended</TableCell>
                    <TableCell>Total payams Attended</TableCell>
                    <TableCell>Total counties Attended</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.state10Details
                    .filter((detail) => detail.modifiedBy)
                    .map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {detail.modifiedBy}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {detail.totalEnrolled?.toLocaleString()}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {detail.totalDropped?.toLocaleString()}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {detail.totalSchools?.toLocaleString()}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="flex items-center gap-x-4">
                            {detail.uniquePayam28?.length || 0}
                            <IconButton
                              onClick={() => {
                                setModalDataPayams(detail?.uniquePayam28),
                                  setSelectedEnumerator(detail?.modifiedBy),
                                  handleClickOpen();
                              }}
                            >
                              <Chip color="secondary">
                                <h2 className="text-[13px] font-bold">View</h2>
                              </Chip>
                            </IconButton>
                          </div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="flex items-center gap-x-4">
                            {detail.uniqueCounty28?.length || 0}
                            <IconButton
                              onClick={() => {
                                setModalDataCounties(detail?.uniqueCounty28),
                                  setSelectedEnumerator(detail?.modifiedBy),
                                  setOpen2(true);
                              }}
                            >
                              <Chip color="secondary">
                                <h2 className="text-[13px] font-bold">View</h2>
                              </Chip>
                            </IconButton>
                          </div>
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

const State10EnrollmentSummaryCollapsibleTable = ({
  state10EnrollmentSummary,
  fetchSchoolInPayam,
  isLoadingSchoolsInPayam,
}) => {
  const calculateTotalStats2023 = (stateDetails) => {
    // Initialize total to 0
    let total2023 = 0;

    // Iterate through each state detail
    stateDetails.forEach((detail) => {
      // Check if the detail contains stats for the year 2023
      if (detail.stats && detail.stats["2023"]) {
        // Add the value of 2023 to the total
        total2023 += detail.stats["2023"];
      }
    });

    return total2023;
  };

  const calculateTotalStats2024 = (stateDetails) => {
    // Initialize total to 0
    let total2024 = 0;

    // Iterate through each state detail
    stateDetails.forEach((detail) => {
      // Check if the detail contains stats for the year 2024
      if (detail.stats && detail.stats["2024"]) {
        // Add the value of 2024 to the total
        total2024 += detail.stats["2024"];
      }
    });

    return total2024;
  };
  const totalEnumerators = state10EnrollmentSummary.reduce((total, state) => {
    // Sum up the modifiedByCount for all state10Details objects in the current state
    const stateEnumerators = state.state10Details.reduce((sum, detail) => {
      return sum + (detail.modifiedBy ? 1 : 0);
    }, 0);

    // Add the state's enumerators count to the total
    return total + stateEnumerators;
  }, 0);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [modalDataPayams, setModalDataPayams] = useState([]);
  const [modalDataCounties, setModalDataCounties] = useState([]);
  const [selectedEnumerator, setSelectedEnumerator] = useState("");

  console.log(selectedEnumerator);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, // Your animation JSON data
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <h2 className="p-4 font-bold font-serif text-[20px] text-center underline">
        Overall Enumerators Enrollment {new Date().getFullYear()}
      </h2>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>State</TableCell>
              <TableCell>Enumerators</TableCell>
              <TableCell>Total 2023</TableCell>
              <TableCell>Total 2024</TableCell>
              <TableCell>Delta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state10EnrollmentSummary?.map((row, index) => (
              <Row
                key={index}
                row={row}
                index={index}
                handleClickOpen={handleClickOpen}
                setModalDataPayams={setModalDataPayams}
                setModalDataCounties={setModalDataCounties}
                setSelectedEnumerator={setSelectedEnumerator}
                setOpen2={setOpen2}
              />
            ))}

            <TableRow>
              <TableCell rowSpan={4} />
              <TableCell colSpan={1}>
                <h2 className="text-[16px] font-bold">Total</h2>
              </TableCell>
              <TableCell align="left">
                <h2 className="text-[16px] font-bold">{totalEnumerators}</h2>
              </TableCell>
              <TableCell align="left">
                <h2 className="text-[16px] font-bold">
                  {calculateTotalStats2023(
                    state10EnrollmentSummary
                  )?.toLocaleString()}
                </h2>
              </TableCell>
              <TableCell align="left">
                <h2 className="text-[16px] font-bold">
                  {calculateTotalStats2024(
                    state10EnrollmentSummary
                  )?.toLocaleString()}
                </h2>
              </TableCell>
              <TableCell align="left">
                <Chip>
                  <div className="flex  items-center ">
                    <ChevronDown color="error" />
                    <h2 className="text-red-500 text-[16px] font-bold">
                      -
                      {(
                        ((calculateTotalStats2023(state10EnrollmentSummary) -
                          calculateTotalStats2024(state10EnrollmentSummary)) /
                          calculateTotalStats2023(state10EnrollmentSummary)) *
                        100
                      )
                        .toFixed(2)
                        .toLocaleString()}
                      %
                    </h2>
                  </div>
                </Chip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle className="text-center">
          Payams allocated to {selectedEnumerator}
        </DialogTitle>
        <DialogContent>
          {modalDataPayams.map((item, index) => {
            return (
              <div key={index} className="flex items-center justify-between">
                <h2>
                  {index + 1}.{item}
                </h2>
                <IconButton
                  className="hover:bg-white"
                  onClick={() => {
                    handleClose(), fetchSchoolInPayam(item, selectedEnumerator);
                  }}
                >
                  <Chip color="success" className="text-white">
                    View Schools
                  </Chip>
                </IconButton>
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="text-red-500 bg-gray-300">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="sm"
        onClose={() => setOpen2(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Counties allocated to {selectedEnumerator}</DialogTitle>
        <DialogContent>
          {modalDataCounties.map((item, index) => {
            return (
              <div key={index} className="flex items-center justify-between">
                <h2>
                  {index + 1}.{item}
                </h2>
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen2(false)}
            className="text-red-500 bg-gray-300"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoadingSchoolsInPayam}
      >
        <Lottie options={defaultOptions} height={200} width={400} />
      </Backdrop>
    </>
  );
};

export default State10EnrollmentSummaryCollapsibleTable;
