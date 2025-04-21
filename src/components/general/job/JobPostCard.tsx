import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobType } from "@/lib/schemas/JobSchema";
import { SocialIcon } from "@/components/ui/social-icons";
import {
  getTimeSincePosting,
  getDisplayName,
  getSalaryText,
  formatJobType,
} from "@/lib/utils/job-helpers";

interface JobPostCardProps {
  job: JobType;
}

export function JobPostCard({ job }: JobPostCardProps) {
  // Derived values using the helper functions
  const { isNew, dateText } = getTimeSincePosting(job.createdAt);
  const username = getDisplayName(job.user);
  const salaryText = getSalaryText(job);
  const formattedJobType = formatJobType(job.type);

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
              <Badge
                variant="secondary"
                className="text-green-600 bg-green-50 dark:bg-secondary"
              >
                New
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="text-blue-600 bg-blue-50 dark:bg-secondary"
            >
              {dateText}
            </Badge>
          </div>
        </div>

        {/* Description excerpt */}
        <p className="text-sm line-clamp-2 text-muted-foreground">
          {job.description}
        </p>

        {/* Social Media Icons */}
        {job.user.socialLinks.length > 0 && (
          <div className="flex gap-2 mt-2">
            {job.user.socialLinks.map((link) => {
              // Ensure platform is valid before rendering
              const platform = link.label.toLowerCase();
              return (
                <SocialIcon key={link.id} platform={platform} url={link.url} />
              );
            })}
          </div>
        )}

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
