import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Teachers {
  estimatedFemale: number;
  estimatedMale: number;
  estimatedFemaleDisabled: number;
  estimatedMaleDisabled: number;
}

interface Learners {
  estimatedFemale: number;
  estimatedMale: number;
  estimatedFemaleDisabled: number;
  estimatedMaleDisabled: number;
}

interface Classrooms {
  permanent: number;
  temporary: number;
  openAir: number;
}

interface Governance {
  SGB: boolean;
  SDP: boolean;
  budgetSubmitted: boolean;
  bankAccount: boolean;
}

export interface Committee {
  name: string;
  chairperson: string;
  responsibilities: string;
}

interface Budget {
  impact: string;
  committee: Committee;
  preparation: {
    preparedBy: string;
    preparationDate: string;
    submittedBy: string;
  };
}

interface MetaData {
  classLevels: string[];
  estimateLearnerEnrolment: number;
  latestAttendance: number;
  teachers: Teachers;
  learners: Learners;
  classrooms: Classrooms;
  governance: Governance;
  budget: Budget;
}

interface MetaStore {
  meta: MetaData;
  updateClassLevels: (levels: string[]) => void;
  updateEnrolment: (value: number) => void;
  updateAttendance: (value: number) => void;
  updateTeachers: (updates: Partial<Teachers>) => void;
  updateLearners: (updates: Partial<Learners>) => void;
  updateClassrooms: (updates: Partial<Classrooms>) => void;
  updateGovernance: (updates: Partial<Governance>) => void;
  updateBudget: (updates: Partial<Budget>) => void;
  reset: () => void;
}

const initialState: MetaData = {
  classLevels: [],
  estimateLearnerEnrolment: 0,
  latestAttendance: 0,
  teachers: {
    estimatedFemale: 0,
    estimatedMale: 0,
    estimatedFemaleDisabled: 0,
    estimatedMaleDisabled: 0,
  },
  learners: {
    estimatedFemale: 0,
    estimatedMale: 0,
    estimatedFemaleDisabled: 0,
    estimatedMaleDisabled: 0,
  },
  classrooms: {
    permanent: 0,
    temporary: 0,
    openAir: 0,
  },
  governance: {
    SGB: false,
    SDP: false,
    budgetSubmitted: false,
    bankAccount: false,
  },
  budget: {
    impact: "",
    committee: {
      name: "",
      chairperson: "",
      responsibilities: "",
    },
    preparation: {
      preparedBy: "",
      preparationDate: "",
      submittedBy: "",
    },
  },
};

export const useMetaStore = create<MetaStore>()(
  persist(
    (set) => ({
      meta: initialState,
      updateClassLevels: (levels) =>
        set((state) => ({
          meta: { ...state.meta, classLevels: levels },
        })),
      updateEnrolment: (value) =>
        set((state) => ({
          meta: { ...state.meta, estimateLearnerEnrolment: value },
        })),
      updateAttendance: (value) =>
        set((state) => ({
          meta: { ...state.meta, latestAttendance: value },
        })),
      updateTeachers: (updates) =>
        set((state) => ({
          meta: {
            ...state.meta,
            teachers: { ...state.meta.teachers, ...updates },
          },
        })),
      updateLearners: (updates) =>
        set((state) => ({
          meta: {
            ...state.meta,
            learners: { ...state.meta.learners, ...updates },
          },
        })),
      updateClassrooms: (updates) =>
        set((state) => ({
          meta: {
            ...state.meta,
            classrooms: { ...state.meta.classrooms, ...updates },
          },
        })),
      updateGovernance: (updates) =>
        set((state) => ({
          meta: {
            ...state.meta,
            governance: { ...state.meta.governance, ...updates },
          },
        })),
      updateBudget: (updates) =>
        set((state) => ({
          meta: {
            ...state.meta,
            budget: {
              ...state.meta.budget,
              ...updates,
            },
          },
        })),
      reset: () => set({ meta: initialState }),
    }),
    {
      name: "meta-storage",
    }
  )
);
