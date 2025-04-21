import * as LucideIcons from "lucide-react";
import Link from "next/link";

const socialIconConfig = {
  facebook: {
    icon: LucideIcons.Facebook,
    color: "#1877F2",
  },
  linkedin: {
    icon: LucideIcons.Linkedin,
    color: "#0A66C2",
  },
  twitter: {
    icon: LucideIcons.Twitter,
    color: "#1DA1F2",
  },
  x: {
    // Add Twitter's new name if needed
    icon: LucideIcons.Twitter,
    color: "#1DA1F2",
  },
  instagram: {
    icon: LucideIcons.Instagram,
    color: "#E4405F",
  },
  youtube: {
    icon: LucideIcons.Youtube,
    color: "#FF0000",
  },
} as const;

export type SocialPlatform = keyof typeof socialIconConfig;

interface SocialIconProps {
  platform: string; // Changed to string to be more flexible
  url: string;
  size?: number;
}

export function SocialIcon({ platform, url, size = 18 }: SocialIconProps) {
  // Normalize platform name
  const normalizedPlatform = platform.toLowerCase() as SocialPlatform;

  if (!socialIconConfig[normalizedPlatform]) {
    console.warn(`Unsupported social platform: ${platform}`);
    return null;
  }

  const { icon: Icon, color } = socialIconConfig[normalizedPlatform];

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-center items-center"
    >
      <div
        className="flex justify-center items-center p-2 rounded-full"
        style={{ backgroundColor: color }}
      >
        <Icon className="text-white" size={size} />
      </div>
    </Link>
  );
}
