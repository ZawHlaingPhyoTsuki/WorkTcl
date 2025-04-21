import { z } from "zod";

const RoleEnum = z.enum(["USER", "ADMIN"]);
const PlanEnum = z.enum(["FREE", "PRO"]);

export const userUpdateSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z
      .string()
      .regex(/^\+?[0-9\s-]+$/, "Invalid phone number")
      .optional(),
    role: RoleEnum.optional(),
    plan: PlanEnum.optional(),
  })
  .strict(); // .strict() ensures no extra fields are passed


export type UserUpdateValues = z.infer<typeof userUpdateSchema>; // Type for form values

export interface UserWithRelations {
  id: string;
  kindeId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  phone: string | null;
  role: z.infer<typeof RoleEnum>;
  plan: z.infer<typeof PlanEnum>;
  createdAt: Date;
  updatedAt: Date;
  socialLinks: {
    id: string;
    label: string;
    url: string;
  }[];
  jobs: {
    id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    createdAt: Date;
    salaryMin: number | null;
    salaryMax: number | null;
    category: string | null;
    isActive: boolean;
  }[];
}
