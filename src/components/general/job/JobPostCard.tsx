import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobType } from "@/lib/schemas/JobSchema";

interface JobPostCardProps {
  job: JobType;
}

export function JobPostCard({ job }: JobPostCardProps) {
  // Calculate time since posting
  const createdAt = new Date(job.createdAt);
  const currentDate = new Date();
  const daysAgo = Math.floor(
    (currentDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determine if job is new and format date text
  const isNew = daysAgo <= 7;
  const dateText =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "1d ago" : `${daysAgo}d ago`;

  // Get user display name
  const username =
    job.user.firstName && job.user.lastName
      ? `${job.user.firstName} ${job.user.lastName}`
      : "User";

  // Format salary display with proper handling of null/undefined
  const salaryText =
    job.salaryMin && job.salaryMax
      ? `฿${job.salaryMin.toLocaleString()} - ฿${job.salaryMax.toLocaleString()}/m`
      : "Salary negotiable";

  // Format job type for display (FULL_TIME -> Full Time)
  const formattedJobType = job.type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Card className="p-6 transition-all duration-200 border shadow-lg hover:shadow-xl">
      <div className="flex flex-col gap-5">
        {/* Header with logo and basic info */}
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 border">
            <AvatarImage src={job.user.profileImage || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-50 to-purple-50 text-black">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {username} - {job.user.email}
            </p>
          </div>
        </div>

        {/* Salary and status badges */}
        <div className="flex items-center justify-between">
          <span className="text-primary font-medium">{salaryText}</span>
          <div className="flex gap-2">
            {isNew && (
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                New
              </Badge>
            )}
            <Badge variant="secondary" className="text-blue-600 bg-blue-50">
              {dateText}
            </Badge>
          </div>
        </div>

        {/* Description excerpt */}
        <p className="text-sm line-clamp-2 text-muted-foreground">
          {job.description}
        </p>

        {/* Footer with action button */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{formattedJobType}</span>
            <span>•</span>
            <span>{job.location}</span>
            {job.category && (
              <>
                <span>•</span>
                <span>{job.category}</span>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-primary text-primary hover:text-primary hover:bg-primary/10"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
