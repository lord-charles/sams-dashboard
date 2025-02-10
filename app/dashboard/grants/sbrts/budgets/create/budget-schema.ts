import * as z from "zod";

export const budgetItemSchema = z.object({
  id: z.string(),
  budgetCode: z.string().min(1, "Budget code is required"),
  description: z.string().min(1, "Description is required"),
  neededItems: z.array(
    z.object({
      name: z.string().min(1, "Item name is required"),
      unitCost: z.number().min(0, "Unit cost must be 0 or greater"),
      quantity: z.number().min(0, "Quantity must be 0 or greater"),
      totalCost: z.number(),
    })
  ),
  fundingSource: z.string(),
  monthActivityToBeCompleted: z.string(),
  subCommitteeResponsible: z.string(),
  adaptationCostPercentageLWD: z.string(),
  impact: z.string(),
});

export const categorySchema = z.object({
  id: z.string(),
  categoryName: z.enum([
    "Physical Inputs",
    "Learning Quality",
    "General Support",
    "Other",
  ]),
  categoryCode: z.string().min(1, "Category code is required"),
  items: z.array(budgetItemSchema),
});

export const groupSchema = z.object({
  id: z.string(),
  group: z.enum(["OPEX", "CAPEX"]),
  categories: z.array(categorySchema),
});

export const budgetSchema = z.object({
  groups: z.array(groupSchema),
});

export type BudgetData = z.infer<typeof budgetSchema>;
export type GroupData = z.infer<typeof groupSchema>;
export type CategoryData = z.infer<typeof categorySchema>;
export type BudgetItemData = z.infer<typeof budgetItemSchema>;
