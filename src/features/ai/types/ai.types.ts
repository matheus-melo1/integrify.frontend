import type { LucideIcon } from "lucide-react";

export type AIMode = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type AISuggestion = {
  id: string;
  icon: LucideIcon;
  highlight: string;
  description: string;
};

export type AIMessageRole = "user" | "assistant";

export type AIMessage = {
  id: string;
  role: AIMessageRole;
  content: string;
  createdAt: number;
  streaming?: boolean;
};
