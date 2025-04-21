import { jobSchema, JobType } from "@/lib/schemas/JobSchema";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {  Prisma } from "@prisma/client";

// Helper function to get time since posting
export const getTimeSincePosting = (createdAt: string | Date) => {
  const createdDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const currentDate = new Date();
  const daysAgo = Math.floor(
    (currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isNew = daysAgo <= 7;
  const dateText =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "1d ago" : `${daysAgo}d ago`;

  return { isNew, dateText };
};

// Helper function to get display name
export const getDisplayName = (user: JobType["user"]) => {
  return user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : "User";
};

// Helper function to get salary text
export const getSalaryText = (
  job: Pick<JobType, "salaryMin" | "salaryMax">
) => {
  return job.salaryMin && job.salaryMax
    ? `฿${job.salaryMin.toLocaleString()} - ฿${job.salaryMax.toLocaleString()}/m`
    : "Salary negotiable";
};

// Helper function to format job type
export const formatJobType = (type: JobType["type"]) => {
  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to handle job creation with links
export async function createJobWithLinks(
  userId: string,
  jobData: z.infer<typeof jobSchema>
) {
  const { links, ...jobFields } = jobData;

  return await prisma.$transaction(async (prisma) => {
    // Create the job
    const newJob = await prisma.job.create({
      data: {
        ...jobFields,
        salaryMin: jobFields.salaryMin ?? null,
        salaryMax: jobFields.salaryMax ?? null,
        category: jobFields.category || null,
        userId,
      },
    });

    // Handle links (either provided or fallback to user's social links)
    await handleJobLinks(prisma, newJob.id, userId, links);

    // Return the complete job with relations
    return getJobWithRelations(prisma, newJob.id);
  });
}

// Helper function to handle job links creation
async function handleJobLinks(
  prisma: Prisma.TransactionClient,
  jobId: string,
  userId: string,
  links?: Array<{ label: string; url: string }>
) {
  if (links?.length) {
    await createJobLinks(prisma, jobId, links);
  } else {
    await fallbackToSocialLinks(prisma, jobId, userId);
  }
}

// Helper to create job links
async function createJobLinks(
  prisma: Prisma.TransactionClient,
  jobId: string,
  links: Array<{ label: string; url: string }>
) {
  await prisma.jobLink.createMany({
    data: links.map((link) => ({ ...link, jobId })),
  });
}

// Helper to fallback to user's social links
async function fallbackToSocialLinks(
  prisma: Prisma.TransactionClient,
  jobId: string,
  userId: string
) {
  const userSocialLinks = await prisma.socialLink.findMany({
    where: { userId },
  });

  if (userSocialLinks.length) {
    await createJobLinks(prisma, jobId, userSocialLinks);
  }
}

// Helper to get job with relations
async function getJobWithRelations(
  prisma: Prisma.TransactionClient,
  jobId: string
) {
  return await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      links: true,
    },
  });
}
