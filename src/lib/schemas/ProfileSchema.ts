// lib/schemas/profile.ts
import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  facebookUrl: z
    .string()
    .url('Invalid URL')
    .or(z.literal(''))
    .optional(),
  telegramUrl: z
    .string()
    .url('Invalid URL')
    .or(z.literal(''))
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;