import React from "react";
import RolesTable from "./RolesTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  return (
    <>
      <RolesTable />
      <ToastContainer />
    </>
  );
};

export default Page;
