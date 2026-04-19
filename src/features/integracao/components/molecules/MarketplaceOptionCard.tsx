import { Check } from "lucide-react";
import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { cn } from "@/shared/lib/utils";
import type { Marketplace } from "@/shared/types/marketplace.types";

type Props = {
  marketplace: Marketplace;
  description: string;
  selected: boolean;
  onClick: () => void;
};

export function MarketplaceOptionCard({
  marketplace,
  description,
  selected,
  onClick,
}: Props) {
  return (
    <button type="button" onClick={onClick} className="text-left w-full">
      <GradientBorder
        className={cn(
          "p-[0.8px]! rounded-xl! transition-all h-full",
          selected
            ? "from-primary/70! via-primary/20! to-primary/70!"
            : "from-white/15! via-white/5! to-white/10! hover:from-white/25! hover:via-white/10! hover:to-white/20!",
        )}
      >
        <div
          className={cn(
            "rounded-xl p-3.5 h-full flex items-start justify-between gap-3 transition-colors",
            selected
              ? "bg-gradient-to-br from-primary/10 via-neutral-900 to-neutral-900"
              : "bg-neutral-900/80",
          )}
        >
          <div className="flex flex-col gap-2 min-w-0">
            <MarketplaceLogo marketplace={marketplace} />
            <p className="text-[11px] text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          <span
            className={cn(
              "size-4 rounded-full border flex items-center justify-center shrink-0 transition-all",
              selected
                ? "bg-primary border-primary text-primary-foreground"
                : "border-neutral-600",
            )}
          >
            {selected && <Check size={10} strokeWidth={3} />}
          </span>
        </div>
      </GradientBorder>
    </button>
  );
}
