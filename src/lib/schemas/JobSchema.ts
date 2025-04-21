import { z } from "zod";

export const JobTypeEnum = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]);

// Schema for individual job links
const jobLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Must be a valid URL"),
});

export const jobSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: JobTypeEnum,
    location: z.string().min(1, "Location is required"),
    links: z.array(jobLinkSchema).optional(),
    salaryMin: z.number().nonnegative("Salary must be non-negative").optional(),
    salaryMax: z.number().nonnegative("Salary must be non-negative").optional(),
    category: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["salaryMax"],
    }
  );

export type JobValues = z.infer<typeof jobSchema>; // for react-hook-form
export type JobTypesEnum = z.infer<typeof JobTypeEnum>;
export type JobLinkValues = z.infer<typeof jobLinkSchema>;

export interface JobType {
  id: string;
  title: string;
  description: string;
  type: JobTypesEnum;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  category: string | null;
  isActive: boolean;
  createdAt: Date;
  links: {
    id: string;
    label: string;
    url: string;
  }[];
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    email: string;
    phone: string | null;
    socialLinks: {
      id: string;
      label: string;
      url: string;
    }[];
  };
}
