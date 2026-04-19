import type { LucideIcon } from "lucide-react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";

type Props = {
  icon: LucideIcon;
  highlight: string;
  description: string;
  onClick?: () => void;
};

export function AISuggestionCard({
  icon: Icon,
  highlight,
  description,
  onClick,
}: Props) {
  return (
    <GradientBorder className="p-[0.8px]! rounded-2xl! from-white/20! via-white/5! to-white/20! flex">
      <button
        type="button"
        onClick={onClick}
        className="bg-neutral-900 hover:bg-neutral-800/80 rounded-2xl p-4 text-left flex flex-col gap-2 transition-colors w-full h-full"
      >
        <Icon size={16} className="text-muted-foreground" />
        <p className="text-xs leading-relaxed">
          <span className="font-medium text-foreground">{highlight}</span>{" "}
          <span className="text-muted-foreground">{description}</span>
        </p>
      </button>
    </GradientBorder>
  );
}
