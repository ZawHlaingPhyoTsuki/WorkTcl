"use client";

import { JobPostCard } from "./JobPostCard";
import { Card } from "../ui/card";
import JobPostBox from "./JobPostBox";
import { api } from "@/lib/axios";
import { JobPostCardSkeleton } from "./JobPostCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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

const getJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

export default function CenterContent({ user }: CenterContentProps) {
  const {
    data: jobs,
    isLoading,
    isError,
  } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: getJobs,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Jobs don't need real-time updates
  });

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

      {/* Job Feed - Similar to Facebook posts */}
      {isLoading ? (
        <JobPostCardSkeleton />
      ) : isError ? (
        <div className="w-full flex items-center justify-center">
          <p>Failed to load jobs</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => <JobPostCard key={job.id} job={job} />)
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
