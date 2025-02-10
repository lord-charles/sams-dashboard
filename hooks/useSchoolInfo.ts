import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SchoolInfo {
  id: string;
  schoolName: string;
  code: string;
  state10: string;
  county28: string;
  payam28: string;
  // Add other school properties as needed
}

export const useSchoolInfo = () => {
  const router = useRouter();
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedSchool = window.localStorage.getItem("selectedSchool");
        const parsedSchool = storedSchool ? JSON.parse(storedSchool) : null;

        if (!parsedSchool || Object.keys(parsedSchool).length === 0) {
          router.push("/dashboard/schools");
          return;
        }

        setSchoolInfo(parsedSchool);
      }
    } catch (error) {
      console.error("Error loading school info:", error);
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return { schoolInfo, isLoading };
};
