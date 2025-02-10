import { base_url } from "@/app/utils/baseUrl";
import { CtLearners } from "../../../../components/ct-learners";

async function getLearnersData(code: string, tranche: string, year: string) {
  try {
    const res = await fetch(
      `${base_url}ct/get/learners?code=${code}&tranche=${tranche}&year=${year}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch learners data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching learners data:", error);
    return { data: [] };
  }
}

export default async function LearnersPage({
  params,
}: {
  params: { code: string; tranche: string; year: string };
}) {
  const data = await getLearnersData(params.code, params.tranche, params.year);

  return (
    <div>
      <CtLearners data={data?.data || []} />
    </div>
  );
}
