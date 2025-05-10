import React from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import UpdateTeacherComponent from "../components/update-teacher-component";

async function fetchTeacherData(teacherId) {
  try {
    const response = await axios.get(
      `${base_url}user/users/get/${teacherId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const teacher = await fetchTeacherData(params.teacher);

  if (!teacher) {
    return {
      title: `SAMS | Teacher Not Found`,
      description: "SAMS - Teacher Details Unavailable",
    };
  }

  return {
    title: `SAMS | ${teacher.firstName} - Details`,
    description: `Details and information about ${teacher.firstName}.`,
  };
}

export default async function TeacherDetails({ params }) {
  const teacher = await fetchTeacherData(params.teacher);

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  return (
    <div>
      <UpdateTeacherComponent teacher={teacher} />
    </div>
  );
}
