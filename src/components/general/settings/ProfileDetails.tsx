// components/profile/ProfileDetails.tsx
"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  profileImage: string | null;
  phone: string | null;
  facebookUrl: string | null;
  telegramUrl: string | null;
  createdAt: string;
}

export default function ProfileDetails({ user }: { user: UserProfile }) {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold">Profile Details</h1>
        <p className="text-muted-foreground">
          Your personal and contact information
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.profileImage || ""} />
            <AvatarFallback>
              {user.firstName?.[0] || ""}
              {user.lastName?.[0] || ""}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <div className="w-full space-y-4">
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Contact Information</h3>
              <p className="text-muted-foreground">
                {user.phone || "Not provided"}
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Social Links</h3>
              {user.facebookUrl && (
                <p className="text-muted-foreground">
                  Facebook:{" "}
                  <Link
                    href={user.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {user.facebookUrl}
                  </Link>
                </p>
              )}
              {user.telegramUrl && (
                <p className="text-muted-foreground">
                  Telegram:{" "}
                  <Link
                    href={user.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {user.telegramUrl}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
