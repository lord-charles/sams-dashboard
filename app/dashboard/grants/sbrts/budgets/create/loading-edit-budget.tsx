"use client";
import React, { useState, useEffect } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useBudgetStore } from "@/app/store/budget-store";
import { useMetaStore } from "@/app/store/meta-store";
import { useRevenueStore } from "@/app/store/revenue-store";
import { toast } from "@/components/ui/use-toast";
import { base_url } from "@/app/utils/baseUrl";

const loadingStates = [
  {
    text: "Initializing connection to server",
  },
  {
    text: "Authenticating and validating session",
  },
  {
    text: "Fetching budget details from server",
  },
  {
    text: "Processing budget data",
  },
  {
    text: "Storing budget information in local storage",
  },
  {
    text: "Validating stored data integrity",
  },
  {
    text: "Preparing budget editor interface",
  },
  {
    text: "Finalizing setup for editing",
  },
];

export default function LoadingEditBudget() {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams?.get("code");
  const year = searchParams?.get("year");

  // Zustand store actions
  const {
    reset: resetBudget,
    groups: budgetGroups,
    addGroup: addBudgetGroup,
    addCategory: addBudgetCategory,
    addBudgetItem,
    updateBudgetItem,
  } = useBudgetStore();
  const {
    reset: resetMeta,
    meta,
    updateClassLevels,
    updateEnrolment,
    updateAttendance,
    updateTeachers,
    updateLearners,
    updateClassrooms,
    updateGovernance,
    updateBudget,
  } = useMetaStore();
  const {
    reset: resetRevenue,
    groups: revenueGroups,
    addGroup: addRevenueGroup,
    addCategory: addRevenueCategory,
    addRevenueItem,
    updateRevenueItem,
  } = useRevenueStore();

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        // Reset budget ID in localStorage first
        localStorage.removeItem("budgetId");

        if (!code || !year) {
          throw new Error("Missing code or year parameters");
        }

        const response = await axios.get(
          `${base_url}budget/code/${code}/${year}`
        );
        const budgetData = response.data;
        console.log("Budget Data:", budgetData);

        // Store the budget ID in localStorage
        if (budgetData._id) {
          localStorage.setItem("budgetId", budgetData._id);
        }

        // Reset all stores
        resetBudget();
        resetMeta();
        resetRevenue();

        // Process and store meta data
        if (budgetData.meta) {
          const {
            classLevels,
            latestAttendance,
            learners,
            teachers,
            classrooms,
            governance,
            impact,
            subCommitteeResponsible,
            preparation,
          } = budgetData.meta;
          updateClassLevels(classLevels || []);
          updateAttendance(latestAttendance || 0);
          if (learners) updateLearners(learners);
          if (teachers) updateTeachers(teachers);
          if (classrooms) updateClassrooms(classrooms);
          if (governance) updateGovernance(governance);
          if (impact || subCommitteeResponsible || preparation) {
            updateBudget({
              impact,
              committee: {
                name: subCommitteeResponsible?.subCommitteeName,
                ...subCommitteeResponsible,
              },
              preparation,
            });
          }
        }

        // Process and store budget data
        if (budgetData.budget?.groups) {
          console.log("Creating budget groups...");
          // First, create all groups
          budgetData.budget.groups.forEach((groupData: any) => {
            console.log(`Creating group:`, groupData.group);
            // Ensure we're passing the correct group type
            const groupType = groupData.group.toUpperCase() as "OPEX" | "CAPEX";
            addBudgetGroup(groupType);
          });

          console.log("Processing categories and items...");
          // Then process each group's categories and items
          budgetData.budget.groups.forEach(
            (groupData: any, groupIndex: number) => {
              console.log(`Processing group ${groupIndex}:`, groupData.group);

              if (groupData.categories) {
                groupData.categories.forEach(
                  (category: any, categoryIndex: number) => {
                    console.log(
                      `Adding category to group ${groupIndex}:`,
                      category.categoryName
                    );

                    // Add category with proper initialization
                    addBudgetCategory(
                      groupIndex,
                      category.categoryName || "",
                      category.categoryCode || ""
                    );

                    // Process items for this category
                    if (category.items) {
                      category.items.forEach((item: any, itemIndex: number) => {
                        // First add the budget item
                        addBudgetItem(groupIndex, categoryIndex);

                        // Transform needed items into the correct structure
                        const neededItemsArray = item.neededItems || [];
                        const numItems = neededItemsArray.length;

                        // Calculate per-item costs if there are items
                        const unitCost =
                          numItems > 0 ? Number(item.unitCostSSP) || 0 : 0;
                        const quantity =
                          numItems > 0
                            ? Math.ceil(Number(item.units) / numItems) || 0
                            : 0;
                        const totalCost =
                          numItems > 0
                            ? Math.ceil(Number(item.totalCostSSP) / numItems) ||
                              0
                            : 0;

                        const formattedNeededItems = neededItemsArray.map(
                          (neededItem: any) => ({
                            name:
                              typeof neededItem === "string"
                                ? neededItem
                                : neededItem.name || "",
                            unitCost,
                            quantity,
                            totalCost,
                          })
                        );

                        // Update the budget item with all required fields
                        updateBudgetItem(groupIndex, categoryIndex, itemIndex, {
                          id:
                            item._id ||
                            `${groupIndex}-${categoryIndex}-${itemIndex}`,
                          budgetCode: item.budgetCode || "",
                          description: item.description || "",
                          neededItems: formattedNeededItems,
                          fundingSource: item.fundingSource || "",
                          monthActivityToBeCompleted:
                            item.monthActivityToBeCompleted || "",
                          subCommitteeResponsible:
                            item.subCommitteeResponsible || "",
                          adaptationCostPercentageLWD:
                            item.adaptationCostPercentageLWD || "",
                          impact: item.impact || "",
                        });
                      });
                    }
                  }
                );
              }
            }
          );
        }

        // Process and store revenue data
        if (budgetData.revenues) {
          // First, create all revenue groups
          const uniqueGroups = Array.from(
            new Set(budgetData.revenues.map((r: any) => r.type))
          );
          for (const groupName of uniqueGroups) {
            addRevenueGroup(groupName as "OPEX" | "CAPEX");
          }

          const groupedRevenues = budgetData.revenues.reduce(
            (acc: any, revenue: any) => {
              if (!acc[revenue.type]) {
                acc[revenue.type] = {};
              }
              if (!acc[revenue.type][revenue.category]) {
                acc[revenue.type][revenue.category] = [];
              }
              acc[revenue.type][revenue.category].push(revenue);
              return acc;
            },
            {}
          );

          Object.entries(groupedRevenues).forEach(
            ([groupName, categories]: [string, any], groupIndex: number) => {
              Object.entries(categories).forEach(
                (
                  [categoryName, items]: [string, any],
                  categoryIndex: number
                ) => {
                  addRevenueCategory(
                    groupIndex,
                    categoryName,
                    items[0].sourceCode
                  );
                  items.forEach((item: any, itemIndex: number) => {
                    addRevenueItem(groupIndex, categoryIndex);
                    updateRevenueItem(groupIndex, categoryIndex, itemIndex, {
                      id: item._id || Math.random().toString(),
                      budgetCode: item.sourceCode,
                      description: item.description,
                      amount: item.amount,
                      sourceCode: item.sourceCode,
                    });
                  });
                }
              );
            }
          );
        }

        // Wait for a moment to show the completion state
        setTimeout(() => {
          setLoading(false);
          const params = new URLSearchParams(searchParams?.toString());
          params.set("tab", "general");
          params.set("edit", "false");
          router.push(`?${params.toString()}`, {
            scroll: false,
          });
        }, 14000);
      } catch (error) {
        console.error("Error fetching budget data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load budget data. Please try again.",
        });
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [code, year]);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
    </div>
  );
}
