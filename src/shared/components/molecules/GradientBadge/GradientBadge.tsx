import type { PropsWithChildren } from "react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { cn } from "@/shared/lib/cn";

export type GradientBadgeColor =
  | "green"
  | "red"
  | "amber"
  | "blue"
  | "purple"
  | "yellow"
  | "orange"
  | "pink"
  | "brown"
  | "neutral";

const COLOR_MAP: Record<
  GradientBadgeColor,
  { border: string; solid: string }
> = {
  green: {
    border: "from-emerald-200! via-emerald-500/40! to-emerald-200!",
    solid: "bg-emerald-600",
  },
  red: {
    border: "from-red-300/70! via-red-200/20! to-red-300/70!",
    solid: "bg-red-600",
  },
  amber: {
    border: "from-amber-200/80! via-amber-100/20! to-amber-200/80!",
    solid: "bg-amber-500",
  },
  blue: {
    border: "from-blue-300/70! via-blue-200/20! to-blue-300/70!",
    solid: "bg-blue-600",
  },
  purple: {
    border: "from-purple-300/70! via-purple-200/20! to-purple-300/70!",
    solid: "bg-purple-600",
  },
  yellow: {
    border: "from-yellow-200! via-yellow-500/40! to-yellow-200!",
    solid: "bg-yellow-500",
  },
  orange: {
    border: "from-orange-200! via-orange-500/40! to-orange-200!",
    solid: "bg-orange-600",
  },
  pink: {
    border: "from-pink-200! via-pink-500/40! to-pink-200!",
    solid: "bg-pink-600",
  },
  brown: {
    border: "from-amber-200! via-amber-700/50! to-amber-200!",
    solid: "bg-amber-800",
  },
  neutral: {
    border: "from-white/40! via-white/10! to-white/40!",
    solid: "bg-neutral-700",
  },
};

type Props = PropsWithChildren<{
  color?: GradientBadgeColor;
  className?: string;
}>;

export function GradientBadge({
  color = "neutral",
  className,
  children,
}: Props) {
  const tone = COLOR_MAP[color];
  return (
    <GradientBorder
      className={cn(
        "p-[0.8px]! rounded-full! w-fit! h-fit! inline-block!",
        tone.border,
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white whitespace-nowrap",
          tone.solid,
        )}
      >
        {children}
      </span>
    </GradientBorder>
  );
}
