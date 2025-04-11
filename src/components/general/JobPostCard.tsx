import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job } from "./CenterContent";

interface JobPostCardProps {
  job: Job;
}

export function JobPostCard({ job }: JobPostCardProps) {
  // Calculate days since posting
  const createdAt = new Date(job.createdAt);
  const currentDate = new Date();
  const daysAgo = Math.floor(
    (currentDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determine if the job is new (within 7 days)
  const isNew = daysAgo <= 7;

  // Format the date display
  const dateText =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "1d ago" : `${daysAgo}d ago`;

  return (
    <Card className="p-6 transition-all duration-200 border shadow-lg hover:shadow-xl">
      <div className="flex flex-col gap-5">
        {/* Header with logo and basic info */}
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 rounded-xl border">
            <AvatarImage src="/company-logo.png" />
            <AvatarFallback className="bg-gradient-to-br from-blue-50 to-purple-50 text-black">
              {job.company.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">{job.company.name}</p>
          </div>
        </div>

        {/* Salary and quick stats */}
        <div className="flex items-center justify-between">
          <span className="text-primary font-medium">
            ฿{job.salaryMin.toLocaleString()} - ฿
            {job.salaryMax.toLocaleString()}/m
          </span>
          <div className="flex gap-2">
            {isNew && (
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                NEW
              </span>
            )}
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {dateText}
            </span>
          </div>
        </div>

        {/* Description excerpt */}
        <p className="text-sm line-clamp-2 text-muted-foreground">
          {job.description}
        </p>

        {/* Skills/tags - You might want to make these dynamic based on job data */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            Figma
          </Badge>
          <Badge variant="outline" className="text-xs">
            UI/UX
          </Badge>
          <Badge variant="outline" className="text-xs">
            Prototyping
          </Badge>
          <Badge variant="outline" className="text-xs">
            Design Systems
          </Badge>
        </div>

        {/* Footer with action button */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{job.type}</span>
            <span>•</span>
            <span>{job.location}</span>
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
