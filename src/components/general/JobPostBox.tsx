"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { JobPostForm } from "./(form)/JobPostForm";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Job, KindeUserType } from "./CenterContent";

interface JobPostBoxProps {
  user: KindeUserType | null;
}

export default function JobPostBox({ user }: JobPostBoxProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  if (!user) return <div />;

  return (
    <Card className="rounded-lg shadow-sm px-4 pt-6 pb-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={user.picture || "/user-avatar.jpg"} />
            <AvatarFallback className="bg-blue-500 text-white flex items-center justify-center">
              {user.given_name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>

          <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex items-center gap-2 w-full">
              <DialogTrigger asChild className="flex-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-full h-10 bg-muted/50 hover:bg-muted/80 border-0 text-muted-foreground truncate"
                >
                  Post a job opportunity...
                </Button>
              </DialogTrigger>

              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="gap-2 text-muted-foreground hover:bg-muted/50 flex items-center shrink-0"
                >
                  <Send className="text-yellow-500 w-4 h-4" />
                  <span className="font-semibold pr-1 hidden sm:inline">
                    Post
                  </span>
                </Button>
              </DialogTrigger>
            </div>

            <DialogContent className="sm:max-w-[600px]">
              <DialogTitle>Create Job Post</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new job post.
              </DialogDescription>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.picture || "/user-avatar.jpg"} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user.given_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      Posting as {user.given_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <JobPostForm
                  onSuccess={async () => {
                    setOpen(false);
                    await queryClient.invalidateQueries<Job[]>({ queryKey: ["jobs"] });
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}
