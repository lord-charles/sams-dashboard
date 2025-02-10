"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import CardSkeleton from "@/app/CardSkeleton";
import StatisticsCard from "./StatisticsCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LearnersTable from "./LearnersTable";
import SchoolsPendingEnrollment from "./PendingEnrollment";
import axios from "axios";
import Lottie from "react-lottie";
import { base_url } from "@/app/utils/baseUrl";
import {
  Backdrop,
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  List,
  Menu,
  MenuItem,
  Select,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import State10EnrollmentSummaryCollapsibleTable from "./State10EnrollmentSummaryCollapsibleTable";
import EnrollmentTodayCollapsibleTable from "./EnrollmentTodayCollapsibleTable ";
import animationData from "../../../public/lottie/loading.json";
import SchoolsInPayam from "./SchoolsInPayam";
import { saveAs } from "file-saver";
import json2csv from "json2csv";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  // Extract day, month, and year
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString().slice(-2);
  // Construct the date string in "dd/mm/yy" format
  const formattedDate = `${day}/${month}/${year}`;

  const [Schools, setSchools] = useState([]);
  const [states, setStates] = useState([]);
  const [state, setState] = useState(null);

  const [schools, setschools] = useState([]);
  const [school, setschool] = useState([]);
  const [payams, setPayams] = useState([]);
  const [payam, setPayam] = useState([]);
  const [counties, setCounties] = useState([]);
  const [county, setCounty] = useState([]);
  const [students, setStudents] = useState([]);
  const [totalLearnersPerState, setTotalLearnersPerState] = useState([]);
  const [totalNewLearnersPerState, setTotalNewLearnersPerState] = useState([]);
  const [totalDroppedLearnersPerState, setTotalDroppedLearnersPerState] =
    useState([]);
  const [totalDisabledLearnersPerState, setTotalDisabledLearnersPerState] =
    useState([]);
  const [schoolsEnrollmentToday, setSchoolsEnrollmentToday] = useState([]);
  const [state10EnrollmentSummary, setState10EnrollmentSummary] = useState([]);

  const [selected, setSelected] = useState(1);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedPayam, setSelectedPayam] = useState("");
  const [isSchoolsPending, setIsSchoolsPending] = useState(true);
  const [schoolsInPayam, setSchoolsInPayam] = useState([]);
  const [isLoadingSchoolsInPayam, setIsLoadingSchoolsInPayam] = useState(false);
  const [currentSelectedEnumerator, setCurrentSelectedEnumerator] =
    useState("");
  const [reportEnrollment, setReportEnrollment] = useState([]);

  const [isLoading, setIsloading] = useState(false);

  const [width, setWidth] = useState(null);

  //download data per state
  const [trips, setTrips] = useState([]);
  const [saving, setSaving] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [remainingTrips, setRemainingTrips] = useState(0);
  const [remainingDocuments, setRemainingDocuments] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [percentageDone, setPercentageDone] = useState(0);
  const [progress, setProgress] = useState(0);
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  const stateCredentials = {
    AAA: { username: "AAA", password: "AAA123" },
    CES: { username: "CES", password: "CES456" },
    EES: { username: "EES", password: "EES789" },
    JGL: { username: "JGL", password: "JGL234" },
    LKS: { username: "LKS", password: "LKS567" },
    NBG: { username: "NBG", password: "NBG890" },
    PAA: { username: "PAA", password: "PAA345" },
    RAA: { username: "RAA", password: "RAA678" },
    UNS: { username: "UNS", password: "UNS901" },
    UTY: { username: "UTY", password: "UTY456" },
    WBG: { username: "WBG", password: "WBG789" },
    WES: { username: "WES", password: "WES012" },
    WRP: { username: "WRP", password: "WRP345" },
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Add event listener to update width on resize
    window.addEventListener("resize", handleResize);

    // Initial width
    setWidth(window.innerWidth);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const downloadReport = async (currentState) => {
    try {
      const res = await axios.get(`${base_url}report?state10=${currentState}`);
      console.log(res.data);
      setReportEnrollment(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadEnrollmentReport = (data) => {
    if (data.length < 1) {
      return toast.error("No data, Please select a state!");
    }

    if (!state) {
      return toast.error("Please select a state!");
    }

    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

    // Admin credentials check
    if (username === "sams@admin2024" && password === "ssams2024@") {
      const csvData = json2csv.parse(data);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `${state}.csv`);
      setReportEnrollment([]);
      setTrips([]);
      setProgress(0);
      setDownloadCompleted(false);
      return; // Exit the function after admin download
    }

    const validCredentials = stateCredentials[state];

    if (!validCredentials) {
      return toast.error("Invalid state selected!");
    }

    if (
      username !== validCredentials.username ||
      password !== validCredentials.password
    ) {
      return alert("Invalid username or password!");
    }

    // Proceed with download for state-specific users
    const csvData = json2csv.parse(data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${state}.csv`);
    setReportEnrollment([]);
    setTrips([]);
    setProgress(0);
    setDownloadCompleted(false);
  };

  const handleChangeState = (event) => {
    setState(event.target.value);
    downloadReport(event.target.value);
  };

  const handleChangeCounty = (event) => {
    setCounty(event.target.value);
  };

  const handleChangePayam = (event) => {
    setPayam(event.target.value);
  };

  const handleChangeSchool = (event) => {
    setschool(event.target.value);
  };

  const getSchoolsPending = async (
    selectedState,
    selectedCounty,
    selectedPayam
  ) => {
    try {
      setIsloading(true);
      setIsSchoolsPending(true);

      const response = await axios.post(
        `${base_url}data-set/findNotEnrolledSchools`,
        {
          state10: selectedState || "CES",
          county28: selectedCounty || "",
          payam28: selectedPayam || "",
        }
      );
      // console.log(response.data);
      setSchools(response.data);
      getCounties(selectedState);
    } catch (err) {
      console.log(err);
    } finally {
      setIsloading(false);
    }
  };

  const getSchoolsPending2 = async (
    selectedState,
    selectedCounty,
    selectedPayam
  ) => {
    try {
      setIsloading(true);
      setIsSchoolsPending(true);

      // console.log(
      //   "selectedState",
      //   selectedState,
      //   "selectedCounty",
      //   selectedCounty,
      //   "selectedPayam",
      //   selectedPayam
      // );
      const response = await axios.post(
        `${base_url}data-set/findNotEnrolledSchools`,
        {
          state10: selectedState || "CES",
          county28: selectedCounty || "",
          payam28: selectedPayam || "",
        }
      );
      // console.log(response.data);
      setSchools(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setIsloading(false);
      }, 8000);
    }
  };

  const getStates = async () => {
    try {
      setIsloading(true);
      const res = await axios.get(`${base_url}data-set/get/2023_data/state`);
      setStates(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  const getCounties = async (selectedState) => {
    try {
      setIsloading(true);
      setIsSchoolsPending(true);

      const res = await axios.post(`${base_url}data-set/get/2023_data/county`, {
        state: selectedState,
      });
      setCounties(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  const getPayams = async (selectedCounty) => {
    try {
      setIsloading(true);
      setIsSchoolsPending(true);

      const res = await axios.post(
        `${base_url}data-set/get/2023_data/county/payam`,
        { county28: selectedCounty }
      );
      setPayams(res.data);
      getSchoolsPending2(state, selectedCounty);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  const getSchools = async (selectedPayam) => {
    try {
      setIsloading(true);

      const res = await axios.post(
        `${base_url}data-set/get/2023_data/county/payam/schools`,
        { payam28: selectedPayam }
      );
      setschools(res.data);
      getSchoolsPending2(state, county, selectedPayam);

      // console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  const getStudents = async (selectedSchool) => {
    console.log("selectedSchool:", selectedSchool);

    try {
      setIsloading(true);

      const res = await axios.post(
        `${base_url}data-set/get/2023_data/county/payam/schools/students`,
        { schoolName: selectedSchool }
      );
      setStudents(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchTotalLearners = async () => {
    try {
      const res = await axios.post(`${base_url}data-set/fetchSchoolsPerState`);
      setTotalLearnersPerState(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchoolInPayam = async (payam28, selectedEnumerator) => {
    try {
      setIsLoadingSchoolsInPayam(true);
      setCurrentSelectedEnumerator(selectedEnumerator);

      const res = await axios.post(
        `${base_url}data-set/getUniqueSchoolsDetailsPayam`,
        { payam28, modifiedBy: selectedEnumerator || "" }
      );
      setSchoolsInPayam(res.data);
      // Scroll down by 500 pixels
      window.scrollBy({
        top: 3500,
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingSchoolsInPayam(false);
    }
  };

  const fetchTotalNewLearnersPerState = async () => {
    try {
      const res = await axios.post(
        `${base_url}data-set/totalNewStudentsPerState`
      );
      setTotalNewLearnersPerState(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalDroppedoutLearnersPerState = async () => {
    try {
      const res = await axios.post(
        `${base_url}data-set/totalNewStudentsPerStateDroppedOut`
      );
      setTotalDroppedLearnersPerState(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalDisabledLearnersPerState = async () => {
    try {
      const res = await axios.post(
        `${base_url}data-set/totalNewStudentsPerStateDisabled`
      );
      setTotalDisabledLearnersPerState(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchoolsEnrollmentToday = async () => {
    try {
      const res = await axios.post(
        `${base_url}data-set/fetchSchoolsEnrollmentToday`
      );
      setSchoolsEnrollmentToday(res.data);
      // console.log("today", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchState10EnrollmentSummary = async () => {
    try {
      const res = await axios.post(
        `${base_url}data-set/fetchState10EnrollmentSummary`
      );
      setState10EnrollmentSummary(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchState10EnrollmentSummary();
    getStates();
    fetchTotalLearners();
    setTimeout(() => {
      fetchTotalNewLearnersPerState();
    }, 1000);
    setTimeout(() => {
      fetchTotalDroppedoutLearnersPerState();
    }, 2000);
    setTimeout(() => {
      fetchTotalDisabledLearnersPerState();
    }, 3000);
    setTimeout(() => {
      fetchSchoolsEnrollmentToday();
    }, 4000);
  }, []);

  const colors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "red",
    "pink",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "red",
    "pink",
  ];

  const totalLearnersPerStateMappedData = totalLearnersPerState.map((item) => ({
    name: item._id,
    uv: item.schoolCount,
    pv: 2500, // You can assign any default value for pv and amt
    amt: 1500,
  }));

  const totalNewLearnersPerStateMappedData = totalNewLearnersPerState.map(
    (item) => ({
      name: item.state10,
      uv: item.count,
      pv: 2500, // You can assign any default value for pv and amt
      amt: 1500,
    })
  );

  const totalDr0ppedLearnersPerStateMappedData =
    totalDroppedLearnersPerState.map((item) => ({
      name: item.state10,
      uv: item.count,
      pv: 2500, // You can assign any default value for pv and amt
      amt: 1500,
    }));

  const totalDisabledLearnersPerStateMappedData =
    totalDisabledLearnersPerState.map((item) => ({
      name: item.state10,
      uv: item.count,
      pv: 2500, // You can assign any default value for pv and amt
      amt: 1500,
    }));

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
  Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, // Your animation JSON data
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchStateData = async (state, page = 1) => {
    if (!state) {
      return toast.error("Please select a state to continue.");
    }
    console.log("starting fetch for page", page);

    setSaving(true);
    setDownloadCompleted(false);

    try {
      const res = await axios.get(
        `${base_url}data-set/get/2023_data?state10=${state}&page=${page}`
      );

      // Extract data from response
      const { totalPages, remainingDocuments } = res.data;

      const data = res.data.data; // `data` is an array

      console.log(data);
      // Save the fetched data in trips state
      setTrips((prevTrips) => [...prevTrips, ...data]);

      // Calculate remaining trips and remaining documents
      const remainingTrips = totalPages - page;
      setRemainingTrips(remainingTrips);
      setRemainingDocuments(remainingDocuments);
      setTotalTrips(totalPages);

      // Calculate percentage of overall task done
      const percentageDone = ((totalPages - remainingTrips) / totalPages) * 100;
      setProgress(percentageDone);
      setPercentageDone(percentageDone);

      // Fetch next page if there are remaining trips
      if (remainingTrips > 0) {
        fetchStateData(state, page + 1);
      }
      if (remainingTrips < 1) {
        setTimeout(() => {
          setSaving(false);
          setIsDisabled(false);
          setPercentageDone(1);
          setRemainingTrips(0);
          setRemainingDocuments(0);
          setDownloadCompleted(true);
        }, 2000);
      }
    } catch (error) {
      console.log("error", error);
      setSaving(false);
      setIsDisabled(false);
    }
  };

  //drawer
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [stateDrawer, setStateDrawer] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  // const toggleDrawer = (anchor, open) => (event) => {
  //   if (state === null) {
  //     return toast.error("Please select a state!");
  //   }
  //   if (
  //     event &&
  //     event.type === "keydown" &&
  //     (event.key === "Tab" || event.key === "Shift")
  //   ) {
  //     return;
  //   }

  //   setStateDrawer({ ...stateDrawer, [anchor]: open });
  // };

  const toggleDrawer = (anchor, open) => (event) => {
    if (state === null) {
      return toast.error("Please select a state!");
    }

    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    if (open) {
      const username = prompt("Enter your username:");
      const password = prompt("Enter your password:");
      if (username === "sams@admin2024" && password === "ssams2024@") {
        return setStateDrawer({ ...stateDrawer, [anchor]: open });
      }

      const validCredentials = stateCredentials[state];

      if (!validCredentials) {
        return toast.error("Invalid state selected!");
      }

      if (
        username !== validCredentials.username ||
        password !== validCredentials.password
      ) {
        return alert(`Invalid username or password for state ${state}`);
      }
    }

    setStateDrawer({ ...stateDrawer, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <div className="h-[200px]">
          <div>
            <h2 className="font-bold text-center underline text-[20px]">
              Generate report for {state}
            </h2>
            <span className="justify-end flex relative top-[-30px] right-3">
              <Button
                className="bg-gray-200"
                color="error"
                onClick={toggleDrawer(anchor, false)}
              >
                Close
              </Button>
            </span>
          </div>

          <Box className="mx-20">
            <LinearProgressWithLabel value={progress} className="h-3" />
          </Box>
        </div>
      </List>
    </Box>
  );

  //progress bar
  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          {saving ? (
            <Button
              size="large"
              color="success"
              className="bg-gray-200 mb-4"
              variant="outlined"
            >
              Downloading...
            </Button>
          ) : (
            <Button
              size="large"
              color="success"
              className="bg-gray-200 mb-4"
              variant="outlined"
              onClick={() => fetchStateData(state)}
            >
              Start
            </Button>
          )}
          {downloadCompleted && (
            <Button
              size="large"
              color="success"
              className="bg-gray-200 mb-4 xxxs:ml-0 md:ml-5"
              variant="outlined"
              onClick={() => handleDownloadEnrollmentReport(trips)}
            >
              SAVE CSV FILE
            </Button>
          )}
          <LinearProgress variant="determinate" {...props} color="success" />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Toaster />
      <Suspense fallback={<CardSkeleton />}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <Lottie options={defaultOptions} height={200} width={400} />
        </Backdrop>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => handleDownloadEnrollmentReport(reportEnrollment)}
          >
            Summary Report
          </MenuItem>
          <MenuItem onClick={toggleDrawer("bottom", true)}>
            Detailed Report
          </MenuItem>
        </Menu>

        <div>
          <React.Fragment>
            <SwipeableDrawer
              anchor={"bottom"}
              open={stateDrawer["bottom"]}
              // onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer("bottom", true)}
            >
              {list("bottom")}
            </SwipeableDrawer>
          </React.Fragment>
        </div>

        <Card className="mx-5 mb-5">
          <CardBody>
            <div className="mb-3 justify-between items-center flex mx-4">
              <h4 className="text-[20px]  font-bold r">
                Live Enrollment {currentYear}
              </h4>

              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="text-green-500 bg-gray-200 relative md:right-[70px] xxxs:right-5"
                color="inherit"
              >
                Report
              </Button>
            </div>

            <div className="gap-5 grid xxxs:grid-cols-1 sm:grid-cols-4 mt-6 justify-end">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">State</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state}
                  label="Age"
                  onChange={handleChangeState}
                >
                  {states.map((item, index) => {
                    return (
                      <MenuItem
                        value={item.state}
                        key={index}
                        onClick={() => {
                          setSelectedState(item.state),
                            getSchoolsPending(item.state);
                        }}
                      >
                        {item.state}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {/* counties  */}
              <div>
                {counties.length > 0 && (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      County
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={county}
                      label="Age"
                      onChange={handleChangeCounty}
                    >
                      {counties.map((item, index) => {
                        return (
                          <MenuItem
                            value={item._id}
                            key={index}
                            onClick={() => {
                              setSelectedCounty(item._id), getPayams(item._id);
                            }}
                          >
                            {item._id}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              </div>

              {/* payams   */}
              <div>
                {payams.length > 0 && (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Payam</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={payam}
                      label="Age"
                      onChange={handleChangePayam}
                    >
                      {payams.map((item, index) => {
                        return (
                          <MenuItem
                            value={item._id}
                            key={index}
                            onClick={() => {
                              setSelectedPayam(item._id), getSchools(item._id);
                            }}
                          >
                            {item._id}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              </div>

              {/* schools  */}
              <div>
                {schools.length > 0 && (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      schools
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={school}
                      label="Age"
                      onChange={handleChangeSchool}
                    >
                      {schools.map((item, index) => {
                        return (
                          <MenuItem
                            value={item.school}
                            key={index}
                            onClick={() => getStudents(item.school)}
                          >
                            {item.school}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              </div>
            </div>

            <StatisticsCard
              totalLearnersPerState={totalLearnersPerState}
              selected={selected}
              setSelected={setSelected}
              totalNewLearnersPerState={totalNewLearnersPerState}
              totalDroppedLearnersPerState={totalDroppedLearnersPerState}
              totalDisabledLearnersPerState={totalDisabledLearnersPerState}
            />

            {/* graphs  */}
            <div className="mt-[30px] flex justify-center">
              {totalLearnersPerState.length > 0 && selected === 1 && (
                <div className="relative">
                  <BarChart
                    width={
                      width > 1024
                        ? width - 480
                        : width < 500
                        ? width + 300
                        : width
                    }
                    height={300}
                    data={totalLearnersPerStateMappedData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar
                      dataKey="uv"
                      fill="#8884d8"
                      shape={<TriangleBar />}
                      label={{ position: "top" }}
                    >
                      {totalLearnersPerStateMappedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
              )}

              {totalNewLearnersPerState.length > 0 && selected === 2 && (
                <div className="relative">
                  <BarChart
                    width={
                      width > 1024
                        ? width - 480
                        : width < 500
                        ? width + 300
                        : width
                    }
                    height={300}
                    data={totalNewLearnersPerStateMappedData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar
                      dataKey="uv"
                      fill="#8884d8"
                      shape={<TriangleBar />}
                      label={{ position: "top" }}
                    >
                      {totalNewLearnersPerStateMappedData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % 20]}
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </div>
              )}

              {totalDroppedLearnersPerState.length > 0 && selected === 3 && (
                <div className="relative">
                  <BarChart
                    width={
                      width > 1024
                        ? width - 480
                        : width < 500
                        ? width + 300
                        : width
                    }
                    height={300}
                    data={totalDr0ppedLearnersPerStateMappedData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar
                      dataKey="uv"
                      fill="#8884d8"
                      shape={<TriangleBar />}
                      label={{ position: "top" }}
                    >
                      {totalDr0ppedLearnersPerStateMappedData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % 20]}
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </div>
              )}

              {totalDisabledLearnersPerState.length > 0 && selected === 4 && (
                <div className="relative">
                  <BarChart
                    width={
                      width > 1024
                        ? width - 480
                        : width < 500
                        ? width + 300
                        : width
                    }
                    height={300}
                    data={totalDisabledLearnersPerStateMappedData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar
                      dataKey="uv"
                      fill="#8884d8"
                      shape={<TriangleBar />}
                      label={{ position: "top" }}
                    >
                      {totalDisabledLearnersPerStateMappedData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % 20]}
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </Suspense>

      {students.length > 0 && (
        <Suspense fallback={<CardSkeleton />}>
          <Card className="mx-5 mb-5">
            <CardBody>
              <LearnersTable
                students={students}
                state={state}
                county={county}
                payam={payam}
              />
            </CardBody>
          </Card>
        </Suspense>
      )}

      {(Schools?.enrolledSchools?.length > 0 ||
        Schools?.notEnrolledSchools?.length > 0) && (
        <Suspense fallback={<CardSkeleton />}>
          <Card className="mx-5 mb-5">
            <CardBody>
              <SchoolsPendingEnrollment
                Schools={Schools}
                selectedState={selectedState}
                selectedCounty={selectedCounty}
                selectedPayam={selectedPayam}
                isSchoolsPending={isSchoolsPending}
                setIsSchoolsPending={setIsSchoolsPending}
              />
            </CardBody>
          </Card>
        </Suspense>
      )}

      {schoolsEnrollmentToday.length > 0 && (
        <Suspense fallback={<CardSkeleton />}>
          <Card className="mx-5 mb-5">
            <CardBody>
              <EnrollmentTodayCollapsibleTable
                schoolsEnrollmentToday={schoolsEnrollmentToday}
                formattedDate={formattedDate}
              />
            </CardBody>
          </Card>
        </Suspense>
      )}

      {state10EnrollmentSummary.length > 0 ? (
        <Card className="mx-5 mb-5">
          <CardBody>
            <State10EnrollmentSummaryCollapsibleTable
              fetchSchoolInPayam={fetchSchoolInPayam}
              formattedDate={formattedDate}
              state10EnrollmentSummary={state10EnrollmentSummary}
              isLoadingSchoolsInPayam={isLoadingSchoolsInPayam}
            />
          </CardBody>
        </Card>
      ) : isLoading ? null : (
        <Lottie options={defaultOptions} height={200} width={400} />
      )}

      {schoolsInPayam.length > 0 && (
        <Card className="mx-5 mb-5">
          <CardBody>
            <SchoolsInPayam
              schools={schoolsInPayam}
              isLoadingSchoolsInPayam={isLoading}
              currentSelectedEnumerator={currentSelectedEnumerator}
            />
          </CardBody>
        </Card>
      )}

      <ToastContainer />
    </>
  );
};

export default Page;
