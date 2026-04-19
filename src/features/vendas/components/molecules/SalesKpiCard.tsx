import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { cn } from "@/shared/lib/utils";

type Props = {
  label: string;
  value: string;
  variation?: number;
  variationSuffix?: string;
};

export function SalesKpiCard({ label, value, variation, variationSuffix = "%" }: Props) {
  const positive = variation !== undefined && variation >= 0;
  return (
    <SurfaceCard innerClassName="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-light leading-none">{value}</span>
        {variation !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs",
              positive ? "text-emerald-400" : "text-red-400",
            )}
          >
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {positive ? "+" : ""}
            {variation}
            {variationSuffix}
          </span>
        )}
      </div>
    </SurfaceCard>
  );
}
