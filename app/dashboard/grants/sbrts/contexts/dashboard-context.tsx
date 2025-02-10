"use client";

import React, { createContext, useState, ReactNode } from "react";

interface DashboardContextType {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedSchoolType: string;
  setSelectedSchoolType: (type: string) => void;
}

export const DashboardContext = createContext<DashboardContextType>({
  selectedYear: "2024",
  setSelectedYear: () => {},
  selectedSchoolType: "All Schools",
  setSelectedSchoolType: () => {},
});

export const DashboardProvider: React.FC<{
  children: ReactNode;
  initialYear: string;
  initialSchoolType: string;
}> = ({ children, initialYear, initialSchoolType }) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedSchoolType, setSelectedSchoolType] =
    useState(initialSchoolType);

  return (
    <DashboardContext.Provider
      value={{
        selectedYear,
        setSelectedYear,
        selectedSchoolType,
        setSelectedSchoolType,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
