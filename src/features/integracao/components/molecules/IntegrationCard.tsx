import { MoreHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";
import type { Integration } from "../../types/integration.types";

const formatNumber = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

type Props = {
  integration: Integration;
};

export function IntegrationCard({ integration }: Props) {
  return (
    <SurfaceCard innerClassName="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h4 className="font-medium leading-tight">{integration.name}</h4>
          <MarketplaceLogo marketplace={integration.marketplace} />
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 rounded-full text-muted-foreground"
        >
          <MoreHorizontal size={14} />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Produtos</span>
          <span className="text-sm">{formatNumber(integration.products)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Pedidos</span>
          <span className="text-sm">{formatNumber(integration.orders)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-neutral-700/60">
        <IntegrationStatusBadge status={integration.status} />
        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
          <RefreshCw size={11} />
          {integration.lastSyncAt}
        </span>
      </div>
    </SurfaceCard>
  );
}
