"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Building,
  FileBox,
  Download,
  SortAsc,
  Info,
  Package,
} from "lucide-react";

interface BudgetItem {
  budgetCode: string;
  description: string;
  neededItems: string[];
  units: number;
  unitCostSSP: number;
  totalCostSSP: number;
  fundingSource: string;
  monthActivityToBeCompleted: string;
  group: string;
}

interface Category {
  categoryName: string;
  categoryCode: string;
  items: BudgetItem[];
}

interface Group {
  group: string;
  categories: Category[];
}

interface BudgetData {
  groups: Group[];
}

export default function BudgetBreakdown({ budget }: { budget: BudgetData }) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BudgetItem;
    direction: "asc" | "desc";
  } | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  const categories = useMemo(() => {
    const result: Record<string, BudgetItem[]> = {};

    budget.groups.forEach((group) => {
      group.categories.forEach((category) => {
        if (!result[category.categoryName]) {
          result[category.categoryName] = [];
        }
        result[category.categoryName].push(
          ...category.items.map((item) => ({ ...item, group: group.group }))
        );
      });
    });

    return result;
  }, [budget]);

  const getTotalByCategory = (categoryName: string) => {
    return categories[categoryName].reduce(
      (sum, item) => sum + item.totalCostSSP,
      0
    );
  };

  const getTotalBudget = () => {
    return Object.values(categories).reduce(
      (sum, items) =>
        sum + items.reduce((itemSum, item) => itemSum + item.totalCostSSP, 0),
      0
    );
  };

  const getPercentageOfTotal = (amount: number) => {
    const total = getTotalBudget();
    return total ? (amount / total) * 100 : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SSP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const uniqueMonths = useMemo(() => {
    const months = new Set<string>();
    Object.values(categories).forEach((items) => {
      items.forEach((item) => {
        if (item.monthActivityToBeCompleted) {
          months.add(item.monthActivityToBeCompleted);
        }
      });
    });
    return Array.from(months).sort();
  }, [categories]);

  const uniqueGroups = useMemo(() => {
    const groups = budget?.groups?.map((group) => group?.group) || [];
    const uniqueGroupsSet = new Set(groups);
    return ["all", ...Array.from(uniqueGroupsSet)];
  }, [budget]);

  const filterAndSortItems = (items: BudgetItem[]) => {
    let filtered = items.filter((item) => item.budgetCode);

    if (selectedGroup !== "all") {
      filtered = filtered.filter((item) => item.group === selectedGroup);
    }

    if (filterMonth !== "all") {
      filtered = filtered.filter(
        (item) => item.monthActivityToBeCompleted === filterMonth
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.budgetCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const exportToCSV = (categoryName: string) => {
    const items = filterAndSortItems(categories[categoryName]);
    const headers = [
      "Budget Code,Description,Needed Item,Units,Unit Cost,Total Cost,Month,Funding Source,Group",
    ];
    const rows = items.map(
      (item) =>
        `${item.budgetCode},"${item.description}","${
          item.neededItems[0] || ""
        }",${item.units},${item.unitCostSSP},${item.totalCostSSP},${
          item.monthActivityToBeCompleted
        },"${item.fundingSource}","${item.group}"`
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-${categoryName.toLowerCase().replace(" ", "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(categories).map(([categoryName, items]) => {
          const total = getTotalByCategory(categoryName);
          const percentage = getPercentageOfTotal(total);
          return (
            <Card key={categoryName} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {categoryName}
                </CardTitle>
                {categoryName === "Physical Inputs" && (
                  <Building className="h-4 w-4 text-muted-foreground" />
                )}
                {categoryName === "Learning Quality" && (
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                )}
                {categoryName === "General Support" && (
                  <FileBox className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(total)}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground mt-1">
                    {percentage.toFixed(1)}% of total budget
                  </p>
                  <h4 className="text-xs text-muted-foreground mt-1">
                    {categoryName === "Physical Inputs" && "E1"}
                    {categoryName === "Learning Quality" && "E2"}
                    {categoryName === "General Support" && "E3"}
                  </h4>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${percentage}%` }}
                  />
                  <h4>E1</h4>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="physical-inputs">
            <TabsList className="mb-2 h-12 items-stretch">
              {Object.keys(categories).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category.toLowerCase().replace(" ", "-")}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(categories).map(([categoryName, items]) => (
              <TabsContent
                key={categoryName}
                value={categoryName.toLowerCase().replace(" ", "-")}
              >
                <div className="flex justify-between">
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="Search by description or budget code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:max-w-sm"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-5 w-5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Filter budget items by month of completion</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Select
                          value={filterMonth}
                          onValueChange={setFilterMonth}
                        >
                          <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Months</SelectItem>
                            {uniqueMonths.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-5 w-5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Filter budget items by OPEX OR CAPEX</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Select
                          value={selectedGroup}
                          onValueChange={setSelectedGroup}
                        >
                          <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by group" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueGroups.map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => exportToCSV(categoryName)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export to CSV
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">
                          <div className="flex items-center gap-2">
                            Budget Code
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <SortAsc className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    setSortConfig({
                                      key: "budgetCode",
                                      direction: "asc",
                                    })
                                  }
                                >
                                  Sort Ascending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setSortConfig({
                                      key: "budgetCode",
                                      direction: "desc",
                                    })
                                  }
                                >
                                  Sort Descending
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[200px]">
                          Description
                        </TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead className="min-w-[180px]">
                          Funding Source
                        </TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Needed Item</TableHead>
                        <TableHead>Units</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Unit Cost
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <SortAsc className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    setSortConfig({
                                      key: "unitCostSSP",
                                      direction: "asc",
                                    })
                                  }
                                >
                                  Sort Ascending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setSortConfig({
                                      key: "unitCostSSP",
                                      direction: "desc",
                                    })
                                  }
                                >
                                  Sort Descending
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Total Cost
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <SortAsc className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    setSortConfig({
                                      key: "totalCostSSP",
                                      direction: "asc",
                                    })
                                  }
                                >
                                  Sort Ascending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setSortConfig({
                                      key: "totalCostSSP",
                                      direction: "desc",
                                    })
                                  }
                                >
                                  Sort Descending
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterAndSortItems(items).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.budgetCode}
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            {item.monthActivityToBeCompleted}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.fundingSource}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.group}</Badge>
                          </TableCell>
                          <TableCell>
                            {item.neededItems[0] ? (
                              <Badge variant="secondary">
                                <Package className="h-3 w-3 mr-1" />
                                {item.neededItems[0]}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                No items
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{item.units}</TableCell>
                          <TableCell>
                            {formatCurrency(item.unitCostSSP)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(item.totalCostSSP)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={6} className="font-bold">
                          Total
                        </TableCell>
                        <TableCell className="font-bold">
                          {filterAndSortItems(items).reduce(
                            (sum, item) => sum + item.units,
                            0
                          )}
                        </TableCell>
                        <TableCell>
                          {filterAndSortItems(items).reduce(
                            (sum, item) => sum + item.unitCostSSP,
                            0
                          )}
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(
                            filterAndSortItems(items).reduce(
                              (sum, item) => sum + item.totalCostSSP,
                              0
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
