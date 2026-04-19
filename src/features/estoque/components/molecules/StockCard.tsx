import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { StockStatusBadge } from "./StockStatusBadge";
import type { Stock } from "../../types/stock.types";

const formatBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    n,
  );

type Props = {
  stock: Stock;
};

export function StockCard({ stock }: Props) {
  return (
    <SurfaceCard innerClassName="p-0! overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-neutral-900">
        <img
          src={stock.imageUrl}
          alt={stock.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-neutral-900/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
          <MarketplaceLogo marketplace={stock.marketplace} />
        </div>
        <div className="absolute top-2 right-2">
          <StockStatusBadge status={stock.status} />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h4 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
          {stock.name}
        </h4>
        <p className="text-[11px] text-muted-foreground">{stock.sku}</p>
        <div className="flex items-end justify-between pt-2 border-t border-neutral-700/60">
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground">Estoque</span>
            <span className="text-sm tabular-nums">{stock.quantity} un</span>
          </div>
          <span className="text-sm font-medium tabular-nums">
            {formatBRL(stock.price)}
          </span>
        </div>
      </div>
    </SurfaceCard>
  );
}
