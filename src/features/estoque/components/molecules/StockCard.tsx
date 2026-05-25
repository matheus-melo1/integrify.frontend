import GradientBorder from "@/shared/components/molecules/GradientBorder/GradientBorder";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { StockStatusBadge } from "./StockStatusBadge";
import { StockImage } from "./StockImage";
import { StockActionsMenu } from "./StockActionsMenu";
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
    <GradientBorder className="rounded-2xl! p-[1.2px]! from-white/40 via-white/10 to-white/30">
      <div className="rounded-2xl bg-neutral-900/80 overflow-hidden flex flex-row sm:flex-col h-full">
        <div className="relative bg-neutral-900 shrink-0 w-28 aspect-square sm:w-auto sm:aspect-[4/3]">
          <StockImage
            src={stock.image}
            alt={stock.name}
            className="absolute inset-0 w-full h-full object-cover"
            iconClassName="size-10 sm:size-16"
          />
          <div className="absolute top-1.5 left-1.5 sm:top-4 sm:left-4 rounded-md p-0.5 sm:px-1.5 sm:py-0.5">
            <MarketplaceLogo marketplace={stock.marketplace} hideLabel />
          </div>
          <div className="absolute top-1.5 right-1.5 sm:top-4 sm:right-4">
            <StockStatusBadge status={stock.status} />
          </div>
        </div>
        <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium line-clamp-2 sm:min-h-[2.5rem] flex-1">
              {stock.name}
            </h4>
            <StockActionsMenu stock={stock} />
          </div>
          <p className="text-[11px] text-muted-foreground">{stock.sku}</p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2 border-t border-neutral-700/60">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                Estoque
              </span>
              <span className="text-sm tabular-nums">{stock.stock} un</span>
            </div>
            <span className="text-sm font-medium tabular-nums">
              {formatBRL(stock.price)}
            </span>
          </div>
        </div>
      </div>
    </GradientBorder>
  );
}
