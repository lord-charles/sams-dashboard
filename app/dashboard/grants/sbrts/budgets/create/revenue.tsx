"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRevenueStore } from "@/app/store/revenue-store";
import { EmptyState } from "./empty-state";

const groupOptions = ["OPEX", "CAPEX"] as const;

export default function RevenueDataCollection({
  budgetCodes,
}: {
  budgetCodes: Array<{
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
    addRevenueItem,
    removeRevenueItem,
    updateRevenueItem,
    reset,
  } = useRevenueStore();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Full Revenue Data:", JSON.stringify(groups, null, 2));
    toast({
      title: "Revenue Data Saved",
      description: "Your revenue data has been saved successfully.",
    });
  };

  const handleReset = () => {
    reset();
    toast({
      title: "Revenue Data Reset",
      description: "All revenue data has been cleared.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>
            Create and manage your revenue data efficiently
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
                <AlertDialogTitle>Reset Revenue Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all revenue data from local
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
            Save Revenue Data
          </Button>
        </div>
      </div>
      <div>
        <div className="mb-2 space-y-4 pl-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
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

        {groups?.map((group, groupIndex) => (
          <Card key={group?.id} className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{group?.groupName}</CardTitle>
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
                        onClick={() => removeGroup(groupIndex)}
                      >
                        Delete Group
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Select
                    onValueChange={(value) => {
                      const category = budgetCodes[0]?.Revenue?.find(
                        (rev) => rev.category === value
                      );
                      if (category) {
                        addCategory(groupIndex, value, category.categoryCode);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Add new category" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetCodes[0]?.Revenue?.map((revType) => (
                        <SelectItem
                          key={revType?.categoryCode}
                          value={revType?.category}
                        >
                          {revType?.categoryCode} - {revType?.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {group?.categories?.map((category, categoryIndex) => (
                  <Card key={category?.id} className="mt-4">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <h4 className="text-md font-medium">
                            {category?.categoryName}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            ({category?.categoryCode})
                          </span>
                        </div>
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
                                This will permanently delete this category and
                                all its items.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  removeCategory(groupIndex, categoryIndex)
                                }
                              >
                                Delete Category
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {category?.items?.map((item, itemIndex) => (
                        <Card key={item?.id} className="mb-4">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <h5 className="text-sm font-medium">
                                Revenue Item {itemIndex + 1}
                              </h5>
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
                                      This will permanently delete this revenue
                                      item.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        removeRevenueItem(
                                          groupIndex,
                                          categoryIndex,
                                          itemIndex
                                        )
                                      }
                                    >
                                      Delete Item
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4">
                              <div>
                                <Label>Source Code & Description</Label>
                                <Select
                                  value={item?.budgetCode}
                                  onValueChange={(value) => {
                                    const selectedCategory =
                                      budgetCodes[0]?.Revenue?.find(
                                        (rev) =>
                                          rev?.category ===
                                          category?.categoryName
                                      );
                                    const selectedItem =
                                      selectedCategory?.items.find(
                                        (i) => i.budgetCode === value
                                      );
                                    if (selectedItem) {
                                      updateRevenueItem(
                                        groupIndex,
                                        categoryIndex,
                                        itemIndex,
                                        {
                                          budgetCode: value,
                                          description:
                                            selectedItem.activityDescription,
                                        }
                                      );
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select source code" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {budgetCodes[0]?.Revenue?.find(
                                      (rev) =>
                                        rev?.category === category?.categoryName
                                    )?.items.map((item) => (
                                      <SelectItem
                                        key={`${category?.id}-${item?.budgetCode}`}
                                        value={item?.budgetCode}
                                      >
                                        {item?.budgetCode} -{" "}
                                        {item?.activityDescription}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label>Description</Label>
                                <Input
                                  value={item?.description}
                                  readOnly
                                  className="bg-muted"
                                />
                              </div>

                              <div>
                                <Label>
                                  Amount (
                                  {group.groupName === "CAPEX" ? "USD" : "SSP"})
                                </Label>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    value={item.amount}
                                    onChange={(e) =>
                                      updateRevenueItem(
                                        groupIndex,
                                        categoryIndex,
                                        itemIndex,
                                        {
                                          amount: Number(e.target.value),
                                        }
                                      )
                                    }
                                    className="pl-12"
                                  />
                                  <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-muted-foreground border-r">
                                    {group.groupName === "CAPEX" ? "$" : "SSP"}
                                  </div>
                                </div>
                                {item.amount > 0 && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency:
                                        group.groupName === "CAPEX"
                                          ? "USD"
                                          : "SSP",
                                    }).format(item.amount)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        onClick={() =>
                          addRevenueItem(groupIndex, categoryIndex)
                        }
                        className="w-full"
                        variant="secondary"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Revenue Item
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {groups?.length === 0 && (
          <EmptyState
            title="No revenue data"
            description="Start by selecting OPEX or CAPEX group type to begin planning your revenue."
            actionLabel="Add Revenue Entry"
            onAction={() => {
              toast({
                color: "info",
                variant: "destructive",
                title: "Use dropdown at the top to start revenue entry",
                description:
                  "Start by selecting OPEX or CAPEX group type to begin planning your revenue.",
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
