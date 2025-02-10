import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NeededItem {
  name: string;
  unitCost: number;
  quantity: number;
  totalCost: number;
}

export interface BudgetItem {
  id: string;
  budgetCode: string;
  description: string;
  neededItems: NeededItem[];
  fundingSource: string;
  monthActivityToBeCompleted: string;
  subCommitteeResponsible: string;
  adaptationCostPercentageLWD: string;
  impact: string;
}

export interface Category {
  id: string;
  categoryName: string;
  categoryCode: string;
  items: BudgetItem[];
}

export interface Group {
  id: string;
  groupName: string;
  categories: Category[];
}

interface BudgetStore {
  groups: Group[];
  addGroup: (groupType: "OPEX" | "CAPEX") => void;
  removeGroup: (groupIndex: number) => void;
  addCategory: (
    groupIndex: number,
    categoryName: string,
    categoryCode: string
  ) => void;
  removeCategory: (groupIndex: number, categoryIndex: number) => void;
  addBudgetItem: (groupIndex: number, categoryIndex: number) => void;
  removeBudgetItem: (
    groupIndex: number,
    categoryIndex: number,
    itemIndex: number
  ) => void;
  addNeededItem: (
    groupIndex: number,
    categoryIndex: number,
    itemIndex: number,
    item: NeededItem
  ) => void;
  removeNeededItem: (
    groupIndex: number,
    categoryIndex: number,
    itemIndex: number,
    neededItemIndex: number
  ) => void;
  updateBudgetItem: (
    groupIndex: number,
    categoryIndex: number,
    itemIndex: number,
    updates: Partial<BudgetItem>
  ) => void;
  reset: () => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      groups: [],
      addGroup: (groupType) =>
        set((state) => {
          const existingGroup = state.groups.some(
            (group) => group.groupName === groupType
          );
          if (existingGroup) {
            return state;
          }
          return {
            groups: [
              ...state.groups,
              {
                id: Math.random().toString(),
                groupName: groupType,
                categories: [],
              },
            ],
          };
        }),
      removeGroup: (groupIndex) =>
        set((state) => ({
          groups: state.groups.filter((_, index) => index !== groupIndex),
        })),
      addCategory: (groupIndex, categoryName, categoryCode) =>
        set((state) => {
          const newGroups = [...state.groups];
          const existingCategory = newGroups[groupIndex].categories.some(
            (category) => category.categoryName === categoryName
          );
          if (existingCategory) {
            return state;
          }
          newGroups[groupIndex].categories.push({
            id: Math.random().toString(),
            categoryName,
            categoryCode,
            items: [],
          });
          return { groups: newGroups };
        }),
      removeCategory: (groupIndex, categoryIndex) =>
        set((state) => {
          const newGroups = [...state.groups];
          newGroups[groupIndex].categories.splice(categoryIndex, 1);
          return { groups: newGroups };
        }),
      addBudgetItem: (groupIndex, categoryIndex) =>
        set((state) => {
          const newGroups = [...state.groups];
          newGroups[groupIndex].categories[categoryIndex].items.push({
            id: Math.random().toString(),
            budgetCode: "",
            description: "",
            neededItems: [],
            fundingSource: "",
            monthActivityToBeCompleted: "",
            subCommitteeResponsible: "",
            adaptationCostPercentageLWD: "",
            impact: "",
          });
          return { groups: newGroups };
        }),
      removeBudgetItem: (groupIndex, categoryIndex, itemIndex) =>
        set((state) => {
          const newGroups = [...state.groups];
          newGroups[groupIndex].categories[categoryIndex].items.splice(
            itemIndex,
            1
          );
          return { groups: newGroups };
        }),
      addNeededItem: (groupIndex, categoryIndex, itemIndex, item) =>
        set((state) => {
          const newGroups = [...state.groups];
          newGroups[groupIndex].categories[categoryIndex].items[
            itemIndex
          ].neededItems.push(item);
          return { groups: newGroups };
        }),
      removeNeededItem: (
        groupIndex,
        categoryIndex,
        itemIndex,
        neededItemIndex
      ) =>
        set((state) => {
          const newGroups = [...state.groups];
          newGroups[groupIndex].categories[categoryIndex].items[
            itemIndex
          ].neededItems = newGroups[groupIndex].categories[categoryIndex].items[
            itemIndex
          ].neededItems.filter((_, index) => index !== neededItemIndex);
          return { groups: newGroups };
        }),

      updateBudgetItem: (groupIndex, categoryIndex, itemIndex, updates) =>
        set((state) => {
          const newGroups = [...state.groups];
          newGroups[groupIndex].categories[categoryIndex].items[itemIndex] = {
            ...newGroups[groupIndex].categories[categoryIndex].items[itemIndex],
            ...updates,
          };
          return { groups: newGroups };
        }),
      reset: () => set({ groups: [] }),
    }),
    {
      name: "budget-storage", // unique name for localStorage key
    }
  )
);
