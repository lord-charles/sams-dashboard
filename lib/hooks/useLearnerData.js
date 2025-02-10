import { useQuery } from "@tanstack/react-query";
import {
  totalStudentsPerStatePromoted,
  getLearnerCountByLocation,
  getPromotedLearnersCountByLocation,
  getDisabledLearnersCountByLocation,
} from "../../services/learners.service";

// Custom hook to get total students per state promoted
const useTotalStudentsPerStatePromoted = (body) => {
  return useQuery({
    queryKey: ["totalStudentsPerStatePromoted", body],
    queryFn: () => totalStudentsPerStatePromoted(body),
    // Optionally, you can set more options like `staleTime`, `cacheTime`, etc.
  });
};

// Custom hook to get learner count by location
const useLearnerCountByLocation = (body) => {
  return useQuery({
    queryKey: ["learnerCountByLocation", body],
    queryFn: () => getLearnerCountByLocation(body),
    // Optionally, you can set more options like `staleTime`, `cacheTime`, etc.
  });
};

// Custom hook to get promoted learners count by location
const usePromotedLearnersCountByLocation = (body) => {
  return useQuery({
    queryKey: ["promotedLearnersCountByLocation", body],
    queryFn: () => getPromotedLearnersCountByLocation(body),
    // Optionally, you can set more options like `staleTime`, `cacheTime`, etc.
  });
};

// Custom hook to get disabled learners count by location
const useDisabledLearnersCountByLocation = (body) => {
  return useQuery({
    queryKey: ["disabledLearnersCountByLocation", body],
    queryFn: () => getDisabledLearnersCountByLocation(body),
    // Optionally, you can set more options like `staleTime`, `cacheTime`, etc.
  });
};

export {
  useTotalStudentsPerStatePromoted,
  useLearnerCountByLocation,
  usePromotedLearnersCountByLocation,
  useDisabledLearnersCountByLocation,
};
