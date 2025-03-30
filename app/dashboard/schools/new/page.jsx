import React from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import AddSchoolForm from "../components/add-school-form";

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = async () => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${base_url}data-set/get/2023_data/state`);
      return {
        states: response.data,
      };
    } catch (error) {
      console.log(error);
      return {
        states: []
      };
    }
  };

  const { states } = await fetchData();
  return (
    <div>
     
      <AddSchoolForm states={states}  />
      </div>
  );
};

export default page;