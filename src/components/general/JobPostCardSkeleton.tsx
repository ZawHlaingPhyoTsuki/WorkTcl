import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function JobPostCardSkeleton() {
  return (
    <Card className="p-6 border shadow-lg">
      <div className="flex flex-col gap-5">
        {/* Header with logo and basic info */}
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </div>

        {/* Salary and quick stats */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-[120px]" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-10 rounded-full" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
        </div>

        {/* Description excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[90%]" />
        </div>

        {/* Skills/tags */}
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-12 rounded-full" />
          ))}
        </div>

        {/* Footer with action button */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
