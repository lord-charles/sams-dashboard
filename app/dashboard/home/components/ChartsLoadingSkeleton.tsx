"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChartLoadingSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {["Overview", "Trends", "States", "Calendar"].map((tab) => (
              <TabsTrigger key={tab} value={tab.toLowerCase()}>
                <Skeleton className="h-4 w-16" />
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-12" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <Skeleton className="h-64 w-64 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {["trends", "states", "calendar"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <Skeleton className="h-full w-full" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
