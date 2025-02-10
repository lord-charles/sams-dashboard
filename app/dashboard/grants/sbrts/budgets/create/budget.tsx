"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  PlusCircle,
  X,
  Save,
  Trash2,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBudgetStore } from "@/app/store/budget-store";
import { useRevenueStore } from "@/app/store/revenue-store"; // Import useRevenueStore
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "./empty-state";
import { useMetaStore } from "@/app/store/meta-store"; // Import useMetaStore

const categoryOptions = [
  "Physical Inputs",
  "Learning Quality",
  "General Support",
] as const;
const groupOptions = ["OPEX", "CAPEX"] as const;
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export default function BudgetDataCollection({
  budgetCodes,
}: {
  budgetCodes: Array<{
    Expenditure: Array<{
      category: string;
      categoryCode: string;
      items: Array<{
        budgetCode: string;
        activityDescription: string;
      }>;
    }>;
    Revenue: Array<{
      category: string;
      categoryCode: string;
      items: Array<{
        budgetCode: string;
        activityDescription: string;
      }>;
    }>;
  }>;
}) {
  const { toast } = useToast();
  const {
    groups,
    addGroup,
    removeGroup,
    addCategory,
    removeCategory,
    addBudgetItem,
    removeBudgetItem,
    addNeededItem,
    removeNeededItem,
    updateBudgetItem,
    reset,
  } = useBudgetStore();

  const revenueGroups = useRevenueStore((state) => state.groups);
  const hasRevenueItems = revenueGroups.some((group) =>
    group.categories.some(
      (category) => category.items && category.items.length > 0
    )
  );
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Full Budget Data:", JSON.stringify(revenueGroups, null, 2));
    toast({
      title: "Budget Data Saved",
      description: "Your budget data has been saved successfully.",
    });
  };

  const handleReset = () => {
    reset();
    toast({
      title: "Budget Data Reset",
      description: "All budget data has been cleared.",
    });
  };

  // Helper function to get budget code options for a specific category
  const getBudgetCodeOptions = (categoryName: string) => {
    const expenditureCategory = budgetCodes[0]?.Expenditure.find(
      (cat) => cat.category === categoryName
    );
    return expenditureCategory ? expenditureCategory.items : [];
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Budget</CardTitle>
          <CardDescription>
            Create and manage your budget data efficiently
          </CardDescription>
        </div>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Budget Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all budget data from local
                  storage. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  Reset Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={onSubmit} variant="default">
            <Save className="mr-2 h-4 w-4" />
            Save Budget Data
          </Button>
        </div>
      </div>
      <div>
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 p-2 items-center">
              <Select
                onValueChange={(value: "OPEX" | "CAPEX") => addGroup(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select group type" />
                </SelectTrigger>
                <SelectContent>
                  {groupOptions?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {groups?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Start by selecting OPEX or CAPEX group type
                </p>
              )}
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {groups?.map((group, groupIndex) => (
            <AccordionItem
              value={`group-${groupIndex}`}
              key={group?.id}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <AccordionTrigger className="hover:no-underline">
                  <h3 className="text-lg font-semibold">{group?.groupName}</h3>
                </AccordionTrigger>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Group
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the group and all its categories and items.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          removeGroup(groupIndex);
                          toast({
                            title: "Group Removed",
                            description:
                              "The group has been successfully removed.",
                          });
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <AccordionContent>
                <div className="mt-4 mb-4 p-2">
                  <Select
                    onValueChange={(value) => {
                      const category = budgetCodes[0]?.Expenditure?.find(
                        (cat) => cat?.category === value
                      );
                      if (category) {
                        addCategory(groupIndex, value, category?.categoryCode);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Add new category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                >
                  {group?.categories?.map((category, categoryIndex) => (
                    <AccordionItem
                      value={`category-${groupIndex}-${categoryIndex}`}
                      key={category?.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex gap-2">
                            <h4 className="text-md font-medium">
                              {category?.categoryName}
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              ({category?.categoryCode})
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Category
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the category and all its
                                items.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  removeCategory(groupIndex, categoryIndex)
                                }
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <AccordionContent>
                        {category?.items?.map((item, itemIndex) => (
                          <Card
                            key={item?.id}
                            className="mb-6 border border-gray-200"
                          >
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <CardTitle>
                                  Budget Item {itemIndex + 1}
                                </CardTitle>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove Item
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete this budget
                                        item.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          removeBudgetItem(
                                            groupIndex,
                                            categoryIndex,
                                            itemIndex
                                          )
                                        }
                                      >
                                        Continue
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex flex-col space-y-4">
                                  <div className="flex gap-4">
                                    <div className="flex-1">
                                      <Label>Budget Code</Label>
                                      <Select
                                        value={item?.budgetCode}
                                        onValueChange={(value) => {
                                          const selectedItem =
                                            getBudgetCodeOptions(
                                              category?.categoryName
                                            ).find(
                                              (code) =>
                                                code.budgetCode === value
                                            );
                                          updateBudgetItem(
                                            groupIndex,
                                            categoryIndex,
                                            itemIndex,
                                            {
                                              budgetCode: value,
                                              description:
                                                selectedItem?.activityDescription ||
                                                "",
                                            }
                                          );
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Budget Code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getBudgetCodeOptions(
                                            category?.categoryName
                                          )?.map((code) => (
                                            <SelectItem
                                              key={code.budgetCode}
                                              value={code.budgetCode}
                                            >
                                              {code.budgetCode} -{" "}
                                              {code?.activityDescription}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex-1">
                                      <Label>Description</Label>
                                      <Input
                                        value={item?.description}
                                        onChange={(e) =>
                                          updateBudgetItem(
                                            groupIndex,
                                            categoryIndex,
                                            itemIndex,
                                            {
                                              description: e.target.value,
                                            }
                                          )
                                        }
                                        placeholder="Enter description"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <Label>Needed Items</Label>
                                    {item?.neededItems?.length === 0 ? (
                                      <>
                                        <div className="grid grid-cols-3 gap-2">
                                          <Input
                                            id={`newItem-name-${groupIndex}-${categoryIndex}-${itemIndex}`}
                                            placeholder="Item name"
                                          />
                                          <div>
                                            <Input
                                              id={`newItem-unitCost-${groupIndex}-${categoryIndex}-${itemIndex}`}
                                              type="number"
                                              placeholder={`Unit cost (${
                                                group.groupName === "CAPEX"
                                                  ? "USD"
                                                  : "SSP"
                                              })`}
                                            />
                                          </div>
                                          <Input
                                            id={`newItem-quantity-${groupIndex}-${categoryIndex}-${itemIndex}`}
                                            type="number"
                                            placeholder="Quantity"
                                          />
                                        </div>
                                        <Button
                                          onClick={() => {
                                            const nameInput =
                                              document.getElementById(
                                                `newItem-name-${groupIndex}-${categoryIndex}-${itemIndex}`
                                              ) as HTMLInputElement;
                                            const unitCostInput =
                                              document.getElementById(
                                                `newItem-unitCost-${groupIndex}-${categoryIndex}-${itemIndex}`
                                              ) as HTMLInputElement;
                                            const quantityInput =
                                              document.getElementById(
                                                `newItem-quantity-${groupIndex}-${categoryIndex}-${itemIndex}`
                                              ) as HTMLInputElement;

                                            if (
                                              nameInput?.value &&
                                              unitCostInput?.value &&
                                              quantityInput?.value
                                            ) {
                                              const unitCost = Number(
                                                unitCostInput.value
                                              );
                                              const quantity = Number(
                                                quantityInput.value
                                              );

                                              addNeededItem(
                                                groupIndex,
                                                categoryIndex,
                                                itemIndex,
                                                {
                                                  name: nameInput.value,
                                                  unitCost,
                                                  quantity,
                                                  totalCost:
                                                    unitCost * quantity,
                                                }
                                              );

                                              toast({
                                                title: "Item Added",
                                                description:
                                                  "Item details added successfully",
                                              });
                                            }
                                          }}
                                          className="w-full"
                                          variant="secondary"
                                        >
                                          <PlusCircle className="mr-2 h-4 w-4" />
                                          Add Item Details
                                        </Button>
                                      </>
                                    ) : (
                                      <div className="space-y-2">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="text-sm">
                                            <p className="font-medium">Name</p>
                                            <p>{item.neededItems[0].name}</p>
                                          </div>
                                          <div className="text-sm">
                                            <p className="font-medium">
                                              Unit Cost (
                                              {group.groupName === "CAPEX"
                                                ? "USD"
                                                : "SSP"}
                                              )
                                            </p>
                                            <p>
                                              {item.neededItems[0].unitCost.toLocaleString()}
                                            </p>
                                          </div>
                                          <div className="text-sm">
                                            <p className="font-medium">
                                              Quantity
                                            </p>
                                            <p>
                                              {item.neededItems[0].quantity.toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <p className="text-sm font-medium">
                                            Total:{" "}
                                            {group.groupName === "CAPEX"
                                              ? "USD"
                                              : "SSP"}{" "}
                                            {item.neededItems[0].totalCost.toLocaleString()}
                                          </p>
                                          <Button
                                            onClick={() => {
                                              removeNeededItem(
                                                groupIndex,
                                                categoryIndex,
                                                itemIndex,
                                                0
                                              );
                                              toast({
                                                title: "Item Removed",
                                                description:
                                                  "Item details removed successfully",
                                              });
                                            }}
                                            variant="destructive"
                                            size="sm"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Label htmlFor="funding-source">
                                            Funding Source
                                          </Label>
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>
                                                  Select the source of funding
                                                  for this budget item
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                          <h4>{item?.fundingSource || "-"}</h4>
                                        </div>
                                        {!hasRevenueItems ? (
                                          <div className="space-y-2">
                                            <Select disabled>
                                              <SelectTrigger id="funding-source">
                                                <SelectValue placeholder="No funding sources available" />
                                              </SelectTrigger>
                                            </Select>
                                            <Alert variant="destructive">
                                              <AlertCircle className="h-4 w-4" />
                                              <AlertTitle>Error</AlertTitle>
                                              <AlertDescription>
                                                Please add revenue sources in
                                                the Revenue tab first
                                              </AlertDescription>
                                            </Alert>
                                          </div>
                                        ) : (
                                          <Select
                                            value={item.fundingSource}
                                            onValueChange={(value) =>
                                              updateBudgetItem(
                                                groupIndex,
                                                categoryIndex,
                                                itemIndex,
                                                {
                                                  fundingSource: value,
                                                }
                                              )
                                            }
                                          >
                                            <SelectTrigger id="funding-source">
                                              <SelectValue placeholder="Select funding source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {revenueGroups?.map((revGroup) =>
                                                revGroup?.categories?.map(
                                                  (revCategory) =>
                                                    revCategory?.items?.map(
                                                      (revItem, index) => (
                                                        <TooltipProvider
                                                          key={index}
                                                        >
                                                          <Tooltip>
                                                            <TooltipTrigger
                                                              asChild
                                                            >
                                                              <SelectItem
                                                                value={`${revGroup?.groupName} | ${revCategory?.categoryName} (${revCategory?.categoryCode}) | ${revItem?.budgetCode}`}
                                                                disabled={
                                                                  !revItem?.budgetCode ||
                                                                  !revItem?.amount ||
                                                                  revItem?.amount ===
                                                                    0
                                                                }
                                                              >
                                                                {
                                                                  revGroup?.groupName
                                                                }{" "}
                                                                |{" "}
                                                                {
                                                                  revCategory?.categoryName
                                                                }{" "}
                                                                (
                                                                {
                                                                  revCategory?.categoryCode
                                                                }
                                                                ) |{" "}
                                                                {revItem?.budgetCode ||
                                                                  "No budget code"}{" "}
                                                                -{" "}
                                                                {revItem?.amount?.toLocaleString()}{" "}
                                                                {revGroup?.groupName ===
                                                                "CAPEX"
                                                                  ? "USD"
                                                                  : "SSP"}
                                                                {(!revItem?.budgetCode ||
                                                                  !revItem?.amount ||
                                                                  revItem?.amount ===
                                                                    0) &&
                                                                  ` (${
                                                                    !revItem?.budgetCode
                                                                      ? "No budget code"
                                                                      : "No funds available"
                                                                  })`}
                                                              </SelectItem>
                                                            </TooltipTrigger>
                                                            {(!revItem?.budgetCode ||
                                                              !revItem?.amount ||
                                                              revItem?.amount ===
                                                                0) && (
                                                              <TooltipContent>
                                                                <p>
                                                                  {!revItem?.budgetCode
                                                                    ? "Budget code is required"
                                                                    : "Cannot budget with zero revenue amount"}
                                                                </p>
                                                              </TooltipContent>
                                                            )}
                                                          </Tooltip>
                                                        </TooltipProvider>
                                                      )
                                                    )
                                                )
                                              )}
                                            </SelectContent>
                                          </Select>
                                        )}
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Label htmlFor="month-to-complete">
                                            Month to Complete
                                          </Label>
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>
                                                  Select the month when this
                                                  activity is expected to be
                                                  completed
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </div>
                                        <Select
                                          value={
                                            item.monthActivityToBeCompleted
                                          }
                                          onValueChange={(value) =>
                                            updateBudgetItem(
                                              groupIndex,
                                              categoryIndex,
                                              itemIndex,
                                              {
                                                monthActivityToBeCompleted:
                                                  value,
                                              }
                                            )
                                          }
                                        >
                                          <SelectTrigger id="month-to-complete">
                                            <SelectValue placeholder="Select month" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {months?.map((month) => (
                                              <SelectItem
                                                key={month}
                                                value={month}
                                              >
                                                {month}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        <Button
                          onClick={() =>
                            addBudgetItem(groupIndex, categoryIndex)
                          }
                          className="w-full mt-4"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Budget Item
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {groups?.length === 0 && (
          <EmptyState
            title="No budget data"
            description="Start by selecting OPEX or CAPEX group type to begin planning your budget."
            actionLabel="Add Budget Entry"
            onAction={() => {
              toast({
                color: "info",
                variant: "destructive",
                title: "Use dropdown at the top to start budget entry",
                description:
                  "Start by selecting OPEX or CAPEX group type to begin planning your budget.",
              });
            }}
          />
        )}
      </div>

      <BudgetPreparationInfo loggedInUser={"Logged in user"} />
    </div>
  );
}

function BudgetPreparationInfo({ loggedInUser }: { loggedInUser: string }) {
  const { meta, updateBudget } = useMetaStore();

  const handlePreparationChange = (field: string, value: string) => {
    updateBudget({
      preparation: {
        ...meta?.budget?.preparation,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Budget Preparation Information
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="preparedBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Prepared By
            </label>
            <Input
              type="text"
              id="preparedBy"
              name="preparedBy"
              className="w-full px-3 py-2"
              placeholder="Enter name of preparer"
              value={meta?.budget?.preparation?.preparedBy || ""}
              onChange={(e) =>
                handlePreparationChange("preparedBy", e.target.value)
              }
            />
          </div>

          <div>
            <label
              htmlFor="preparationDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preparation Date
            </label>
            <input
              type="date"
              id="preparationDate"
              name="preparationDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              value={meta?.budget?.preparation?.preparationDate || ""}
              onChange={(e) =>
                handlePreparationChange("preparationDate", e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="submittedBy"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Submitted By
          </label>
          <input
            type="text"
            id="submittedBy"
            name="submittedBy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            value={loggedInUser}
            onChange={(e) =>
              handlePreparationChange("submittedBy", e.target.value)
            }
            disabled
          />
        </div>
      </div>
    </div>
  );
}
