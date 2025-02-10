import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <div className="h-4 w-2 text-gray-400">/</div>
          </div>
        ))}
      </div>

      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Action buttons skeleton */}
      <div className="flex justify-end gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-24" />
        ))}
      </div>

      {/* Metric cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="mt-2 h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-4 border-b">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-28" />
        ))}
      </div>

      {/* School Information skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics and Distribution skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Key Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
