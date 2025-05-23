// components/ui/icons.tsx
import * as LucideIcons from "lucide-react";

// Create a custom icons object that matches what we need
export const Icons = {
  user: LucideIcons.User,
  palette: LucideIcons.Palette,
  mail: LucideIcons.Mail,
  phone: LucideIcons.Phone,
  facebook: LucideIcons.Facebook,
  linkedin: LucideIcons.Linkedin,
  twitter: LucideIcons.Twitter,
  instagram: LucideIcons.Instagram,
  send: LucideIcons.Send,
  spinner: LucideIcons.Loader2,
  sun: LucideIcons.Sun,
  moon: LucideIcons.Moon,
  monitor: LucideIcons.Monitor,
};

export type IconName = keyof typeof Icons;
