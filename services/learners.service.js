import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_MOBILE_API_URL;

export async function getLearnerDetailsById(id) {
  try {
    const response = await axios.get(
      `${BASE_URL}data-set/2023_data/students/${id}`
    );
    console.log(id);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch learner details: ${response.statusText}`
      );
    }

    const learner = await response.json();
    return learner;
  } catch (error) {
    console.error("Error fetching learner details:", error);
    return null;
  }
}
