import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";

interface RevenueItem {
  id: string;
  budgetCode: string;
  description: string;
  amount: number;
  sourceCode: string;
}

interface Category {
  id: string;
  categoryName: string;
  categoryCode: string;
  items: RevenueItem[];
}

interface Group {
  id: string;
  groupName: "OPEX" | "CAPEX";
  categories: Category[];
}

interface RevenueStore {
  groups: Group[];
  addGroup: (groupName: "OPEX" | "CAPEX") => void;
  removeGroup: (groupIndex: number) => void;
  addCategory: (
    groupIndex: number,
    categoryName: string,
    categoryCode: string
  ) => void;
  removeCategory: (groupIndex: number, categoryIndex: number) => void;
  addRevenueItem: (groupIndex: number, categoryIndex: number) => void;
  removeRevenueItem: (
    groupIndex: number,
    categoryIndex: number,
    itemIndex: number
  ) => void;
  updateRevenueItem: (
    groupIndex: number,
    categoryIndex: number,
    itemIndex: number,
    updates: Partial<RevenueItem>
  ) => void;
  reset: () => void;
}

export const useRevenueStore = create<RevenueStore>()(
  persist(
    (set) => ({
      groups: [],
      addGroup: (groupName) =>
        set((state) => ({
          groups: [
            ...state.groups,
            {
              id: uuidv4(),
              groupName,
              categories: [],
            },
          ],
        })),
      removeGroup: (groupIndex) =>
        set((state) => ({
          groups: state.groups.filter((_, index) => index !== groupIndex),
        })),
      addCategory: (groupIndex, categoryName, categoryCode) =>
        set((state) => {
          const newGroups = [...state.groups];
          if (newGroups[groupIndex]) {
            // Check if category already exists
            const categoryExists = newGroups[groupIndex].categories.some(
              (cat) => cat.categoryName === categoryName
            );
            if (!categoryExists) {
              newGroups[groupIndex].categories.push({
                id: uuidv4(),
                categoryName,
                categoryCode,
                items: [],
              });
            }
          }
          return { groups: newGroups };
        }),
      removeCategory: (groupIndex, categoryIndex) =>
        set((state) => {
          const newGroups = [...state.groups];
          if (newGroups[groupIndex]) {
            newGroups[groupIndex].categories = newGroups[
              groupIndex
            ].categories.filter((_, index) => index !== categoryIndex);
          }
          return { groups: newGroups };
        }),
      addRevenueItem: (groupIndex, categoryIndex) =>
        set((state) => {
          const newGroups = [...state.groups];
          if (
            newGroups[groupIndex] &&
            newGroups[groupIndex].categories[categoryIndex]
          ) {
            newGroups[groupIndex].categories[categoryIndex].items.push({
              id: uuidv4(),
              budgetCode: "",
              description: "",
              amount: 0,
              sourceCode: "",
            });
          }
          return { groups: newGroups };
        }),
      removeRevenueItem: (groupIndex, categoryIndex, itemIndex) =>
        set((state) => {
          const newGroups = [...state.groups];
          if (
            newGroups[groupIndex] &&
            newGroups[groupIndex].categories[categoryIndex]
          ) {
            newGroups[groupIndex].categories[categoryIndex].items = newGroups[
              groupIndex
            ].categories[categoryIndex].items.filter(
              (_, index) => index !== itemIndex
            );
          }
          return { groups: newGroups };
        }),
      updateRevenueItem: (groupIndex, categoryIndex, itemIndex, updates) =>
        set((state) => {
          const newGroups = [...state.groups];
          if (
            newGroups[groupIndex] &&
            newGroups[groupIndex].categories[categoryIndex] &&
            newGroups[groupIndex].categories[categoryIndex].items[itemIndex]
          ) {
            newGroups[groupIndex].categories[categoryIndex].items[itemIndex] = {
              ...newGroups[groupIndex].categories[categoryIndex].items[
                itemIndex
              ],
              ...updates,
            };
          }
          return { groups: newGroups };
        }),
      reset: () => set({ groups: [] }),
    }),
    {
      name: "revenue-storage",
    }
  )
);
