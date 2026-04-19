import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type Props = {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
};

export function AIModeTab({ label, icon: Icon, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs transition-colors border",
        active
          ? "bg-neutral-800 border-neutral-700 text-foreground"
          : "bg-transparent border-neutral-800 text-muted-foreground hover:text-foreground hover:border-neutral-700",
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
