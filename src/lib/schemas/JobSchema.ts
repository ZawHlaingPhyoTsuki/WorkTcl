import { z } from "zod";

const JobTypeEnum = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]);

export const jobSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: JobTypeEnum,
    location: z.string().min(1, "Location is required"),
    facebookUrl: z.string().url("Must be a valid URL").optional(),
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

export type JobValues = z.infer<typeof jobSchema>;
type JobTypesEnum = z.infer<typeof JobTypeEnum>;

export interface JobType {
  id: string;
  title: string;
  description: string;
  type: JobTypesEnum;
  location: string;
  facebookUrl: string;
  salaryMin: number | null;
  salaryMax: number | null;
  category: string | null;
  isActive: boolean;
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    email: string;
    phone: string | null;
    facebookUrl: string | null;
    telegramUrl: string | null;
  };
}
