import { Metadata } from "next";
import React from "react";
import axios from "axios";
import { base_url } from "@/app/utils/baseUrl";
import BudgetPage from "../../components/view-budget";

type PageProps = {
  params: {
    budget: string;
    year: string;
    slug?: string;
  };
};

async function getBudgetInfo(code: string, year: string) {
  try {
    const response = await axios.get(`${base_url}budget/code/${code}/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching budget:", error);
    return null;
  }
}

async function getSchoolInfo(code: string) {
  try {
    const response = await axios.get(
      `${base_url}school-data/school/code/${code}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching school:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; budget: string; year: string };
}): Promise<Metadata> {
  const [budgetInfo, schoolInfo] = await Promise.all([
    getBudgetInfo(params.budget, params.year),
    getSchoolInfo(params.budget),
  ]);

  return {
    title: `${budgetInfo?.code} - Budget Details`,
    description: `Details and information about ${
      schoolInfo?.name || budgetInfo?.code
    }`,
  };
}

export default async function ViewBudget({ params }: PageProps) {
  const [budgetInfo, schoolInfo] = await Promise.all([
    getBudgetInfo(params.budget, params.year),
    getSchoolInfo(params.budget),
  ]);

  console.log("Budget Data:", budgetInfo);

  return (
    <BudgetPage
      budgetData={budgetInfo}
      schoolData={schoolInfo}
      year={params.year}
    />
  );
}
