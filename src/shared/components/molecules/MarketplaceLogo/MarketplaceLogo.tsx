import { cn } from "@/shared/lib/cn";
import type { Marketplace } from "@/shared/types/marketplace.types";

type Tone = {
  label: string;
  initials: string;
  logoClass: string;
};

const MAP: Record<Marketplace, Tone> = {
  mercadolibre: {
    label: "Mercado Livre",
    initials: "ML",
    logoClass: "bg-yellow-400 text-yellow-950",
  },
  shoppe: {
    label: "Shopee",
    initials: "SH",
    logoClass: "bg-orange-500 text-white",
  },
  amazon: {
    label: "Amazon",
    initials: "AM",
    logoClass: "bg-amber-700 text-white",
  },
  magalu: {
    label: "Magalu",
    initials: "MG",
    logoClass: "bg-sky-500 text-white",
  },
};

type Props = {
  marketplace: Marketplace;
  className?: string;
  hideLabel?: boolean;
};

export function MarketplaceLogo({ marketplace, className, hideLabel }: Props) {
  const { label, initials, logoClass } = MAP[marketplace];
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "size-5 rounded-md flex items-center justify-center text-[9px] font-semibold tracking-tight",
          logoClass,
        )}
      >
        {initials}
      </span>
      {!hideLabel && <span className="text-xs">{label}</span>}
    </span>
  );
}
