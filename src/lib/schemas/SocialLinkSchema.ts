import { z } from "zod";

export const socialLinkSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Must be a valid URL"),
});

export type SocialLinkValues = z.infer<typeof socialLinkSchema>; // Type for social links
