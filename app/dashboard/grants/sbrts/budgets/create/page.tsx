import axios from "axios";
import CreateBudgetData from "./create-budget";
import { base_url } from "@/app/utils/baseUrl";

async function getInitialData() {
  try {
    const budgetCodes = await axios.get(`${base_url}budget-codes`);
    return {
      budgetCodes: budgetCodes.data,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      budgetCodes: [],
    };
  }
}

export default async function LearnerModule() {
  const { budgetCodes } = await getInitialData();

  return <CreateBudgetData budgetCodes={budgetCodes} />;
}
