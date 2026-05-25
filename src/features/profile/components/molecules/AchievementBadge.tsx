import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { cn } from "@/shared/lib/utils";
import type { AchievementAccent } from "../../types/profile.types";

const ACCENT_MAP: Record<
  AchievementAccent,
  { border: string; solid: string }
> = {
  orange: {
    border: "from-orange-300/80! via-orange-500/30! to-orange-400/80!",
    solid: "bg-gradient-to-br from-orange-500 to-orange-700",
  },
  violet: {
    border: "from-violet-300/80! via-violet-500/30! to-violet-400/80!",
    solid: "bg-gradient-to-br from-violet-500 to-violet-700",
  },
  dark: {
    border: "from-white/30! via-white/10! to-white/30!",
    solid: "bg-gradient-to-br from-neutral-700 to-neutral-900",
  },
};

type Props = {
  count: number;
  label: string;
  accent: AchievementAccent;
};

export function AchievementBadge({ count, label, accent }: Props) {
  const tone = ACCENT_MAP[accent];
  return (
    <GradientBorder
      className={cn(
        "p-[1.2px]! rounded-full! w-fit! h-fit!",
        tone.border,
      )}
    >
      <span
        aria-label={label}
        className={cn(
          "size-9 rounded-full flex items-center justify-center text-[11px] font-medium text-white tabular-nums",
          tone.solid,
        )}
      >
        {count}
      </span>
    </GradientBorder>
  );
}
