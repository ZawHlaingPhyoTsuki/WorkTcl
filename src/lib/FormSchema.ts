import { z } from "zod";

const JobTypeEnum = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]);

export const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: JobTypeEnum,
    location: z.string().min(1, "Location is required"),
    facebookUrl: z.string().url("Must be a valid URL"),
    salaryMin: z.number().nonnegative("Salary must be non-negative").optional(),
    salaryMax: z.number().nonnegative("Salary must be non-negative").optional(),
  })
  .refine(
    (data) => {
      if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
        return data.salaryMax >= data.salaryMin;
      }
      return true; // Skip validation if either field is undefined
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["salaryMax"],
    }
  );

export type FormValues = z.infer<typeof formSchema>;
