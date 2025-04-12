"use client";

import { JobPostCard } from "./JobPostCard";
import { Card } from "../ui/card";
import JobPostBox from "./JobPostBox";
import { api } from "@/lib/axios";
import { JobPostCardSkeleton } from "./JobPostCardSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { useInView } from "react-intersection-observer";

export type KindeUserType = Awaited<
  ReturnType<ReturnType<typeof getKindeServerSession>["getUser"]>
>;
export interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  facebookUrl: string;
  salaryMin: number;
  salaryMax: number;
  createdAt: string;
  company: {
    name: string;
    email: string;
    phone?: string;
    facebook?: string;
    telegram?: string;
  };
}

interface CenterContentProps {
  user: KindeUserType | null;
}

const getJobs = async ({ pageParam = null }: { pageParam?: string | null }) => {
  // Build URL with cursor if exists
  const url = `/jobs${pageParam ? `?cursor=${pageParam}&limit=5` : "?limit=5"}`;
  const res = await api.get(url);
  return res.data; // Returns { items, nextCursor, hasNextPage }
};

export default function CenterContent({ user }: CenterContentProps) {
  const { ref, inView } = useInView(); // Hook to detect when element is visible

  const {
    data, // All pages data
    isLoading, // Initial load state
    isError, // Error state
    fetchNextPage, // Function to load next page
    hasNextPage, // If more pages exist
    isFetchingNextPage, // Loading state for next page
  } = useInfiniteQuery({
    queryKey: ["jobs"], // Unique cache key
    queryFn: getJobs, // Our fetch function
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: null, // Start with no cursor
    staleTime: 1000 * 60 * 5, // 5 minute cache
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage(); // Load next page when scrolled to bottom
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const jobs: Job[] = data?.pages.flatMap((page) => page.items) || [];

  return (
    <section className="col-span-12 md:col-span-8 flex flex-col gap-4 max-w-2xl mx-auto w-full">
      {/* Post Job Box */}
      <JobPostBox user={user} />

      {/* Stories-like Popular Companies */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Card
            key={idx}
            className="w-28 h-40 rounded-lg shrink-0 shadow-sm relative overflow-hidden"
          >
            <div className="absolute bottom-2 left-2 z-20 text-sm font-medium">
              Company {idx + 1}
            </div>
          </Card>
        ))}
      </div>

      {/* Job Feed */}
      {isLoading ? (
        <JobPostCardSkeleton />
      ) : isError ? (
        <div className="w-full flex items-center justify-center">
          <p>Failed to load jobs</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-4">
          {jobs.length > 0 ? (
            <>
              {jobs.map((job) => (
                <JobPostCard key={job.id} job={job} />
              ))}

              {/* Loading spinner or "Load More" button */}
              <div ref={ref} className="w-full flex justify-center py-4">
                {isFetchingNextPage ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
                ) : hasNextPage ? (
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    Load More
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">No more jobs</p>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <p>No jobs available at the moment.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
