import type { Marketplace } from "@/shared/types/marketplace.types";

export type AchievementAccent = "orange" | "violet" | "dark";

export type Achievement = {
  id: string;
  count: number;
  label: string;
  accent: AchievementAccent;
};

export type ProfileWork = {
  id: string;
  sku: string;
  name: string;
  marketplace: Marketplace;
  imageUrl: string;
  price: number;
  likes: number;
  views: number;
};

export type ProfilePlan = "free" | "pro";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  avatarUrl: string;
  headline: string;
  location: string;
  bio: string;
  plan: ProfilePlan;
  phone: string;
  birthDate: string;
  emailVerified: boolean;
  stats: {
    followers: number;
    following: number;
    likes: number;
  };
  achievements: Achievement[];
  works: ProfileWork[];
};
