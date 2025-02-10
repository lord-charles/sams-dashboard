import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddRole from "./AddRole";

const Page = () => {
  return (
    <>
      <AddRole />
      <ToastContainer />
    </>
  );
};

export default Page;
