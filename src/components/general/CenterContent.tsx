"use client";

import { Card } from "../ui/card";
import { api } from "@/lib/axios";
import { JobPostCardSkeleton } from "./job/JobPostCardSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { useInView } from "react-intersection-observer";
import JobPostBox from "./job/JobPostBox";
import { JobPostCard } from "./job/JobPostCard";
import { JobType } from "@/lib/schemas/JobSchema";

export type KindeUserType = Awaited<
  ReturnType<ReturnType<typeof getKindeServerSession>["getUser"]>
>;

interface CenterContentProps {
  user: KindeUserType | null;
}

const getJobs = async ({ pageParam = null }: { pageParam?: string | null }) => {
  const url = `/jobs${pageParam ? `?cursor=${pageParam}&limit=5` : "?limit=5"}`;
  const res = await api.get(url);
  return res.data;
};

export default function CenterContent({ user }: CenterContentProps) {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const jobs: JobType[] = data?.pages.flatMap((page) => page.items) || []; // one single list of jobs, [{items: [...]}, {items: [...]}] ===> [{}, {}, {}, {}]

  return (
    <section className="col-span-12 md:col-span-8 flex flex-col gap-4 max-w-2xl mx-auto w-full">
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
