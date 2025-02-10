import React from "react";
import { Metadata } from "next";
import { RegisterTeacherComponent } from "../components/teacher-registration";

export const metadata: Metadata = {
  title: "SAMS | New Learner",
  description: "SAMS",
};
const RegisterLearner = () => {
  return (
    <div>
      <RegisterTeacherComponent />
    </div>
  );
};

export default RegisterLearner;
