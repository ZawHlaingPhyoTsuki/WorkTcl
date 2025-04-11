import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Company name must be at least 3 characters." }),
  email: z.string().email(),
  phone: z.string().optional(),
  facebook: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  telegram: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
