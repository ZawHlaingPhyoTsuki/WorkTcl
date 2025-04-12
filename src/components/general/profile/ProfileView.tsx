// components/profile/ProfileView.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileDetails from "./ProfileDetails";
import ProfileForm from "./ProfileForm";

export default function ProfileView({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await api.get(`/users/${userId}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-[400px] w-full" />
        </div>
        <div className="w-full lg:w-1/2">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading profile</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/2">
        <ProfileDetails user={user} />
      </div>
      <div className="w-full lg:w-1/2">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
