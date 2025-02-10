import React from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import UpdateLearnerComponent from "@/app/dashboard/learners/components/update-learner";

async function fetchLearnerData(learnerId) {
  try {
    const response = await axios.get(
      `${base_url}data-set/2023_data/students/${learnerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching learner details:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const learner = await fetchLearnerData(params.learner);

  if (!learner) {
    return {
      title: `SAMS | Learner Not Found`,
      description: "SAMS - Learner Details Unavailable",
    };
  }

  return {
    title: `SAMS | ${learner.firstName} - Details`,
    description: `Details and information about ${learner.firstName}.`,
  };
}

export default async function LearnerDetails({ params }) {
  const learner = await fetchLearnerData(params.learner);

  if (!learner) {
    return <div>Learner not found</div>;
  }
  return (
    <div>
      {/* Pass the fetched learner data to the UpdateLearnerComponent */}
      <UpdateLearnerComponent learner={learner} />
    </div>
  );
}
