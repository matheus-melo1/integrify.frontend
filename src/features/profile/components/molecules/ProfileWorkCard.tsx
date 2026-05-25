import { Eye, Heart } from "lucide-react";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import type { ProfileWork } from "../../types/profile.types";

const formatBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    n,
  );

const formatCount = (n: number) => {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
};

type Props = {
  work: ProfileWork;
};

export function ProfileWorkCard({ work }: Props) {
  return (
    <SurfaceCard innerClassName="p-0! overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950">
        <img
          src={work.imageUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute top-2 left-2 bg-neutral-900/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
          <MarketplaceLogo marketplace={work.marketplace} />
        </div>
        <div className="absolute top-2 right-2 bg-neutral-900/70 backdrop-blur-sm rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums">
          {formatBRL(work.price)}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h4 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
          {work.name}
        </h4>
        <p className="text-[11px] text-muted-foreground">{work.sku}</p>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-700/60">
          <span className="bg-neutral-800 rounded-full px-2 py-0.5 text-[11px] inline-flex gap-1 items-center text-muted-foreground">
            <Heart size={11} />
            {formatCount(work.likes)}
          </span>
          <span className="bg-neutral-800 rounded-full px-2 py-0.5 text-[11px] inline-flex gap-1 items-center text-muted-foreground">
            <Eye size={11} />
            {formatCount(work.views)}
          </span>
        </div>
      </div>
    </SurfaceCard>
  );
}
