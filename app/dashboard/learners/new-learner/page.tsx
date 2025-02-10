import React from "react";
import { Metadata } from "next";
import { RegisterLearnerComponent } from "../components/learner-registration";

export const metadata: Metadata = {
  title: "SAMS | New Learner",
  description: "SAMS",
};
const RegisterLearner = () => {
  return (
    <div>
      <RegisterLearnerComponent />
    </div>
  );
};

export default RegisterLearner;
